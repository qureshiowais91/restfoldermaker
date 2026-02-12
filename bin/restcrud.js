import fs from 'fs';
import path from 'path';

export function generateCrudApi() {
  const root = './';

  const folders = [
    'controllers',
    'models',
    'routes',
    'middleware',
    'config',
    'services',
    'utils',
    'helpers'
  ];

  folders.forEach(folder => {
    const folderPath = path.join(root, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created folder: ${folderPath}`);
    }
  });

  // ---------------- PACKAGE.JSON ----------------
  const packageJson = {
    name: "scalable-crud-api",
    version: "3.0.0",
    type: "module",
    main: "server.js",
    scripts: {
      start: "node server.js",
      dev: "nodemon server.js"
    },
    dependencies: {
      express: "^4.18.2",
      mongoose: "^7.6.1",
      dotenv: "^16.3.1",
      cors: "^2.8.5",
      helmet: "^7.0.0"
    },
    devDependencies: {
      nodemon: "^3.0.1"
    }
  };

  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // ---------------- .ENV ----------------
  const env = `
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/mydatabase
NODE_ENV=development
`;
  fs.writeFileSync(path.join(root, '.env'), env.trim());

  // ---------------- CONFIG ----------------
  const config = `
import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const NODE_ENV = process.env.NODE_ENV;
`;
  fs.writeFileSync(path.join(root, 'config/index.js'), config.trim());

  // ---------------- LOGGER ----------------
  const logger = `
export const logger = (message, type = 'info') => {
  const time = new Date().toISOString();
  console.log(\`[\${time}] [\${type.toUpperCase()}] \${message}\`);
};
`;
  fs.writeFileSync(path.join(root, 'utils/logger.js'), logger.trim());

  // ---------------- RESPONSE HELPER ----------------
  const response = `
export const success = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

export const error = (res, message = 'Error', status = 500) => {
  return res.status(status).json({
    success: false,
    message
  });
};
`;
  fs.writeFileSync(path.join(root, 'helpers/response.js'), response.trim());

  // ---------------- ASYNC HANDLER ----------------
  const asyncHandler = `
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
`;
  fs.writeFileSync(path.join(root, 'middleware/asyncHandler.js'), asyncHandler.trim());

  // ---------------- APP ERROR ----------------
  const appError = `
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
`;
  fs.writeFileSync(path.join(root, 'middleware/AppError.js'), appError.trim());

  // ---------------- ERROR HANDLER ----------------
  const errorHandler = `
import { NODE_ENV } from '../config/index.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger(err.message, 'error');

  const status = err.statusCode || 500;

  if (NODE_ENV === 'development') {
    return res.status(status).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  }

  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
`;
  fs.writeFileSync(path.join(root, 'middleware/errorHandler.js'), errorHandler.trim());

  // ---------------- MODEL ----------------
  const model = `
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
`;
  fs.writeFileSync(path.join(root, 'models/user.js'), model.trim());

  // ---------------- DATABASE SERVICE ----------------
  const dbService = `
import mongoose from 'mongoose';
import { MONGO_URI } from '../config/index.js';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger('MongoDB Connected');
  } catch (error) {
    logger('Database Connection Failed', 'error');
    process.exit(1);
  }
};
`;
  fs.writeFileSync(path.join(root, 'services/databaseService.js'), dbService.trim());

  // ---------------- USER SERVICE ----------------
  const userService = `
import User from '../models/user.js';

export const createUserService = (data) => User.create(data);
export const getUsersService = () => User.find();
export const getUserByIdService = (id) => User.findById(id);
export const updateUserService = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true });
export const deleteUserService = (id) =>
  User.findByIdAndDelete(id);
`;
  fs.writeFileSync(path.join(root, 'services/userService.js'), userService.trim());

  // ---------------- CONTROLLER ----------------
  const controller = `
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/AppError.js';
import {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService
} from '../services/userService.js';
import { success } from '../helpers/response.js';

export const createUser = asyncHandler(async (req, res) => {
  const user = await createUserService(req.body);
  success(res, user, 'User created', 201);
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await getUsersService();
  success(res, users);
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await getUserByIdService(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  success(res, user);
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await updateUserService(req.params.id, req.body);
  if (!user) return next(new AppError('User not found', 404));
  success(res, user, 'User updated');
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await deleteUserService(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  success(res, null, 'User deleted');
});
`;
  fs.writeFileSync(path.join(root, 'controllers/userController.js'), controller.trim());

  // ---------------- ROUTES ----------------
  const routes = `
import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
`;
  fs.writeFileSync(path.join(root, 'routes/userRoutes.js'), routes.trim());

  // ---------------- APP ----------------
  const app = `
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;
`;
  fs.writeFileSync(path.join(root, 'app.js'), app.trim());

  // ---------------- SERVER ----------------
  const server = `
import app from './app.js';
import { connectDB } from './services/databaseService.js';
import { PORT } from './config/index.js';

await connectDB();

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
  fs.writeFileSync(path.join(root, 'server.js'), server.trim());

  console.log('Modern ESM Production API structure created successfully.');
}
