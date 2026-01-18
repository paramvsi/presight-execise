import { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { UserCard, AnalysisStatus } from './UserCard';
import { User } from '../../services/api';
import { RequestResult } from '../../services/websocket';

interface UserListProps {
  users: User[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  selectedUserId?: string;
  pendingAnalysis?: Set<string>;
  analysisResults?: Map<string, RequestResult>;
  onSelectUser?: (user: User) => void;
  onAnalyzeUser?: (user: User) => void;
}

export function UserList({
  users,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  selectedUserId,
  pendingAnalysis,
  analysisResults,
  onSelectUser,
  onAnalyzeUser,
}: UserListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = items[items.length - 1];
    if (!lastItem) return;

    if (
      lastItem.index >= users.length - 5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [items, users.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getAnalysisStatus = (userId: string): AnalysisStatus => {
    if (analysisResults?.has(userId)) return 'completed';
    if (pendingAnalysis?.has(userId)) return 'pending';
    return 'none';
  };

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto rounded-lg border border-gray-200"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {items.map((virtualItem) => {
          const user = users[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="p-1">
                <UserCard
                  user={user}
                  isSelected={selectedUserId === user.id}
                  analysisStatus={getAnalysisStatus(user.id)}
                  analysisResult={analysisResults?.get(user.id)}
                  onSelect={onSelectUser}
                  onAnalyze={onAnalyzeUser}
                />
              </div>
            </div>
          );
        })}
      </div>
      {isFetchingNextPage && (
        <div className="p-4 text-center text-gray-500">Loading more...</div>
      )}
    </div>
  );
}
