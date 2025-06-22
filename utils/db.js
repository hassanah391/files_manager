import pkg from 'mongodb';
const { MongoClient } = pkg;
import config from '../config.js';


class DBClient {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
    MongoClient.connect(config.db.url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.error('MongoDB connection error:', err);
        return;
      }
      this.client = client;
      this.db = client.db(config.db.name);
      this.isConnected = true;
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    if (!this.isConnected || !this.db) return 0;
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    if (!this.isConnected || !this.db) return 0;
    return this.db.collection('files').countDocuments();
  }

}

const dbClient = new DBClient();
export default dbClient;
