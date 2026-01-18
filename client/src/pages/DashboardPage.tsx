import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteUsers } from '../hooks/useInfiniteUsers';
import { useStreamingText } from '../hooks/useStreamingText';
import { useWebSocket } from '../hooks/useWebSocket';
import { UserList } from '../components/task1/UserList';
import { FilterPanel } from '../components/task1/FilterPanel';
import { SearchBox } from '../components/task1/SearchBox';
import { UserDetailPanel } from '../components/UserDetailPanel';
import { User, queueRequest } from '../services/api';

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingAnalysis, setPendingAnalysis] = useState<Set<string>>(new Set());

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteUsers({
    search,
    hobbies: selectedHobbies,
    nationalities: selectedNationalities,
  });

  const { isConnected, results: wsResults } = useWebSocket();
  const { text: streamingText, isStreaming, isComplete, startStream, reset: resetStream } = useStreamingText();

  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.pagination.total ?? 0;

  const analysisResultsByUser = useMemo(() => {
    const map = new Map<string, typeof wsResults extends Map<string, infer V> ? V : never>();
    wsResults.forEach((result) => {
      if (result.userId) {
        map.set(result.userId, result);
      }
    });
    return map;
  }, [wsResults]);

  useEffect(() => {
    wsResults.forEach((result) => {
      if (result.userId && pendingAnalysis.has(result.userId)) {
        setPendingAnalysis(prev => {
          const next = new Set(prev);
          next.delete(result.userId!);
          return next;
        });
      }
    });
  }, [wsResults, pendingAnalysis]);

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
  }, []);

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUser(user);
    resetStream();
    startStream(user.id);
  }, [startStream, resetStream]);

  const handleAnalyzeUser = useCallback(async (user: User) => {
    if (pendingAnalysis.has(user.id)) return;

    setPendingAnalysis(prev => new Set(prev).add(user.id));
    try {
      await queueRequest(`Analyze user ${user.name}`, user.id);
    } catch (error) {
      console.error('Failed to queue analysis:', error);
      setPendingAnalysis(prev => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    }
  }, [pendingAnalysis]);

  const handleAnalyzeAll = useCallback(async () => {
    const visibleUsers = users.slice(0, 5);
    for (const user of visibleUsers) {
      if (!pendingAnalysis.has(user.id) && !analysisResultsByUser.has(user.id)) {
        handleAnalyzeUser(user);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }, [users, pendingAnalysis, analysisResultsByUser, handleAnalyzeUser]);

  const completedCount = analysisResultsByUser.size;
  const pendingCount = pendingAnalysis.size;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            &larr; Back to Home
          </Link>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isConnected
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          User Analytics Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Browse users, view activity streams, and run real-time analysis
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <SearchBox onSearch={handleSearch} />
            <FilterPanel
              selectedHobbies={selectedHobbies}
              selectedNationalities={selectedNationalities}
              onHobbiesChange={setSelectedHobbies}
              onNationalitiesChange={setSelectedNationalities}
            />
            {(selectedHobbies.length > 0 || selectedNationalities.length > 0) && (
              <button
                onClick={() => {
                  setSelectedHobbies([]);
                  setSelectedNationalities([]);
                }}
                className="w-full px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Clear All Filters
              </button>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Bulk Actions</h3>
              <button
                onClick={handleAnalyzeAll}
                disabled={pendingCount > 0}
                className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pendingCount > 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Analyze Top 5 Users
              </button>
              {(pendingCount > 0 || completedCount > 0) && (
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium text-green-600">{completedCount}</span>
                  </div>
                  {pendingCount > 0 && (
                    <div className="flex justify-between">
                      <span>In Progress:</span>
                      <span className="font-medium text-yellow-600">{pendingCount}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              Showing {users.length} of {totalCount} users
            </div>
          </div>

          <div className="lg:col-span-5">
            {isLoading ? (
              <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
                <div className="text-gray-500">Loading users...</div>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-red-200">
                <div className="text-red-500">Failed to load users</div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
                <div className="text-gray-500">No users found</div>
              </div>
            ) : (
              <UserList
                users={users}
                hasNextPage={hasNextPage ?? false}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                selectedUserId={selectedUser?.id}
                pendingAnalysis={pendingAnalysis}
                analysisResults={analysisResultsByUser}
                onSelectUser={handleSelectUser}
                onAnalyzeUser={handleAnalyzeUser}
              />
            )}
          </div>

          <div className="lg:col-span-4">
            <UserDetailPanel
              user={selectedUser}
              streamingText={streamingText}
              isStreaming={isStreaming}
              isStreamComplete={isComplete}
              analysisResult={selectedUser ? analysisResultsByUser.get(selectedUser.id) : undefined}
              isAnalysisPending={selectedUser ? pendingAnalysis.has(selectedUser.id) : false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
