import { cache } from 'react';
import { User } from '../app/api/(auth)/signup/route';
import { sql } from './connect';

export const createUserInsecure = cache(
  async (fullName: string, email: string) => {
    const [user] = await sql<User[]>`
      INSERT INTO
        users (full_name, email)
      VALUES
        (
          ${fullName},
          ${email}
        )
      RETURNING
        users.id,
        users.full_name,
        users.email
    `;
    return user;
  },
);

export const getUserByEmail = cache(async (email: string) => {
  const [user] = await sql<
    { id: number; fullName: string; email: string; createdTimestamp: Date }[]
  >`
    SELECT
      *
    FROM
      users
    WHERE
      email = ${email}
  `;
  return user;
});
