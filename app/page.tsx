export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-4">URL Shortener</h1>
        <p className="text-gray-600 text-center mb-6">
          Paste your long URL and create a short one.
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your long URL"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Shorten URL
          </button>
        </div>
      </div>
    </main>
  );
}