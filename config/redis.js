import { createClient } from 'redis';
import logger from '../middlewares/logger.js';

// Create a new Redis client
const redisClient = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});

redisClient.on('error', (err) => logger.error(`Redis Error: ${err}`));

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    logger.info('Connected to Redis');
  } catch (err) {
    logger.error(`Redis Connection Failed: ${err.message}`);
  }
})();

export default redisClient;
