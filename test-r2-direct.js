// Test script with hardcoded credentials
const { S3Client, PutObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Using the provided R2 credentials with Cloudflare API token
const r2Config = {
  endpoint: 'https://7de639d71ac205cf86c59c89880753fa.r2.cloudflarestorage.com',
  accessKeyId: '2830bf324fb1ff4ae375cf33f8b787fdeb51a',
  secretAccessKey: 'p72S2fXI32wnfepyMnEa7-oMAcbFraSV3SkpfzP8',
  bucket: 'tattoo',
  publicUrl: 'https://pub-7de639d71ac205cf86c59c89880753fa.r2.dev'
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
  console.log('=== R2 DIRECT CONNECTION TEST ===');
  
  // Log configuration (without sensitive data)
  console.log('R2 Configuration:');
  console.log('  Endpoint:', r2Config.endpoint);
  console.log('  Bucket:', r2Config.bucket);
  console.log('  Public URL:', r2Config.publicUrl);
  console.log('  Access Key ID:', r2Config.accessKeyId.substring(0, 10) + '...');
  console.log('  Secret Access Key: [REDACTED]');
  
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
