import pkg from 'mongodb';
const { MongoClient } = pkg;
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT) || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;


class DBClient {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
    this.usersCollection = null;
    this.filesCollection = null;
    
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.error('MongoDB connection error:', err);
        this.isConnected = false;
        return;
      }
      this.client = client;
      this.db = client.db(dbName);
      this.usersCollection = this.db.collection('users');
      this.filesCollection = this.db.collection('files');
      this.isConnected = true;
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    if (!this.isConnected || !this.usersCollection) return 0;
    return this.usersCollection.countDocuments();
  }

  async nbFiles() {
    if (!this.isConnected || !this.filesCollection) return 0;
    return this.filesCollection.countDocuments();
  }

}

const dbClient = new DBClient();
export default dbClient;
