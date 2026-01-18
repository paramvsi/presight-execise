import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUsers, UsersResponse } from '../services/api';

interface UseInfiniteUsersOptions {
  search?: string;
  hobbies?: string[];
  nationalities?: string[];
  limit?: number;
}

export function useInfiniteUsers({
  search = '',
  hobbies = [],
  nationalities = [],
  limit = 20,
}: UseInfiniteUsersOptions = {}) {
  return useInfiniteQuery<UsersResponse>({
    queryKey: ['users', search, hobbies, nationalities, limit],
    queryFn: ({ pageParam }) =>
      fetchUsers(pageParam as number, limit, search, hobbies, nationalities),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
  });
}
