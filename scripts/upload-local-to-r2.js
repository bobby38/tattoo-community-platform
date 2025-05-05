// Script to upload all local images to R2
// This will help sync your local development images to your production R2 storage

require('dotenv').config({ path: '.env.docker' });
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');

// Configure R2 client
const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Bucket name
const BUCKET_NAME = process.env.R2_BUCKET;

// Local uploads directory
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Function to recursively get all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to upload a file to R2
async function uploadFileToR2(filePath) {
  try {
    // Read file
    const fileContent = fs.readFileSync(filePath);
    
    // Get relative path from uploads directory
    const relativePath = path.relative(UPLOADS_DIR, filePath);
    
    // Use forward slashes for S3 paths
    const s3Path = relativePath.replace(/\\/g, '/');
    
    // Determine content type
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    
    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Path,
      Body: fileContent,
      ContentType: contentType,
    });
    
    const result = await R2.send(command);
    console.log(`✅ Uploaded: ${s3Path}`);
    return { success: true, path: s3Path };
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error);
    return { success: false, path: filePath, error };
  }
}

// Main function
async function uploadAllToR2() {
  console.log('Starting upload of local files to R2...');
  
  // Check if uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error(`Uploads directory not found: ${UPLOADS_DIR}`);
    return;
  }
  
  // Get all files
  const files = getAllFiles(UPLOADS_DIR);
  console.log(`Found ${files.length} files to upload`);
  
  // Upload files
  const results = {
    total: files.length,
    successful: 0,
    failed: 0,
  };
  
  for (const file of files) {
    const result = await uploadFileToR2(file);
    if (result.success) {
      results.successful++;
    } else {
      results.failed++;
    }
  }
  
  // Print summary
  console.log('\nUpload Summary:');
  console.log(`Total files: ${results.total}`);
  console.log(`Successfully uploaded: ${results.successful}`);
  console.log(`Failed to upload: ${results.failed}`);
  
  if (results.successful > 0) {
    console.log('\nYour local files have been uploaded to R2!');
    console.log(`They are now accessible via your custom domain: ${process.env.R2_PUBLIC_URL}`);
  }
}

// Run the script
uploadAllToR2().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
