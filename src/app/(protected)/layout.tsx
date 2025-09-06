export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Protected routes wrapper */}
      <div className='flex'>
        {/* Sidebar can be added here later */}
        <main className='flex-1'>{children}</main>
      </div>
    </div>
  );
}
