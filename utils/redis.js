import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    // // Handles connect event
    // this.client.on('connect', () => {
    //   console.log('Connected to Redis');
    // });
    // Handles error event
    this.client.on('error', (err) => {
      console.log("Redis connection error", err);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
      return await this.client.get(key);
    }

  async set(key, value, duration) {
    return await this.client.setex(key, duration, value);
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
