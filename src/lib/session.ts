import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) return user;
  }

  // Fallback to default demo user for seamless local testing
  const demo = await prisma.user.findFirst({
    where: { email: "alex@example.com" },
  });

  return demo;
}
