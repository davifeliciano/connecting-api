import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

pg.types.setTypeParser(
  pg.types.builtins.TIMESTAMP,
  (stringValue) => stringValue
);

const pool = new pg.Pool({
  connectionString,
  ssl: process.env.MODE === "production",
});

export default pool;
