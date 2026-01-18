import { useState, useCallback, useRef } from 'react';
import { streamText } from '../services/api';

interface UseStreamingTextReturn {
  text: string;
  isStreaming: boolean;
  isComplete: boolean;
  error: string | null;
  startStream: (userId?: string) => Promise<void>;
  reset: () => void;
}

export function useStreamingText(): UseStreamingTextReturn {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async (userId?: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setText('');
    setIsStreaming(true);
    setIsComplete(false);
    setError(null);

    try {
      for await (const chunk of streamText(userId)) {
        setText((prev) => prev + chunk);
      }
      setIsComplete(true);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'Stream failed');
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setText('');
    setIsStreaming(false);
    setIsComplete(false);
    setError(null);
  }, []);

  return { text, isStreaming, isComplete, error, startStream, reset };
}
