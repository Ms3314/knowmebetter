
export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 sm:p-20 bg-gradient-to-br from-white to-gray-100 text-gray-800 font-sans">
      

      {/* Main Content */}
      <main className="w-full max-w-4xl space-y-8 text-center">
        <section>
          <h2 className="text-3xl font-semibold mb-4">Explore Anonymous Communication</h2>
          <p className="text-lg text-gray-600">
            KnowmeBetter allows you to create a unique profile where others can send you messages and questions without revealing who they are. 
            Manage your messages and control your availability through your personal dashboard.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4">Key Features</h3>
          <ul className="text-left space-y-2 text-gray-700 mx-auto max-w-xl">
            <li>✅ let others send you messages without them revealing their identity.</li>
            <li>✅ Unique Profile Links: Share your custom profile link to receive messages.</li>
            <li>✅ User Dashboard: Manage messages and control message acceptance.</li>
            <li>✅ Verification: Account verification via email code.</li>
            <li>✅ Copy Link: Share your unique link to receive messages.</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mt-10 text-center text-sm text-gray-500">
        Made with ❤️ by Mohammed Samiuddin
      </footer>
    </div>
  );
}

