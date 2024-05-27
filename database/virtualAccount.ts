import { cache } from 'react';
import { sql } from './connect';

export const getVirtualAccountBalance = cache(async (accountNumber: string) => {
  return (
    await sql<
      {
        id: number;
        availableBalance: number;
      }[]
    >`
      SELECT
        user_virtual_accounts.id,
        user_virtual_accounts.available_balance
      FROM
        user_virtual_accounts
        INNER JOIN virtual_accounts ON virtual_accounts.id = user_virtual_accounts.virtual_account_id
      WHERE
        virtual_accounts.account_number = ${accountNumber}
    `
  )[0];
});

export const getVirtualAccountInfoByAccountNumber = cache(
  async (accountNumber: string) => {
    return (
      await sql<
        {
          id: number;
          accountName: string;
          accountNumber: string;
          bankName: string;
          createdAt: Date;
          availableBalance: number;
        }[]
      >`
        SELECT
          virtual_accounts.*,
          user_virtual_accounts.available_balance
        FROM
          virtual_accounts
          INNER JOIN user_virtual_accounts ON virtual_accounts.id = user_virtual_accounts.virtual_account_id
          INNER JOIN users ON user_virtual_accounts.user_id = users.id
        WHERE
          virtual_accounts.account_number = ${accountNumber}
      `
    )[0];
  },
);

export const createVirtualAccount = cache(
  async (accountName: string, accountNumber: string, bankName: string) => {
    return (
      await sql<
        {
          id: number;
          accountName: string;
          accountNumber: string;
          bankName: string;
          createdAt: Date;
        }[]
      >`
        INSERT INTO
          virtual_accounts (
            account_name,
            account_number,
            bank_name
          )
        VALUES
          (
            ${accountName},
            ${accountNumber},
            ${bankName}
          )
        RETURNING
          virtual_accounts.*
      `
    )[0];
  },
);

export const createUserVirtualAccountInsecure = cache(
  async (userId: number, virtualAccountId: number) => {
    return (
      await sql<
        {
          id: number;
          userId: number;
          virtualAccountId: number;
          availableBalance: number;
          lockedBalance: number;
          totalBalance: number;
          createdAt: Date;
          updatedAt: Date;
        }[]
      >`
        INSERT INTO
          user_virtual_accounts (user_id, virtual_account_id)
        VALUES
          (
            ${userId},
            ${virtualAccountId}
          )
        RETURNING
          user_virtual_accounts.*
      `
    )[0];
  },
);

export const updateUserVirtualAccountBalance = cache(
  async (amount: number, accountNumber: string) => {
    return (
      await sql<
        {
          id: number;
          userId: number;
          virtualAccountId: number;
          availableBalance: number;
          lockedBalance: number;
          totalBalance: number;
          createdAt: Date;
          updatedAt: Date;
        }[]
      >`
        UPDATE user_virtual_accounts
        SET
          available_balance = available_balance + ${amount},
          updated_at = now()
        FROM
          virtual_accounts,
          users
        WHERE
          virtual_accounts.id = user_virtual_accounts.virtual_account_id
          AND users.id = user_virtual_accounts.user_id
          AND virtual_accounts.account_number = ${accountNumber}
        RETURNING
          user_virtual_accounts.*
      `
    )[0];
  },
);

export const updateUserVirtualAccountBalanceMinusAmount = cache(
  async (amount: number, accountNumber: string) => {
    return (
      await sql<
        {
          id: number;
          userId: number;
          virtualAccountId: number;
          availableBalance: number;
          lockedBalance: number;
          totalBalance: number;
          createdAt: Date;
          updatedAt: Date;
        }[]
      >`
        UPDATE user_virtual_accounts
        SET
          available_balance = available_balance - ${amount},
          updated_at = now()
        FROM
          virtual_accounts,
          users
        WHERE
          virtual_accounts.id = user_virtual_accounts.virtual_account_id
          AND users.id = user_virtual_accounts.user_id
          AND virtual_accounts.account_number = ${accountNumber}
        RETURNING
          user_virtual_accounts.*
      `
    )[0];
  },
);

// https://chatgpt.com/c/6cdf4322-0e25-488b-9984-c8eccc0d79fb
// https://www.nairaland.com/4366725/how-build-paystack-like-system
// https://bank.codes/guides/nigeria-nuban-checker-guide/
// https://www.cbn.gov.ng/out/2022/mpd/series%206.pdf
// https://www.fxcintel.com/research/reports/nigerias-digital-economy-building-digital-payments-ecosystem
// https://www.linkedin.com/pulse/understanding-nigerian-payment-gateway-space-porter-5-maro-elias/
// https://medium.com/@victormba/the-nigerian-payment-system-licenses-explained-4c987ece823e
// https://medium.com/@Hauwa22/a-beginners-guide-to-fintech-and-payments-in-nigeria-d5fcca890bd8
// https://medium.com/@Hauwa22/a-beginners-guide-to-fintech-and-payments-in-nigeria-d5fcca890bd8
// https://medium.com/@victormba/the-nigerian-payment-system-licenses-explained-4c987ece823e
