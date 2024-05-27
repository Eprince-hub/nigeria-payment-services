import { NextRequest, NextResponse } from 'next/server';
import {
  getVirtualAccountBalance,
  updateUserVirtualAccountBalanceMinusAmount,
} from '../../../database/virtualAccount';

export type ServicePaymentPost =
  | {
      status: string;
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ServicePaymentPost>> {
  const body = await request.json();

  if (!body) {
    return NextResponse.json(
      { errors: [{ message: 'Invalid request' }] },
      {
        status: 400,
      },
    );
  }

  const paymentAccount = await getVirtualAccountBalance(body.accountNumber);

  if (!paymentAccount) {
    return NextResponse.json(
      { errors: [{ message: 'Your balance is too low' }] },
      {
        status: 404,
      },
    );
  }

  if (paymentAccount.availableBalance < Number(body.amount)) {
    return NextResponse.json(
      { errors: [{ message: 'Not enough balance for this transaction' }] },
      {
        status: 400,
      },
    );
  }

  // You can proceed to pay for the service here

  // Update the account balance
  const updatedAccount = await updateUserVirtualAccountBalanceMinusAmount(
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
  // This could also work without writing a new function
  // const updatedAccount = await updateUserVirtualAccountBalance(
  //   -body.amount,
  //   body.accountNumber,
  // );

  return NextResponse.json({
    status: 'success',
  });
}
