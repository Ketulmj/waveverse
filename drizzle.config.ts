import { defineConfig } from "drizzle-kit";
import env from 'dotenv';
env.config()

export default defineConfig({
  schema: "./src/db/schema.ts", // path to your schema file(s)
  out: "./migrations",      
  dialect: 'postgresql', 
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres",
  },
});