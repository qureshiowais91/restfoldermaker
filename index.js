#!/usr/bin/env node

const { execSync } = require('child_process');

const projectRoot = './';

const folders = ['controllers', 'models', 'routes', 'middleware', 'config', 'services', 'validators'];
const files = ['app.js', 'server.js', 'package.json', '.env'];

// Create folders
folders.forEach(folder => {
  const folderPath = `${projectRoot}${folder}`;
  execSync(`npx make-dir ${folderPath}`);
  console.log(`Created folder: ${folderPath}`);
});

// Create files
files.forEach(file => {
  const filePath = `${projectRoot}${file}`;
  execSync(`npx echo "" > ${filePath}`);
  console.log(`Created file: ${filePath}`);
});

// Create content for specific files
const appJsContent = `
const express = require('express');
const app = express();

// Your code goes here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`;

execSync(`npx echo "${appJsContent.trim()}" > ${projectRoot}app.js`);
console.log('Added content to app.js');

const serverJsContent = `
const app = require('./app');

// Your server setup code goes here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`;

execSync(`npx echo "${serverJsContent.trim()}" > ${projectRoot}server.js`);
console.log('Added content to server.js');

const packageJsonContent = `
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "Your project description",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.17.1"
    // Add other dependencies as needed
  }
}
`;

execSync(`npx echo "${packageJsonContent.trim()}" > ${projectRoot}package.json`);
console.log('Added content to package.json');

execSync(`npx echo "" > ${projectRoot}.env`);
console.log('Created .env');

console.log('\nREST API project structure created successfully.');
