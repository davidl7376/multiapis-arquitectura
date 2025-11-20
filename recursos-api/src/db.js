import pg from "pg";

export const pool = new pg.Pool({
  user: 'postgres',
  host: 'postgres',  // ← nombre del servicio en Docker
  database: 'multiapisdb',
  password: 'password',
  port: 5432,
  ssl: false  // ← false en lugar del objeto
});