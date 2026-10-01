import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Add it to .env.local."
  );
}

/*
  Keep the original DATABASE_URL for Prisma CLI commands,
  but remove SSL URL parameters for the runtime adapter.

  node-postgres replaces the explicit ssl object whenever
  sslmode or related SSL parameters exist in the URL.
*/
const runtimeDatabaseUrl = new URL(connectionString);

runtimeDatabaseUrl.searchParams.delete("sslmode");
runtimeDatabaseUrl.searchParams.delete("sslcert");
runtimeDatabaseUrl.searchParams.delete("sslkey");
runtimeDatabaseUrl.searchParams.delete("sslrootcert");

const globalForPrisma = globalThis as unknown as {
  prisma803TakeoverTls?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: runtimeDatabaseUrl.toString(),

  ssl: {
    rejectUnauthorized: false,
  },

  connectionTimeoutMillis: 10_000,
});

export const prisma =
  globalForPrisma.prisma803TakeoverTls ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma803TakeoverTls = prisma;
}

export default prisma;