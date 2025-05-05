// Test script to directly test R2 connection
const { S3Client, PutObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get R2 configuration from environment variables
const r2Config = {
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET_NAME || 'tattoo',
  publicUrl: process.env.R2_PUBLIC_URL
};

// Initialize the S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: r2Config.endpoint,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});

async function testR2Connection() {
  console.log('=== R2 CONNECTION TEST ===');
  
  // Log configuration (without sensitive data)
  console.log('R2 Configuration:');
  console.log('  Endpoint:', r2Config.endpoint);
  console.log('  Bucket:', r2Config.bucket);
  console.log('  Public URL:', r2Config.publicUrl);
  console.log('  Access Key ID:', r2Config.accessKeyId ? '✓ Set' : '✗ Not set');
  console.log('  Secret Access Key:', r2Config.secretAccessKey ? '✓ Set' : '✗ Not set');
  
  try {
    // 1. List objects in the bucket
    console.log('\n1. Listing objects in bucket...');
    const listCommand = new ListObjectsCommand({
      Bucket: r2Config.bucket,
    });
    
    const listResponse = await s3Client.send(listCommand);
    console.log('List response:', listResponse);
    
    if (listResponse.Contents) {
      console.log(`Found ${listResponse.Contents.length} objects in bucket`);
      listResponse.Contents.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.Key} (${item.Size} bytes)`);
      });
    } else {
      console.log('Bucket is empty');
    }
    
    // 2. Upload a test file
    console.log('\n2. Uploading test file...');
    
    // Create a test file
    const testFileName = `test-file-${Date.now()}.txt`;
    const testContent = Buffer.from('This is a test file for R2 storage');
    
    const uploadCommand = new PutObjectCommand({
      Bucket: r2Config.bucket,
      Key: testFileName,
      Body: testContent,
      ContentType: 'text/plain',
    });
    
    const uploadResponse = await s3Client.send(uploadCommand);
    console.log('Upload response:', uploadResponse);
    
    const fileUrl = `${r2Config.publicUrl}/${testFileName}`;
    console.log('File URL:', fileUrl);
    
    console.log('\nTest completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testR2Connection().catch(console.error);
