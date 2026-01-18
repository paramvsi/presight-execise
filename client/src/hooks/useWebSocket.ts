import { useEffect, useCallback, useState } from 'react';
import { getSocket, disconnectSocket, RequestResult } from '../services/websocket';

interface UseWebSocketReturn {
  isConnected: boolean;
  results: Map<string, RequestResult>;
  clearResults: () => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [results, setResults] = useState<Map<string, RequestResult>>(new Map());

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('request-result', (data: RequestResult) => {
      setResults((prev) => new Map(prev).set(data.requestId, data));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('request-result');
      disconnectSocket();
    };
  }, []);

  const clearResults = useCallback(() => {
    setResults(new Map());
  }, []);

  return { isConnected, results, clearResults };
}
