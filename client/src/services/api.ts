const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface FiltersResponse {
  hobbies: string[];
  nationalities: string[];
}

export interface QueueResponse {
  requestId: string;
  userId?: string;
  status: string;
  message: string;
}

export async function fetchUsers(
  page: number = 1,
  limit: number = 20,
  search: string = '',
  hobbies: string[] = [],
  nationalities: string[] = []
): Promise<UsersResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.set('search', search);
  if (hobbies.length > 0) params.set('hobbies', hobbies.join(','));
  if (nationalities.length > 0) params.set('nationalities', nationalities.join(','));

  const response = await fetch(`${API_BASE}/users?${params}`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function fetchFilters(): Promise<FiltersResponse> {
  const response = await fetch(`${API_BASE}/users/filters`);
  if (!response.ok) throw new Error('Failed to fetch filters');
  return response.json();
}

export async function queueRequest(payload?: string, userId?: string): Promise<QueueResponse> {
  const response = await fetch(`${API_BASE}/queue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload, userId }),
  });
  if (!response.ok) throw new Error('Failed to queue request');
  return response.json();
}

export async function* streamText(userId?: string): AsyncGenerator<string> {
  const url = userId ? `${API_BASE}/stream?userId=${encodeURIComponent(userId)}` : `${API_BASE}/stream`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to start stream');

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}
