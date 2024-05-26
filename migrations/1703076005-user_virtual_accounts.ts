import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS user_virtual_accounts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id),
      virtual_account_id integer NOT NULL REFERENCES virtual_accounts (id)
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE user_virtual_accounts`;
}
