const projectRooms = new Map();
const wsToUser = new Map();

const addUser = (projectId, userId, ws) => {
  if (!projectRooms.has(projectId)) {
    projectRooms.set(projectId, new Map());
  }
  const room = projectRooms.get(projectId);
  if (!room.has(userId)) {
    room.set(userId, new Set());
  }
  room.get(userId).add(ws);

  if (!wsToUser.has(ws)) {
    wsToUser.set(ws, { userId, projectIds: new Set() });
  }
  wsToUser.get(ws).projectIds.add(projectId);
};

const removeUser = (ws) => {
  const info = wsToUser.get(ws);
  if (!info) return [];

  const { userId, projectIds } = info;
  const affectedProjects = [];

  for (const projectId of projectIds) {
    const room = projectRooms.get(projectId);
    if (!room) continue;

    const sockets = room.get(userId);
    if (sockets) {
      sockets.delete(ws);
      if (sockets.size === 0) {
        room.delete(userId);
        affectedProjects.push(projectId);
      }
    }

    if (room.size === 0) {
      projectRooms.delete(projectId);
    }
  }

  wsToUser.delete(ws);
  return affectedProjects;
};

const removeFromProject = (projectId, userId, ws) => {
  const room = projectRooms.get(projectId);
  if (room) {
    const sockets = room.get(userId);
    if (sockets) {
      sockets.delete(ws);
      if (sockets.size === 0) room.delete(userId);
    }
    if (room.size === 0) projectRooms.delete(projectId);
  }

  const info = wsToUser.get(ws);
  if (info) info.projectIds.delete(projectId);
};

const getOnlineUsers = (projectId) => {
  const room = projectRooms.get(projectId);
  if (!room) return [];
  return Array.from(room.keys());
};

const getProjectSockets = (projectId) => {
  const room = projectRooms.get(projectId);
  if (!room) return [];
  const sockets = [];
  for (const sockSet of room.values()) {
    sockets.push(...sockSet);
  }
  return sockets;
};

const getUserSockets = (userId) => {
  const sockets = [];
  for (const [ws, info] of wsToUser.entries()) {
    if (info.userId === userId) sockets.push(ws);
  }
  return sockets;
};

module.exports = {
  addUser,
  removeUser,
  removeFromProject,
  getOnlineUsers,
  getProjectSockets,
  getUserSockets,
};
