import dotenv from 'dotenv';
import path from 'path';

// Load environmental variables before imports
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  CaseThread Backend Server is running!  `);
  console.log(`  Listening on Port: ${PORT}            `);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`=========================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
