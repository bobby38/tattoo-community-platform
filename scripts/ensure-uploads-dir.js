// This script ensures the uploads directory exists and has proper permissions
// It runs at application startup in production environments

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the uploads directory path
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const GALLERY_DIR = path.join(UPLOADS_DIR, 'gallery');

console.log('Checking uploads directory structure...');

try {
  // Check if the uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log('Creating uploads directory:', UPLOADS_DIR);
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  // Check if the gallery subdirectory exists
  if (!fs.existsSync(GALLERY_DIR)) {
    console.log('Creating gallery directory:', GALLERY_DIR);
    fs.mkdirSync(GALLERY_DIR, { recursive: true });
  }

  // Set permissions to ensure any user can write to these directories
  console.log('Setting directory permissions...');
  try {
    execSync(`chmod -R 777 ${UPLOADS_DIR}`);
    console.log('Permissions set successfully');
  } catch (error) {
    console.warn('Warning: Could not set directory permissions:', error.message);
    console.log('This is not critical if the directory already has write permissions');
  }

  console.log('Uploads directory structure is ready');
} catch (error) {
  console.error('Error setting up uploads directory:', error);
  // Don't exit the process, as this is not critical for the application to run
  // The application will just fall back to using R2 storage
}

// Export a function that can be used to check if a path exists
module.exports = {
  ensureDirExists: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      try {
        execSync(`chmod -R 777 ${dirPath}`);
      } catch (error) {
        console.warn(`Warning: Could not set permissions for ${dirPath}:`, error.message);
      }
    }
    return dirPath;
  }
};
