// Test script for Cloudflare R2 using new credentials
require('dotenv').config();
const { S3Client, ListObjectsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

// Log environment variables (redacted for security)
console.log('R2 Configuration:');
console.log('- Account ID:', process.env.R2_ACCOUNT_ID ? `${process.env.R2_ACCOUNT_ID.substring(0, 5)}...` : 'Not set');
console.log('- Access Key ID:', process.env.R2_ACCESS_KEY_ID ? `${process.env.R2_ACCESS_KEY_ID.substring(0, 5)}...` : 'Not set');
console.log('- Secret Access Key:', process.env.R2_SECRET_ACCESS_KEY ? 'Set (redacted)' : 'Not set');
console.log('- Bucket:', process.env.R2_BUCKET || 'Not set');
console.log('- Public URL:', process.env.R2_PUBLIC_URL || 'Not set');

// Create the S3 client with specific endpoint
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true
});

// Test function to list objects in the bucket
async function listObjects() {
  try {
    console.log(`Listing objects in bucket: ${process.env.R2_BUCKET}`);
    
    const command = new ListObjectsCommand({
      Bucket: process.env.R2_BUCKET || 'tattoo',
    });
    
    const response = await s3Client.send(command);
    console.log('List objects response:', response);
    
    if (response.Contents && response.Contents.length > 0) {
      console.log(`Found ${response.Contents.length} objects in the bucket:`);
      response.Contents.forEach((item, index) => {
        console.log(`${index + 1}. ${item.Key} (${item.Size} bytes, last modified: ${item.LastModified})`);
      });
    } else {
      console.log('No objects found in the bucket.');
    }
    
    return true;
  } catch (error) {
    console.error('Error listing objects:', error);
    return false;
  }
}

// Test function to upload a test file
async function uploadTestFile() {
  try {
    const testFileName = `test-file-${Date.now()}.txt`;
    const testContent = Buffer.from(`This is a test file created at ${new Date().toISOString()}`);
    
    console.log(`Uploading test file: ${testFileName}`);
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET || 'tattoo',
      Key: testFileName,
      Body: testContent,
      ContentType: 'text/plain',
    });
    
    const response = await s3Client.send(command);
    console.log('Upload response:', response);
    
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${testFileName}`;
    console.log('Test file URL:', fileUrl);
    
    return true;
  } catch (error) {
    console.error('Error uploading test file:', error);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('Starting R2 tests with new credentials...');
  
  // First, list objects to check if we can connect
  const listResult = await listObjects();
  
  if (listResult) {
    console.log('✅ Successfully connected to R2 and listed objects');
    
    // Then try to upload a test file
    const uploadResult = await uploadTestFile();
    
    if (uploadResult) {
      console.log('✅ Successfully uploaded test file to R2');
    } else {
      console.log('❌ Failed to upload test file to R2');
    }
  } else {
    console.log('❌ Failed to connect to R2 or list objects');
  }
}

runTests().catch(console.error);
