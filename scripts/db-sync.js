const { execSync } = require("child_process");

console.log("--- Checking Database Setup ---");

const dbUrl = process.env.DATABASE_URL || "";

if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
  console.log("PostgreSQL DATABASE_URL detected. Synchronizing schema via Prisma...");
  try {
    execSync("npx prisma db push --skip-generate --accept-data-loss", {
      stdio: "inherit",
      timeout: 30000,
    });
    console.log("✓ Database tables verified and synchronized.");
  } catch (err) {
    console.warn("⚠️ Notice: Could not sync Prisma schema during build:", err.message);
    console.warn("The application will continue building.");
  }
} else {
  console.log("ℹ️ No remote PostgreSQL DATABASE_URL detected during build. Skipping db push.");
}
