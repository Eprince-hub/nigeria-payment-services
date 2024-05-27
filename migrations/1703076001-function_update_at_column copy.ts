import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE
    OR REPLACE function update_updated_at_column () returns trigger AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `;
}

export async function down(sql: Sql) {
  await sql`DROP FUNCTION update_updated_at_column`;
}
