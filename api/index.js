const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('../utils/connectDB');
const app = require('../app');

dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

const dbReady = connectDB();

module.exports = async (req, res) => {
  await dbReady;
  return app(req, res);
};
