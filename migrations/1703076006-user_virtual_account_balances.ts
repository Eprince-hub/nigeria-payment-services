import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS user_virtual_account_balances (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL UNIQUE REFERENCES users (id),
      available_balance integer NOT NULL UNIQUE DEFAULT 0,
      locked_balance integer NOT NULL UNIQUE DEFAULT 0,
      total_balance integer NOT NULL UNIQUE DEFAULT 0,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE user_virtual_accounts`;
}
