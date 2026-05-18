const { createUploadthing } = require('uploadthing/express');
const { verifyToken } = require('./jwt.utils');
const User = require('../modules/users/user.model');

const f = createUploadthing();

const getAuthUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('Unauthorized: no token');
    const decoded = verifyToken(authHeader.split(' ')[1]);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new Error('Unauthorized: user not found');
    return user;
  } catch (err) {
    console.error('[UploadThing] Auth error:', err.message);
    throw err;
  }
};

const uploadRouter = {
  avatarUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await getAuthUser(req);
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  taskAttachment: f({ blob: { maxFileSize: '16MB', maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      const user = await getAuthUser(req);
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url, name: file.name };
    }),

  projectCover: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await getAuthUser(req);
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
};

module.exports = uploadRouter;
