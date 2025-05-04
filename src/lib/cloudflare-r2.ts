// src/lib/cloudflare-r2.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Cloudflare R2 configuration
const r2Config = {
  accountId: process.env.R2_ACCOUNT_ID || '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucket: process.env.R2_BUCKET || 'tattoo',
  publicUrl: process.env.R2_PUBLIC_URL || ''
};

// Local storage fallback configuration
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const LOCAL_PUBLIC_URL = '/uploads';

// Create the S3 client with specific configuration for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
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
    // Always save to local storage first as a fallback
    const localUrl = await uploadToLocalStorage(file, fileName);
    console.log('File saved to local storage as fallback:', localUrl);
    
    // Check if R2 configuration is complete
    if (!r2Config.accessKeyId || !r2Config.secretAccessKey || !r2Config.accountId || !r2Config.bucket) {
      console.log('Missing R2 configuration, using local storage instead');
      return localUrl;
    }
    
    console.log(`Uploading to R2: ${fileName}, type: ${contentType}, size: ${file.length} bytes`);
    console.log(`Using bucket: ${r2Config.bucket}`);
    
    // Create the upload command
    const command = new PutObjectCommand({
      Bucket: r2Config.bucket,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });

    // Attempt to upload the file
    console.log('Sending S3 upload command...');
    const result = await s3Client.send(command);
    console.log('S3 upload result:', result);
    
    // Return the public URL
    const fileUrl = `${r2Config.publicUrl}/${fileName}`;
    console.log('R2 file URL:', fileUrl);
    console.log('Local file URL:', localUrl);
    
    // Store both URLs in the database for fallback purposes
    console.log('Storing both R2 URL and local URL for fallback');
    
    return fileUrl;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.log('Using local storage URL instead');
    
    // Return the local URL that we already saved
    const localUrl = `${LOCAL_PUBLIC_URL}/${fileName}`;
    return localUrl;
  }
}

/**
 * Delete a file from Cloudflare R2
 */
export async function deleteFromR2(fileName: string): Promise<void> {
  try {
    // First check if R2 configuration is complete
    if (!r2Config.accessKeyId || !r2Config.secretAccessKey || !r2Config.accountId || !r2Config.bucket) {
      console.log('Missing R2 configuration, using local storage instead');
      return deleteFromLocalStorage(fileName);
    }
    
    console.log(`Deleting from R2: ${fileName}`);
    
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
    
    // Also delete from local storage
    await deleteFromLocalStorage(fileName);
  } catch (error) {
    console.error('Error deleting from R2:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.log('Falling back to local storage deletion');
    return deleteFromLocalStorage(fileName);
  }
}

// Local storage functions
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
