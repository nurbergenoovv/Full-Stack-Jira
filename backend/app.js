require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error.middleware');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const projectRoutes = require('./modules/projects/project.routes');
const taskRoutes = require('./modules/tasks/task.routes');
const commentRoutes = require('./modules/comments/comment.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

if (process.env.UPLOADTHING_TOKEN) {
  try {
    const { createRouteHandler } = require('uploadthing/express');
    const uploadRouter = require('./utils/uploadthing');
    app.use('/api/uploadthing', (req, res, next) => {
      const auth = req.headers.authorization;
      console.log(`[UT] ${req.method} ${req.url} | auth: ${auth ? auth.substring(0, 40) + '...' : 'MISSING'}`);
      next();
    }, createRouteHandler({ router: uploadRouter }));
  } catch (e) {
    console.warn('UploadThing not configured:', e.message);
  }
}

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use(errorHandler);

module.exports = app;
