import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

export const mysqlClient = {
  query: async (sql: string, params: any[] = []) => {
    try {
      const [rows] = await pool.execute(sql, params);
      return { data: rows, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
};
