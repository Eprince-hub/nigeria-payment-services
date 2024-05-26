import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS virtual_accounts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE virtual_accounts`;
}
