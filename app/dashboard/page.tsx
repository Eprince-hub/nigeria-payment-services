import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getVirtualAccountInfoByAccountNumber } from '../../database/virtualAccount';
import Dashboard from './Dashboard';
import DashboardManagement from './DashboardManagement';

export default async function page() {
  const sessionTokenCookie = cookies().get('sessionToken');

  const sessionToken:
    | {
        token: string;
        email: string;
        fullName: string;
        accountNumber: string;
      }
    | undefined =
    sessionTokenCookie && JSON.parse(String(sessionTokenCookie.value));

  if (!sessionToken) {
    redirect('/');
  }

  if (!sessionToken.token) {
    redirect('/');
  }

  const virtualAccount = await getVirtualAccountInfoByAccountNumber(
    sessionToken.accountNumber,
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <Dashboard userName={sessionToken.fullName} />
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Account Balance Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Account Balance
                </h3>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  ₦ {virtualAccount?.availableBalance}.00
                </div>
              </div>
              <small className="block bg-gray-100 px-4 py-2 text-sm text-gray-700">
                Account Number: {sessionToken.accountNumber}
              </small>
            </div>

            {/* Transactions Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Transactions
                </h3>
                <ul className="mt-2 text-gray-700">
                  <li>Top-up: $50.00</li>
                  <li>Top-up: $100.00</li>
                  <li>Purchase: $20.00</li>
                  <li>Top-up: $30.00</li>
                </ul>
              </div>
            </div>

            {/* Services Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Services
                </h3>
                <ul className="mt-2 text-gray-700">
                  <li>Mobile Top-up</li>
                  <li>Bill Payments</li>
                  <li>Gift Cards</li>
                  <li>Data Packages</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 px-4 py-6 sm:px-0">
          Account Management
        </h2>
        {/* Account management for buying services and paying money into the account */}
        <DashboardManagement accountNumber={sessionToken.accountNumber} />
      </main>
    </div>
  );
}
