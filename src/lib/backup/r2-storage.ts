// src/lib/r2-storage.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// R2 configuration using environment variables
const r2Config = {
  endpoint: `https://${process.env.R2_ACCOUNT_ID || ''}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucket: process.env.R2_BUCKET || 'tattoo',
  publicUrl: process.env.R2_PUBLIC_URL || 'https://pub-7de639d71ac205cf86c59c89880753fa.r2.dev'
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

const bucketName = r2Config.bucket;
const publicUrl = r2Config.publicUrl;

// Local storage fallback configuration
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const LOCAL_PUBLIC_URL = '/uploads';

// Ensure uploads directory exists for fallback
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log('Created local uploads directory:', UPLOADS_DIR);
  }
} catch (err) {
  console.error('Failed to create local uploads directory:', err);
}

export async function uploadToR2(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    console.log(`Uploading to R2: ${fileName}, type: ${contentType}, size: ${file.length} bytes`);
    console.log(`Using bucket: ${bucketName}, endpoint: ${r2Config.endpoint}`);
    
    // Log R2 configuration for debugging (without sensitive data)
    console.log('R2 Configuration:', {
      endpoint: r2Config.endpoint,
      bucketName,
      publicUrl,
      accessKeyId: r2Config.accessKeyId.substring(0, 10) + '...',
    });
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });

    const result = await s3Client.send(command);
    console.log(`Successfully uploaded to R2, result:`, result);
    
    const fileUrl = `${publicUrl}/${fileName}`;
    console.log(`File URL: ${fileUrl}`);
    
    return fileUrl;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.log('Falling back to local storage after R2 error');
    return uploadToLocalStorage(file, fileName);
  }
}

export async function deleteFromR2(fileName: string): Promise<void> {
  try {
    console.log(`Deleting from R2: ${fileName}`);
    
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    await s3Client.send(command);
    console.log(`Successfully deleted from R2: ${fileName}`);
  } catch (error) {
    console.error('Error deleting from R2:', error);
    console.log('Falling back to local storage deletion after R2 error');
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
