export default function Loading() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🔗</div>
        <h2 className="text-2xl font-bold text-gray-700">
          Redirecting...
        </h2>
        <p className="text-gray-500 mt-2">
          Taking you to your destination
        </p>
      </div>
    </main>
  )
}