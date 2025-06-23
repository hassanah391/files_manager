const db = require('../utils/db');
const crypto = require('crypto');

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

module.exports = { postNew };
