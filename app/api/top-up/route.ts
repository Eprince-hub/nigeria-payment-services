import { NextRequest, NextResponse } from 'next/server';
import { updateUserVirtualAccountBalance } from '../../../database/virtualAccount';

export type TopupResponsePost =
  | {
      status: string;
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<TopupResponsePost>> {
  const body = await request.json();

  if (!body) {
    return NextResponse.json(
      { errors: [{ message: 'Invalid request' }] },
      {
        status: 400,
      },
    );
  }

  const updatedAccount = await updateUserVirtualAccountBalance(
    Number(body.amount),
    body.accountNumber,
  );

  if (!updatedAccount) {
    return NextResponse.json(
      { errors: [{ message: 'Error updating the account balance' }] },
      {
        status: 500,
      },
    );
  }
  return NextResponse.json({
    status: 'success',
  });
}
