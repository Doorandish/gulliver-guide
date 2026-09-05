require('dotenv').config();
const mongoose = require('mongoose');
const { createClient } = require('redis');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.collection('tripplans').deleteMany({});
  
  const redis = createClient({ url: process.env.REDIS_URL });
  await redis.connect();
  const keys = await redis.keys('trip:*');
  if (keys.length > 0) {
    await redis.del(keys);
  }
  process.exit(0);
}
run();
