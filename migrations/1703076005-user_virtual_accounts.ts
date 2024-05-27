import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS user_virtual_accounts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id),
      virtual_account_id integer NOT NULL REFERENCES virtual_accounts (id),
      available_balance integer NOT NULL DEFAULT 0,
      locked_balance integer NOT NULL DEFAULT 0,
      total_balance integer NOT NULL DEFAULT 0,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE user_virtual_accounts`;
}
