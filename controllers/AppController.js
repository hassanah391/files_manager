import redis from '../utils/redis';
import db from '../utils/db'
const getStatus = () => {
  let statusUtility = {
    'redis': false,
    'db': false
  };
  if (redis.isAlive()) {
    statusUtility.redis = true;
  }
  if (db.isAlive()) {
    statusUtility.db = true;
  }

  return statusUtility;
};

const getStats = async () => {
  const users = await db.nbUsers();
  const files = await db.nbFiles();
  return {'users': users, 'files': files};
};

module.exports = {
  getStatus,
  getStats
};
