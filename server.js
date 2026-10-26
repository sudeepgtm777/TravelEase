const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');
const connectDB = require('./utils/connectDB');

connectDB();

if (process.env.VERCEL) {
  module.exports = app;
} else {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`App running in ${port} port!!`);
  });

  process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection!!');
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down !!');
    server.close(() => {
      console.log('Process terminated!!');
    });
  });
}
