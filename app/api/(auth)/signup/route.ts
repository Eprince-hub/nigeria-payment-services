import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createUserInsecure, getUserByEmail } from '../../../../database/users';
import {
  createUserVirtualAccountInsecure,
  createVirtualAccount,
} from '../../../../database/virtualAccount';

export type User = {
  id: number;
  fullName: string;
  email: string;
};

export type RegisterResponseBodyPost =
  | {
      user: User;
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<RegisterResponseBodyPost>> {
  const body = await request.json();

  if (!body) {
    return NextResponse.json(
      { errors: [{ message: 'Invalid request' }] },
      {
        status: 400,
      },
    );
  }

  const user = await getUserByEmail(body.email);

  if (user) {
    return NextResponse.json(
      { errors: [{ message: 'User already exists' }] },
      {
        status: 400,
      },
    );
  }

  const newUser = await createUserInsecure(body.fullName, body.email);

  if (!newUser) {
    return NextResponse.json(
      { errors: [{ message: 'Error creating the new user' }] },
      { status: 500 },
    );
  }

  const virtualAccount = await createVirtualAccount(
    body.fullName,
    crypto.randomInt(10_000, 99_99999999).toString(),
    'Bank Name',
  );

  if (!virtualAccount) {
    return NextResponse.json(
      { errors: [{ message: 'Error creating the new virtual account' }] },
      {
        status: 500,
      },
    );
  }

  const userVirtualAccount = await createUserVirtualAccountInsecure(
    newUser.id,
    virtualAccount.id,
  );

  if (!userVirtualAccount) {
    return NextResponse.json(
      { errors: [{ message: 'Error creating the new user virtual account' }] },
      {
        status: 500,
      },
    );
  }

  //  Coming in subsequent lecture
  // 6. Create a token
  const token = crypto.randomBytes(100).toString('base64');

  if (!token) {
    return NextResponse.json(
      { errors: [{ message: 'Error creating the new session' }] },
      {
        status: 401,
      },
    );
  }

  cookies().set({
    name: 'sessionToken',
    value: JSON.stringify({
      token,
      email: newUser.email,
      fullName: newUser.fullName,
      accountNumber: virtualAccount.accountNumber,
    }),
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secure: true,
    httpOnly: true,
  });

  // 9. Send the new cookie in the headers
  return NextResponse.json({
    user: newUser,
  });
}
