import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password.");
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        // 1. Resilient Demo Account Handling (for live resume reviewers & recruiters)
        if (normalizedEmail === "alex@example.com") {
          try {
            let demoUser = await prisma.user.findUnique({
              where: { email: "alex@example.com" },
            });

            if (!demoUser) {
              const hashedPassword = await bcrypt.hash("password123", 10);
              demoUser = await prisma.user.create({
                data: {
                  name: "Alex Morgan",
                  email: "alex@example.com",
                  passwordHash: hashedPassword,
                  role: "USER",
                  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
                },
              });

              // Seed sample resume for Alex if not present
              try {
                const sampleResume = await prisma.resume.create({
                  data: {
                    userId: demoUser.id,
                    fileName: "Alex_Morgan_Senior_Frontend_Resume.pdf",
                    fileSize: 1048576,
                    fileType: "application/pdf",
                    version: 1,
                    targetRole: "Senior Frontend Engineer",
                    targetJd: "Seeking a Senior Frontend Engineer proficient in React, Next.js, TypeScript, and modern web vitals.",
                    rawText: "ALEX MORGAN\nSan Francisco, CA • alex@example.com\nSenior Frontend Engineer...",
                    parsedSections: JSON.stringify({
                      contact: { name: "Alex Morgan", email: "alex@example.com" },
                      summary: "Senior Frontend Engineer with 6+ years experience...",
                      skills: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
                    }),
                  },
                });

                await prisma.atsReport.create({
                  data: {
                    resumeId: sampleResume.id,
                    overallScore: 84,
                    breakdown: JSON.stringify({
                      formatting: 18,
                      keywordMatch: 25,
                      sectionCompleteness: 15,
                      impact: 16,
                      grammarClarity: 14,
                    }),
                    matchedKeywords: JSON.stringify(["TypeScript", "React", "Next.js", "Tailwind CSS"]),
                    missingKeywords: JSON.stringify(["GraphQL", "CI/CD", "AWS"]),
                    bulletRewrites: JSON.stringify([]),
                    topFixes: JSON.stringify([]),
                    rawMetrics: JSON.stringify({ wordCount: 380, bulletCount: 14, quantifiedBulletCount: 10, actionVerbCount: 18 }),
                  },
                });
              } catch (seedErr) {
                console.warn("Could not seed initial demo resume:", seedErr);
              }
            }

            return {
              id: demoUser.id,
              name: demoUser.name,
              email: demoUser.email,
              image: demoUser.image,
              role: demoUser.role,
            };
          } catch (dbErr: any) {
            console.error("Database connection fallback for demo login:", dbErr?.message);
            // Fallback demo session so live resume reviewers are never blocked
            return {
              id: "demo-alex-session-id",
              name: "Alex Morgan (Demo)",
              email: "alex@example.com",
              image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
              role: "USER",
            };
          }
        }

        // 2. Standard Registered User Authentication
        try {
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (!user || !user.passwordHash) {
            throw new Error("No account found with this email. Please sign up.");
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) {
            throw new Error("Invalid password. Please check your credentials.");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (err: any) {
          if (err.message && !err.message.includes("invocation")) {
            throw err;
          }
          console.error("Authentication DB error:", err);
          throw new Error("Database service is currently initializing. Please try again in a few seconds.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  secret: process.env.NEXTAUTH_SECRET || "preppilot-default-dev-secret-key-32chars",
};
