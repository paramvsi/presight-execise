import { User } from '../../services/api';
import { RequestResult } from '../../services/websocket';

export type AnalysisStatus = 'none' | 'pending' | 'completed';

interface UserCardProps {
  user: User;
  isSelected?: boolean;
  analysisStatus?: AnalysisStatus;
  analysisResult?: RequestResult;
  onSelect?: (user: User) => void;
  onAnalyze?: (user: User) => void;
}

export function UserCard({
  user,
  isSelected = false,
  analysisStatus = 'none',
  analysisResult,
  onSelect,
  onAnalyze,
}: UserCardProps) {
  const displayedHobbies = user.hobbies.slice(0, 2);
  const remainingCount = user.hobbies.length - 2;

  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:shadow-md hover:border-gray-300'
      }`}
      onClick={() => onSelect?.(user)}
    >
      <img
        src={user.avatar}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
          {analysisStatus === 'pending' && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full flex-shrink-0">
              <div className="w-2 h-2 border border-yellow-600 border-t-transparent rounded-full animate-spin" />
              Analyzing
            </span>
          )}
          {analysisStatus === 'completed' && analysisResult && (
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full flex-shrink-0">
              Score: {analysisResult.result.randomValue}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {user.nationality} &bull; {user.age} years old
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {displayedHobbies.map((hobby) => (
            <span
              key={hobby}
              className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {hobby}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{remainingCount}
            </span>
          )}
        </div>
      </div>
      {onAnalyze && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze(user);
          }}
          disabled={analysisStatus === 'pending'}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex-shrink-0 ${
            analysisStatus === 'pending'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {analysisStatus === 'pending' ? 'Analyzing...' : 'Analyze'}
        </button>
      )}
    </div>
  );
}
