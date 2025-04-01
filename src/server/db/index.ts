// src/server/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env";
import * as schema from "./schema";

// Use correct pooling configuration based on environment
const connectionString = env.DATABASE_URL;
const client = postgres(connectionString, { 
  max: 1,
  prepare: false 
});

export const db = drizzle(client, { schema });