const mongoose = require('mongoose');
const checkEnvVars = require('./checkEnv');

let cached = global.__traveleaseMongoose;
if (!cached) {
  cached = global.__traveleaseMongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  checkEnvVars(['DATABASE', 'DATABASE_PASSWORD']);

  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
  );

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then((connection) => {
        console.log('Successfully connected to DB');
        return connection;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
