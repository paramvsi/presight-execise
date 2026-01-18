import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import usersRouter from './routes/users.js';
import streamRouter from './routes/stream.js';
import queueRouter from './routes/queue.js';
import { initializeWebSocket } from './websocket/socketHandler.js';

const app = express();
const server = createServer(app);
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/stream', streamRouter);
app.use('/api/queue', queueRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Initialize WebSocket
initializeWebSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket available on ws://localhost:${PORT}`);
});
