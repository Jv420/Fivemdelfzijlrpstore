import mysql from 'mysql2/promise';
import { getRequiredEnv } from '@/lib/env';

let pool: mysql.Pool | null = null;

export function getPool() {
  if (pool) return pool;

  const host = getRequiredEnv('MYSQL_HOST');
  const user = getRequiredEnv('MYSQL_USER');
  const password = process.env.MYSQL_PASSWORD || '';
  const database = getRequiredEnv('MYSQL_DATABASE');
  const port = Number(process.env.MYSQL_PORT || 3306);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('MYSQL_PORT must be a valid positive number');
  }

  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 5,
    namedPlaceholders: true,
    timezone: 'Z',
  });

  return pool;
}
