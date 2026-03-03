import "dotenv/config";
import { beforeEach, afterAll } from "vitest";
import { getPrisma } from "../src/db/prisma";

const prisma = getPrisma();

beforeEach(async () => {
  await prisma.$executeRawUnsafe(`
    DO $$
    DECLARE
      r RECORD;
    BEGIN
      FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
      ) LOOP
        EXECUTE 'TRUNCATE TABLE ' 
          || quote_ident(r.tablename) 
          || ' RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `);
});

afterAll(async () => {
  await prisma.$disconnect();
});