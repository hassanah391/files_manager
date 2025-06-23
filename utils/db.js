const { MongoClient } = require('mongodb');
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT) || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;

/**
 * Class for performing operations with MongoDB service
 * Manages connection to MongoDB and provides methods for user and file operations
 */
class DBClient {
  /**
   * Creates a new DBClient instance
   * Initializes connection to MongoDB using environment variables or defaults:
   * - DB_HOST (default: localhost)
   * - DB_PORT (default: 27017) 
   * - DB_DATABASE (default: files_manager)
   */
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

  /**
   * Checks if connection to MongoDB is alive
   * @returns {boolean} true if connection is alive, false otherwise
   */
  isAlive() {
    return this.isConnected;
  }

  /**
   * Returns the number of documents in the users collection
   * @returns {Promise<number>} number of users in the database
   */
  async nbUsers() {
    if (!this.isConnected || !this.usersCollection) return 0;
    return this.usersCollection.countDocuments();
  }

  /**
   * Returns the number of documents in the files collection
   * @returns {Promise<number>} number of files in the database
   */
  async nbFiles() {
    if (!this.isConnected || !this.filesCollection) return 0;
    return this.filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
