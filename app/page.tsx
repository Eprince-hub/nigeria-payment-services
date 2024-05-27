import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AppForm from './components/AppForm';

export default function Home() {
  const sessionToken = cookies().get('sessionToken');

  if (sessionToken) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AppForm />
    </main>
  );
}
