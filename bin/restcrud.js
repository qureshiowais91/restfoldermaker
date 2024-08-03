import fs from 'fs';
import path from 'path';

export function restCrud() {
  const projectRoot = './';

  const folders = ['controllers', 'models', 'routes', 'middleware', 'config', 'services', 'validators'];
  const files = ['app.js', 'package.json', '.env'];

  // Create folders
  folders.forEach(folder => {
    const folderPath = path.join(projectRoot, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`Created folder: ${folderPath}`);
    }
  });

  // Create files
  files.forEach(file => {
    const filePath = path.join(projectRoot, file);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '', 'utf-8');
      console.log(`Created file: ${filePath}`);
    }
  });

  // Create content for specific files

  // app.js content
  const appJsContent = `
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT, MONGO_URI } = require('./config');

// Middleware
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`;

  fs.writeFileSync(path.join(projectRoot, 'app.js'), appJsContent.trim(), 'utf-8');
  console.log('Added content to app.js');

  // .env content
  const envContent = `
PORT=3000
MONGO_URI=mongodb://localhost:27017/mydatabase
`;

  fs.writeFileSync(path.join(projectRoot, '.env'), envContent.trim(), 'utf-8');
  console.log('Added content to .env');

  // package.json content
  const packageJsonContent = {
    name: "my-express-app",
    version: "1.0.0",
    description: "A basic Express.js app with CRUD API",
    main: "app.js",
    scripts: {
      start: "node app.js"
    },
    dependencies: {
      express: "^4.17.1",
      mongoose: "^5.9.10",
      bodyParser: "^1.19.0"
    }
  };

  fs.writeFileSync(path.join(projectRoot, 'package.json'), JSON.stringify(packageJsonContent, null, 2), 'utf-8');
  console.log('Added content to package.json');

  // User model
  const userModelContent = `
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true }
});

module.exports = mongoose.model('User', userSchema);
`;

  fs.writeFileSync(path.join(projectRoot, 'models/user.js'), userModelContent.trim(), 'utf-8');
  console.log('Added content to user model');

  // User controller
  const userControllerContent = `
const User = require('../models/user');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(200).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
`;

  fs.writeFileSync(path.join(projectRoot, 'controllers/userController.js'), userControllerContent.trim(), 'utf-8');
  console.log('Added content to user controller');

  // User routes
  const userRoutesContent = `
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
`;

  fs.writeFileSync(path.join(projectRoot, 'routes/userRoutes.js'), userRoutesContent.trim(), 'utf-8');
  console.log('Added content to user routes');

  console.log('\nProject structure created successfully with CRUD API.');
}
