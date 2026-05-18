const { getProjectSockets, getUserSockets } = require('./onlineUsers');

const send = (ws, event, data) => {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify({ event, data }));
  }
};

const broadcastToProject = (projectId, event, data) => {
  const sockets = getProjectSockets(projectId);
  for (const ws of sockets) {
    send(ws, event, data);
  }
};

const sendToUser = (userId, event, data) => {
  const sockets = getUserSockets(userId);
  for (const ws of sockets) {
    send(ws, event, data);
  }
};

module.exports = { broadcastToProject, sendToUser };
