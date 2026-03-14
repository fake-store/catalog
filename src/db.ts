import { Pool } from 'pg';
import runner from 'node-pg-migrate';
import path from 'path';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fakestore_catalog',
  user: process.env.DB_USER || 'fakestore_catalog_app',
  password: process.env.DB_PASSWORD || '',
});

export async function runMigrations(): Promise<void> {
  await runner({
    databaseUrl: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'fakestore_catalog',
      user: process.env.DB_ADMIN_USER || process.env.DB_USER || 'fakestore_catalog_app',
      password: process.env.DB_ADMIN_PASSWORD || process.env.DB_PASSWORD || '',
    },
    migrationsTable: 'pgmigrations',
    dir: path.join(__dirname, '..', 'migrations'),
    direction: 'up',
    log: (msg: string) => console.log('[migrate]', msg),
  });
}
