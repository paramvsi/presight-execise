import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addToQueue } from '../websocket/socketHandler.js';

const router = Router();

router.post('/', (req, res) => {
  const requestId = uuidv4();
  const userId = req.body?.userId as string | undefined;
  const payload = req.body?.payload || `Request ${requestId.slice(0, 8)}`;

  addToQueue(requestId, payload, userId);

  res.json({
    requestId,
    userId,
    status: 'pending',
    message: 'Request queued for processing',
  });
});

export default router;
