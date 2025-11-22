// import pkg from "pg";
// const { Pool } = pkg;
// import dotenv from "dotenv";
// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, // required for Neon
//   },
// });

// export default pool;






import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * Validate the presence of DATABASE_URL at compile/runtime.
 * This prevents undefined connection strings in production.
 */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("❌ DATABASE_URL is missing in environment variables.");
}

// Create a new Postgres connection pool
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Neon / cloud PostgreSQL
  },
});

export default pool;
