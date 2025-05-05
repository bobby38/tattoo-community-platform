// Test script for Cloudflare R2 using API token
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Log environment variables (redacted for security)
console.log('R2 Configuration:');
console.log('- Account ID:', process.env.R2_ACCOUNT_ID ? `${process.env.R2_ACCOUNT_ID.substring(0, 5)}...` : 'Not set');
console.log('- API Token:', process.env.R2_API_TOKEN ? 'Set (redacted)' : 'Not set');
console.log('- Bucket:', process.env.R2_BUCKET || 'Not set');
console.log('- Public URL:', process.env.R2_PUBLIC_URL || 'Not set');

// Configuration
const r2Config = {
  accountId: process.env.R2_ACCOUNT_ID,
  apiToken: process.env.R2_API_TOKEN,
  bucket: process.env.R2_BUCKET || 'tattoo',
  publicUrl: process.env.R2_PUBLIC_URL
};

// Test function to list objects in the bucket
async function listObjects() {
  try {
    console.log(`Listing objects in bucket: ${r2Config.bucket}`);
    
    const url = `https://api.cloudflare.com/client/v4/accounts/${r2Config.accountId}/r2/buckets/${r2Config.bucket}/objects`;
    console.log('Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${r2Config.apiToken}`
      }
    });
    
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to list objects: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('List objects response:', JSON.stringify(data, null, 2));
    
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
    const testContent = `This is a test file created at ${new Date().toISOString()}`;
    
    console.log(`Uploading test file: ${testFileName}`);
    
    const url = `https://api.cloudflare.com/client/v4/accounts/${r2Config.accountId}/r2/buckets/${r2Config.bucket}/objects/${testFileName}`;
    console.log('Upload URL:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': `Bearer ${r2Config.apiToken}`
      },
      body: testContent
    });
    
    console.log('Upload response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Upload response:', JSON.stringify(data, null, 2));
    
    const fileUrl = `${r2Config.publicUrl}/${testFileName}`;
    console.log('Test file URL:', fileUrl);
    
    return true;
  } catch (error) {
    console.error('Error uploading test file:', error);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('Starting R2 API token tests...');
  
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

// Run the tests
runTests().catch(console.error);
