import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { faker } from '@faker-js/faker';

interface QueueItem {
  requestId: string;
  payload: string;
  userId?: string;
}

const queue: QueueItem[] = [];
let io: SocketIOServer | null = null;
let isProcessing = false;

export function addToQueue(requestId: string, payload: string, userId?: string): void {
  queue.push({ requestId, payload, userId });
  processQueue();
}

async function processItem(item: QueueItem): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const result = {
    processedPayload: item.payload,
    timestamp: new Date().toISOString(),
    randomValue: faker.number.int({ min: 1, max: 1000 }),
    message: faker.lorem.sentence(),
  };

  io?.emit('request-result', {
    requestId: item.requestId,
    userId: item.userId,
    result,
    status: 'completed',
  });

  isProcessing = false;
  processQueue();
}

function processQueue(): void {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const item = queue.shift()!;
  processItem(item);
}

export function initializeWebSocket(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
