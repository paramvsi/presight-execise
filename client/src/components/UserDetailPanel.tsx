import { User } from '../services/api';
import { RequestResult } from '../services/websocket';

interface UserDetailPanelProps {
  user: User | null;
  streamingText: string;
  isStreaming: boolean;
  isStreamComplete: boolean;
  analysisResult?: RequestResult;
  isAnalysisPending: boolean;
}

export function UserDetailPanel({
  user,
  streamingText,
  isStreaming,
  isStreamComplete,
  analysisResult,
  isAnalysisPending,
}: UserDetailPanelProps) {
  if (!user) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">👤</div>
          <p>Select a user to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full overflow-auto">
      <div className="flex items-start gap-4 mb-6 pb-4 border-b border-gray-200">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            {user.nationality} &bull; {user.age} years old
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {user.hobbies.map((hobby) => (
              <span
                key={hobby}
                className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Activity Feed
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
          {streamingText ? (
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
              {streamingText}
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 bg-blue-600 ml-0.5 animate-pulse" />
              )}
            </div>
          ) : isStreaming ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Loading activity...
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Activity feed will appear here when you select a user.
            </div>
          )}
          {isStreamComplete && (
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-green-600">
              Activity loaded ({streamingText.length} characters)
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Analysis Result
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {isAnalysisPending ? (
            <div className="flex items-center gap-3 text-yellow-700">
              <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing user data...</span>
            </div>
          ) : analysisResult ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Analysis Score</span>
                <span className="text-2xl font-bold text-green-600">
                  {analysisResult.result.randomValue}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {analysisResult.result.message}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Completed at {new Date(analysisResult.result.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Click &quot;Analyze&quot; on a user to run analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
