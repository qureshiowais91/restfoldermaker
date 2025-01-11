
import fs from 'fs'
import path from 'path'

export function restFolder() {
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
  const appJsContent = `
const express = require('express');
const app = express();

// Your code goes here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`;

  fs.writeFileSync(path.join(projectRoot, 'app.js'), appJsContent.trim(), 'utf-8');
  console.log('Added content to app.js');


  console.log('\nProject structure created successfully.');
}

