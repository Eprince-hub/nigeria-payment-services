import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id integer PRIMARY key generated always AS identity,
      full_name varchar(80) NOT NULL,
      email varchar(100) UNIQUE NOT NULL,
      created_timestamp timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users`;
}
