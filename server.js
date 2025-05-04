const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

// In production, ensure the uploads directory exists and has proper permissions
if (!dev) {
  console.log('Running in production mode, ensuring uploads directory exists...');
  try {
    // Run the script to ensure uploads directory exists
    require('./scripts/ensure-uploads-dir');
    console.log('Uploads directory check completed');
  } catch (error) {
    console.error('Error checking uploads directory:', error);
    // Continue anyway, as this is not critical for the application to run
  }
}

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
