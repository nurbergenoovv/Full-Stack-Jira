const http = require('http');
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const initWebSocket = require('./websocket/websocket.server');

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
