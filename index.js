import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';

import database from './src/db/db.js';
import config from './src/db/envConfig.js';
import { swaggerUi, swaggerSpec } from './src/utils/swagger.js';
import passport from './src/utils/Passport.js';
import { initSocket } from './src/socket/socket.js';

import userRouter from './src/routes/user.route.js';
import editProfileRouter from './src/routes/editProfile.route.js';
import lookingForRouter from './src/routes/lookingFor.route.js';
import userDetailsRouter from './src/routes/userDetails.route.js';
import adminRouter from './src/routes/admin.route.js';
import messageRouter from './src/routes/message.route.js';
import notificationRouter from './src/routes/notification.route.js';
import authRoutes from './src/routes/googleAuth.route.js';

import './src/utils/associations.js';
import './src/utils/cron-jobs/forcedlogout.js';

const app = express();
const server = createServer(app);

// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ======================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ======================
app.use('/uploads', express.static(path.join(process.cwd(), 'public/temp')));

// ======================
app.use('/api/v1/users', userRouter);
app.use('/api/v1/editProfile', editProfileRouter);
app.use('/api/v1/lookingFor', lookingForRouter);
app.use('/api/v1/userDetails', userDetailsRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/notification', notificationRouter);


app.use(passport.initialize());
app.use('/api/v1/auth', authRoutes);

// ======================
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the server' });
});


// ======================
initSocket(server);


try {
  await database.authenticate();
  console.log(`Database connected at ${config.DB_HOST}`);
} catch (err) {
  console.error('Database connection failed:', err);
}

server.listen(config.PORT, config.HOST, () => {
  console.log(`Server running at http://${config.HOST}:${config.PORT}`);
});
