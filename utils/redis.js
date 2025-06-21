// utils/redis.js

import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.isConnected = true;

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      this.isConnected = true;
    });

    // Promisify Redis commands
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setexAsync = promisify(this.client.setex).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.isConnected;
  }

  async get(key) {
    try {
      return await this.getAsync(key);
    } catch (err) {
      console.error(`Error getting key "${key}":`, err);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      await this.setexAsync(key, duration, value);
    } catch (err) {
      console.error(`Error setting key "${key}":`, err);
    }
  }

  async del(key) {
    try {
      await this.delAsync(key);
    } catch (err) {
      console.error(`Error deleting key "${key}":`, err);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
