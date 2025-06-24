const db = require('../utils/db');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const redis = require('../utils/redis');

function verifyPasswordSHA1(inputPassword, storedHash) {
  const hash = crypto.createHash('sha1').update(inputPassword).digest('hex');
  return hash === storedHash;
}

const getConnect = async (request, response) => {
  const Authorization = request.header('Authorization') || '';

  const credentials = Authorization.split(' ')[1];

  if (!credentials) { 
    return response.status(401).send({ error: 'Unauthorized' }); 
  }

  const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
  const [email, password] = decodedCredentials.split(':');

  const user = await db.usersCollection.findOne({ email });

  if (!user) {
    return response.status(401).send({ error: 'Unauthorized' });
  }

  const storedHash = user.password;

  if (!verifyPasswordSHA1(password, storedHash)) {
    return response.status(401).send({ error: 'Unauthorized' });
  }

  const token = uuidv4();
  const key = `auth_${token}`;
  const hoursForExpiration = 24;

  await redis.set(key, user._id.toString(), hoursForExpiration * 3600);
  return response.status(200).send({ token });
};

const getDisconnect = async (request, response) => {
  const XTOKEN = request.headers['X-Token'];
  if (!XTOKEN) {
    return response.status(401).send({ error: 'Unauthorized' });
  }
  const key = `auth_${XTOKEN}`;
  const userId = await redis.get(key);
  if (!userId) {
    return response.status(401).send({ error: 'Unauthorized' });
  }
  await redis.del(key);
  return response.status(204).send();
}

module.exports = {
  getConnect,
  getDisconnect
};
  