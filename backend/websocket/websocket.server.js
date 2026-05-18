const { WebSocketServer } = require('ws');
const { verifyToken } = require('../utils/jwt.utils');
const { addUser, removeUser, removeFromProject, getOnlineUsers } = require('./onlineUsers');
const { broadcastToProject, sendToUser } = require('./websocket.manager');
const EVENTS = require('./websocket.events');

const initWebSocket = (httpServer) => {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const token = url.searchParams.get('token');

    let userId = null;

    try {
      const decoded = verifyToken(token);
      userId = decoded.id;
    } catch {
      ws.close(4001, 'Unauthorized');
      return;
    }

    ws.userId = userId;

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.type === EVENTS.JOIN_PROJECT && msg.projectId) {
          addUser(msg.projectId, userId, ws);

          broadcastToProject(msg.projectId, EVENTS.USER_ONLINE, {
            userId,
            projectId: msg.projectId,
          });

          broadcastToProject(msg.projectId, EVENTS.ONLINE_USERS, {
            projectId: msg.projectId,
            userIds: getOnlineUsers(msg.projectId),
          });
        }

        if (msg.type === EVENTS.LEAVE_PROJECT && msg.projectId) {
          removeFromProject(msg.projectId, userId, ws);

          broadcastToProject(msg.projectId, EVENTS.USER_OFFLINE, {
            userId,
            projectId: msg.projectId,
          });

          broadcastToProject(msg.projectId, EVENTS.ONLINE_USERS, {
            projectId: msg.projectId,
            userIds: getOnlineUsers(msg.projectId),
          });
        }
      } catch {
      }
    });

    ws.on('close', () => {
      const affectedProjects = removeUser(ws);
      for (const projectId of affectedProjects) {
        broadcastToProject(projectId, EVENTS.USER_OFFLINE, { userId, projectId });
        broadcastToProject(projectId, EVENTS.ONLINE_USERS, {
          projectId,
          userIds: getOnlineUsers(projectId),
        });
      }
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message);
    });
  });

  return wss;
};

module.exports = initWebSocket;
