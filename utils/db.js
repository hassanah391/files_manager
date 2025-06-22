import pkg from 'mongodb';
const { MongoClient } = pkg;
// import config from '../config.js';
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT) || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/${dbName}`;


class DBClient {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.error('MongoDB connection error:', err);
        return;
      }
      this.client = client;
      this.db = client.db(dbName);
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
