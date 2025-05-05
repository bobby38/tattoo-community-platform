/**
 * Script to set up event images for the Ink2Tattoo platform
 * This ensures that the event images referenced in the fallback data are available
 */

import fs from 'fs';
import path from 'path';

// Define the source and destination directories
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const EVENTS_DIR = path.join(IMAGES_DIR, 'events');
const PLACEHOLDER_DIR = path.join(IMAGES_DIR, 'placeholders');

// Create directories if they don't exist
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Create placeholder event images
function createPlaceholderEventImages() {
  // Create placeholder text for each event image
  const placeholders = [
    { id: 1, text: 'Singapore Tattoo Convention', color: '#4338ca' },
    { id: 2, text: 'KL Tattoo Expo', color: '#0e7490' },
    { id: 3, text: 'Bangkok Ink Fusion', color: '#b91c1c' },
    { id: 4, text: 'Bali Tattoo Festival', color: '#15803d' },
    { id: 5, text: 'Manila Ink Show', color: '#7e22ce' },
  ];

  // Create an HTML file for each placeholder
  placeholders.forEach(({ id, text, color }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event ${id} Placeholder</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 400px;
            height: 300px;
            background-color: ${color};
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
            text-align: center;
            overflow: hidden;
          }
          .content {
            padding: 20px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="icon">🎭</div>
          <h1>${text}</h1>
          <p>Ink2Tattoo Event</p>
        </div>
      </body>
      </html>
    `;

    // Write the HTML file to the placeholder directory
    const htmlFilePath = path.join(PLACEHOLDER_DIR, `event-${id}.html`);
    fs.writeFileSync(htmlFilePath, htmlContent);
    console.log(`Created placeholder HTML: ${htmlFilePath}`);

    // Create a symlink in the events directory
    const eventImagePath = path.join(EVENTS_DIR, `event-${id}.jpg`);
    if (!fs.existsSync(eventImagePath)) {
      console.log(`Creating symlink for event-${id}.jpg`);
      // Instead of a symlink, create a text file with instructions
      fs.writeFileSync(
        eventImagePath, 
        `This is a placeholder for event-${id}.jpg. In a production environment, this would be an actual image.`
      );
    }
  });
}

// Main function to set up event images
async function setupEventImages() {
  console.log('Setting up event images...');
  
  // Ensure directories exist
  ensureDirectoryExists(PUBLIC_DIR);
  ensureDirectoryExists(IMAGES_DIR);
  ensureDirectoryExists(EVENTS_DIR);
  ensureDirectoryExists(PLACEHOLDER_DIR);
  
  // Create placeholder images
  createPlaceholderEventImages();
  
  console.log('Event images setup complete!');
}

// Run the setup
setupEventImages().catch(error => {
  console.error('Error setting up event images:', error);
  process.exit(1);
});
