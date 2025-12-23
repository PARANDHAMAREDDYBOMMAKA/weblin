import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-purple-900 to-pink-900">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            LinWeb
          </h1>
          <p className="text-2xl text-gray-200 mb-4">
            Run Linux Distributions in Your Browser
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience the power of Linux directly in your web browser. No installation,
            no VM, no containers needed. Powered by WebAssembly and v86.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Instant Access
              </h3>
              <p className="text-gray-300">
                No downloads or installations required
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                100% Browser-Based
              </h3>
              <p className="text-gray-300">
                Everything runs locally in your browser
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🐧</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Multiple Distros
              </h3>
              <p className="text-gray-300">
                Choose from Alpine, Debian, or Arch Linux
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/linux"
              className="inline-block px-12 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-full transition-all transform hover:scale-105 shadow-2xl"
            >
              Launch Linux Now
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            How It Works
          </h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start">
              <span className="text-green-400 font-bold mr-3">1.</span>
              <p>Click Launch Linux Now to access the emulator</p>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 font-bold mr-3">2.</span>
              <p>Select your preferred Linux distribution</p>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 font-bold mr-3">3.</span>
              <p>Wait for the system to boot (2-5 minutes)</p>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 font-bold mr-3">4.</span>
              <p>Start using Linux with full GUI support in your browser</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
