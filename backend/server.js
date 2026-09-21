require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const initializeSocket = require('./sockets/socket');

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true } });
initializeSocket(io);

connectDB().then(() => server.listen(port, () => console.log(`Skillora API listening on port ${port}`))).catch((error) => { console.error('Unable to connect to MongoDB:', error.message); process.exit(1); });
