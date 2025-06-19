import { Pool } from "pg";
import dotenv from "dotenv";
import logger from "../config/logger";

dotenv.config();

const getDatabaseUrl = (): string => {
  if (process.env.NODE_ENV === "production") {
    return process.env.DATABASE_URL_PROD || "";
  } else if (process.env.NODE_ENV === "test") {
    return process.env.DATABASE_URL_TEST || "";
  } else {
    return process.env.DATABASE_URL || "";
  }
};

export const pool = new Pool({
  connectionString: getDatabaseUrl(),
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    client.release();
    logger.info(
      `Connected to PostgreSQL [${process.env.NODE_ENV || "development"}]`
    );
  } catch (error) {
    console.error("PostgreSQL Connection Error:", error);
    process.exit(1);
  }
};

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Closing PostgreSQL connection...`);
  await pool.end();
  console.log("PostgreSQL pool disconnected");
  process.exit(0);
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});