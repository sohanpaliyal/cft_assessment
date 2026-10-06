import dotenv from 'dotenv';
import { Pool, QueryResult } from 'pg';

// 1. Load the variables from your .env file
dotenv.config();

// 2. Initialize the connection using those variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

// Test the database connection
pool.query('SELECT NOW()', (err: Error | undefined, res: QueryResult | undefined) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else if (res && res.rows.length > 0) {
    console.log('✅ Database connected successfully at:', res.rows[0].now);
  }
});

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
  return pool.query(text, params);
};

export default pool;
