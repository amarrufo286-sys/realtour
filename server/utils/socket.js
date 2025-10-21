const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { initSocket } = require('./utils/socket');

(async function main() {
  const app = express();
  const server = http.createServer(app);

  // Middleware
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));

  // Routes (we’ll add messages route next)
  // app.use('/api/messages', require('./routes/messages'));

  // Healthcheck
  app.get('/health', (_req, res) => res.json({ ok: true }));

  // DB connect
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/realtour';
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');

  // Socket.io
  initSocket(server, { corsOrigin: '*' });

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => console.log(`API ready on :${PORT}`));
})();
