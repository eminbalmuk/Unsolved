import "dotenv/config";
import { defineConfig } from "prisma/config";

function isPostgresUrl(value: string | undefined) {
  return Boolean(
    value &&
      (value.startsWith("postgresql://") || value.startsWith("postgres://")),
  );
}

const datasourceUrl =
  (isPostgresUrl(process.env.DIRECT_URL) ? process.env.DIRECT_URL : undefined) ||
  (isPostgresUrl(process.env.POSTGRES_URL_NON_POOLING)
    ? process.env.POSTGRES_URL_NON_POOLING
    : undefined) ||
  (isPostgresUrl(process.env.DATABASE_URL) ? process.env.DATABASE_URL : undefined) ||
  (isPostgresUrl(process.env.POSTGRES_PRISMA_URL)
    ? process.env.POSTGRES_PRISMA_URL
    : undefined) ||
  "postgresql://postgres:postgres@localhost:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
