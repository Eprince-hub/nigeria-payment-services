export default function Dashboard({ userName }: { userName: string }) {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="text-xl text-gray-700">Welcome, {userName}</div>
    </div>
  );
}
