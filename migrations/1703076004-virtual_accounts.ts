import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS virtual_accounts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      account_name varchar(100) UNIQUE NOT NULL,
      account_number varchar(20) UNIQUE NOT NULL,
      bank_name varchar(10) NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE virtual_accounts`;
}
