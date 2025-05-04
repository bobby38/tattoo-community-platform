const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

// Ensure uploads directory exists with proper permissions
// This is critical for file uploads to work in all environments
function ensureUploadsDirectory() {
  console.log('Ensuring uploads directory exists...');
  
  try {
    // Define the uploads directory path
    const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
    const GALLERY_DIR = path.join(UPLOADS_DIR, 'gallery');
    
    // Create directories if they don't exist
    if (!fs.existsSync(UPLOADS_DIR)) {
      console.log('Creating uploads directory:', UPLOADS_DIR);
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(GALLERY_DIR)) {
      console.log('Creating gallery directory:', GALLERY_DIR);
      fs.mkdirSync(GALLERY_DIR, { recursive: true });
    }
    
    // Set permissions to ensure any user can write to these directories
    try {
      fs.chmodSync(UPLOADS_DIR, 0o777);
      fs.chmodSync(GALLERY_DIR, 0o777);
      console.log('Directory permissions set successfully');
    } catch (error) {
      console.warn('Warning: Could not set directory permissions:', error.message);
      console.log('This is not critical if the directory already has write permissions');
    }
    
    console.log('Uploads directory structure is ready');
    return true;
  } catch (error) {
    console.error('Error setting up uploads directory:', error);
    return false;
  }
}

// Always ensure uploads directory exists at startup
ensureUploadsDirectory();

// Create the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);
      
      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
