export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-8">
      <div className="max-w-2xl text-center">
        <img src="/favicon.ico" alt="BarkBook logo" className="mx-auto w-20 h-20 mb-6 rounded-xl" />
        <h1 className="text-4xl font-bold mb-4">BarkBook</h1>
        <p className="text-lg mb-6">
          Smart CRM software designed for pet groomers. Manage bookings, track
          vaccines, send reminders, and simplify your grooming business.
        </p>
        <a
          href="mailto:hello@barkbook.app"
          className="px-6 py-3 bg-coral-500 text-white rounded-lg shadow hover:bg-coral-600"
        >
          Request Early Access
        </a>
        <p className="mt-6 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} BarkBook. All rights reserved.
        </p>
      </div>
    </main>
  );
}
