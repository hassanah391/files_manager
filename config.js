// config.js

import dotenv from 'dotenv';
dotenv.config();

const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 27017,
    name: process.env.DB_DATABASE || 'files_manager',
    get url() {
      return `mongodb://${this.host}:${this.port}/${this.name}`;
    },
  },

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },

};

export default config;
