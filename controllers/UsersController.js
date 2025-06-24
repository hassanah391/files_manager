const db = require('../utils/db');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const redis = require('../utils/redis');

function hashPasswordSHA1(password) {
  return crypto.createHash('sha1').update(password).digest('hex');
}

const postNew = async (email, password) => {
  if (!email) {
    return { error: 'Missing email' };
  }
  if (!password) {
    return { error: 'Missing password' };
  }
  const user = await db.usersCollection.findOne({ email });
  if (user) {
    return { error: 'Already exist' };
  }
  const hashedPassword = hashPasswordSHA1(password);
  const result = await db.usersCollection.insertOne({
    email,
    password: hashedPassword,
    createdAt: new Date()
  });
  return { id: result.insertedId, email };
};

const getMe = async (request, response) => {
  const XTOKEN = request.headers['X-Token'];
  if (!XTOKEN) {
    return response.status(401).send({ error: 'Unauthorized' });
  }

  const key = `auth_${XTOKEN}`;
  const userId = await redis.get(key);
  if (!userId) {
    return response.status(401).send({ error: 'Unauthorized' });
  }

  const user = await db.usersCollection.findOne({ _id: ObjectId(userId) });
  if (!user) {
    return response.status(401).send({ error: 'Unauthorized' });
  }

  const processedUser = { id: user._id, email: user.email };
  return response.status(200).send(processedUser);
};

module.exports = { postNew, getMe };
