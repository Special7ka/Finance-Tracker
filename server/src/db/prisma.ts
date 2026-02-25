import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient | null = null;

export function getPrisma() {
  if (prisma) return prisma;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is missing. Check your .env and dotenv loading.");
  }

  const adapter = new PrismaPg({ connectionString: url });

  prisma = new PrismaClient({ adapter });

  return prisma;
}