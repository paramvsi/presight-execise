import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          User Analytics Platform
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          A comprehensive dashboard for browsing users, viewing real-time activity feeds,
          and running analytics with live updates.
        </p>

        <div className="max-w-xl mx-auto">
          <Link
            to="/dashboard"
            className="block p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              User Analytics Dashboard
            </h2>
            <p className="mt-3 text-gray-600">
              Browse and search through users with virtual scrolling. Select any user to see their
              streaming activity feed in real-time. Run analysis on individual users or in bulk,
              with live progress updates.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                User Browsing
              </span>
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                Live Activity Feed
              </span>
              <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                Real-time Analysis
              </span>
            </div>
            <span className="inline-block mt-6 text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
              Open Dashboard &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
