import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import config from './config/index.js';
import connectDB from './database/index.js';
import socketService from './services/socket.service.js';

import authRoutes from './modules/auth/auth.routes.js';
import workspaceRoutes from './modules/workspace/workspace.routes.js';
import channelRoutes from './modules/channel/channel.routes.js';
import taskRoutes from './modules/task/task.routes.js';
import documentRoutes from './modules/document/document.routes.js';
import notificationRoutes from './modules/notification/notification.routes.js';
import searchRoutes from './modules/search/search.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// IMPORTANT: Specific routes before parameterized routes
app.use('/api/auth', authRoutes);

// Create a merger router for workspaces
const workspacesRouter = express.Router({ mergeParams: true });

workspacesRouter.use('/:workspaceId/channels', channelRoutes);
workspacesRouter.use('/:workspaceId/tasks', taskRoutes);
workspacesRouter.use('/:workspaceId/documents', documentRoutes);
workspacesRouter.use('/', workspaceRoutes);

app.use('/api/workspaces', workspacesRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const startServer = async () => {
  await connectDB();
  
  socketService.initialize(httpServer);
  
  httpServer.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port}`);
  });
};

startServer();
