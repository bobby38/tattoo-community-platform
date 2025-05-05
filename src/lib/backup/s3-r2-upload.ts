// src/lib/s3-r2-upload.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Cloudflare R2 configuration using S3 API
// Following the official documentation: https://developers.cloudflare.com/r2/objects/upload-objects/
const r2Config = {
  endpoint: `https://${process.env.R2_ACCOUNT_ID || ''}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucket: process.env.R2_BUCKET || 'tattoo',
  publicUrl: process.env.R2_PUBLIC_URL || 'https://pub-7de639d71ac205cf86c59c89880753fa.r2.dev'
};

// Local storage fallback configuration
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const LOCAL_PUBLIC_URL = '/uploads';

// Create the S3 client with specific configuration for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: r2Config.endpoint,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
  // Important for R2 compatibility
  forcePathStyle: true
});

// Ensure uploads directory exists for fallback
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log('Created local uploads directory:', UPLOADS_DIR);
  }
} catch (err) {
  console.error('Failed to create local uploads directory:', err);
}

/**
 * Upload a file to Cloudflare R2 using S3 API
 */
export async function uploadToR2(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    console.log(`Uploading to R2 via S3 API: ${fileName}, type: ${contentType}, size: ${file.length} bytes`);
    console.log(`Using bucket: ${r2Config.bucket}, endpoint: ${r2Config.endpoint}`);
    console.log(`Access Key ID: ${r2Config.accessKeyId}`);
    
    // Create the upload command
    const command = new PutObjectCommand({
      Bucket: r2Config.bucket,
      Key: fileName,
      Body: file,
      ContentType: contentType,
      // Make the object publicly accessible
      ACL: 'public-read',
    });

    // Attempt to upload the file
    console.log('Sending S3 upload command...');
    const result = await s3Client.send(command);
    console.log('S3 upload result:', result);
    
    // Return the public URL
    const fileUrl = `${r2Config.publicUrl}/${fileName}`;
    console.log('R2 file URL:', fileUrl);
    
    return fileUrl;
  } catch (error) {
    console.error('Error uploading to R2 via S3 API:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.log('Falling back to local storage');
    return uploadToLocalStorage(file, fileName);
  }
}

/**
 * Delete a file from Cloudflare R2 using S3 API
 */
export async function deleteFromR2(fileName: string): Promise<void> {
  try {
    console.log(`Deleting from R2 via S3 API: ${fileName}`);
    
    // Create the delete command
    const command = new DeleteObjectCommand({
      Bucket: r2Config.bucket,
      Key: fileName,
    });

    // Attempt to delete the file
    console.log('Sending S3 delete command...');
    const result = await s3Client.send(command);
    console.log('S3 delete result:', result);
    
    console.log('File deleted successfully from R2');
  } catch (error) {
    console.error('Error deleting from R2 via S3 API:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.log('Falling back to local storage deletion');
    return deleteFromLocalStorage(fileName);
  }
}

// Local storage fallback functions
async function uploadToLocalStorage(file: Buffer, fileName: string): Promise<string> {
  try {
    // Split the fileName to get folder structure if any
    const parts = fileName.split('/');
    const actualFileName = parts.pop() || fileName;
    const folder = parts.join('/');
    
    // Create the target folder path
    const targetFolder = folder ? path.join(UPLOADS_DIR, folder) : UPLOADS_DIR;
    
    // Ensure the target folder exists
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    
    // Create the full file path
    const fullPath = path.join(targetFolder, actualFileName);
    const relativePath = folder ? `${folder}/${actualFileName}` : actualFileName;
    
    console.log('Saving file to local storage:', fullPath);
    
    // Write the file to disk
    fs.writeFileSync(fullPath, file);
    console.log('File saved successfully to local storage');
    
    // Return the public URL for the file
    const fileUrl = `${LOCAL_PUBLIC_URL}/${relativePath}`;
    console.log('Local file URL:', fileUrl);
    
    return fileUrl;
  } catch (error) {
    console.error('Error saving to local storage:', error);
    throw error;
  }
}

async function deleteFromLocalStorage(fileName: string): Promise<void> {
  try {
    // Remove the leading slash if present
    const normalizedPath = fileName.startsWith('/') ? fileName.substring(1) : fileName;
    
    // Remove the /uploads prefix if present
    const cleanPath = normalizedPath.startsWith('uploads/') 
      ? normalizedPath.substring(8) 
      : normalizedPath;
    
    // Create the full file path
    const fullPath = path.join(UPLOADS_DIR, cleanPath);
    
    console.log('Deleting file from local storage:', fullPath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log('File deleted successfully from local storage');
    } else {
      console.warn('File not found for local deletion:', fullPath);
    }
  } catch (error) {
    console.error('Error deleting from local storage:', error);
    throw error;
  }
}
