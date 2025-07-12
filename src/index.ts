import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { serverConfig } from './config';
import { connectDB } from './config/db-config';
import apiRoutes from './routes';
import { setupEditorNamespace } from './socket-handlers/editorNamespace';

const app = express();
const server = createServer(app);

// --- Middleware ---
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://codeflow.vercel.app'],
    credentials: true,
  })
);

// --- MongoDB + REST API ---
connectDB();
app.use('/api', apiRoutes);

// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://codeflow.vercel.app'],
    credentials: true,
  },
});
setupEditorNamespace(io);

io.on('connection', () => {
  console.log('✅ Backend received a Socket.IO connection');
});

// --- Start Server ---
server.listen(serverConfig.PORT || 3002, () => {
  console.log('✅ Backend is running');
});