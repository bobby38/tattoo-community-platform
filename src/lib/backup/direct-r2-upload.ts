// src/lib/direct-r2-upload.ts
import fs from 'fs';
import path from 'path';

// Cloudflare R2 configuration
const r2Config = {
  accountId: process.env.R2_ACCOUNT_ID || '',
  apiToken: process.env.R2_API_TOKEN || '',
  accessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucket: process.env.R2_BUCKET || 'tattoo',
  publicUrl: process.env.R2_PUBLIC_URL || ''
};

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

/**
 * Upload a file to Cloudflare R2 using direct API
 */
export async function uploadToR2(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    console.log(`Uploading to R2 via Direct API: ${fileName}, type: ${contentType}, size: ${file.length} bytes`);
    
    // Use the direct upload URL for R2
    const directUploadUrl = `https://api.cloudflare.com/client/v4/accounts/${r2Config.accountId}/r2/buckets/${r2Config.bucket}/objects/${fileName}`;
    
    console.log('Direct upload URL:', directUploadUrl);
    console.log('Using API token:', r2Config.apiToken.substring(0, 10) + '...');
    
    const response = await fetch(directUploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Authorization': `Bearer ${r2Config.apiToken}`,
      },
      body: file,
    });
    
    console.log('R2 upload response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('R2 upload error response:', errorText);
      throw new Error(`R2 upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('R2 upload response data:', responseData);
    
    // Return the public URL
    const fileUrl = `${r2Config.publicUrl}/${fileName}`;
    console.log('R2 file URL:', fileUrl);
    
    return fileUrl;
  } catch (error) {
    console.error('Error uploading to R2 via Direct API:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.log('Falling back to local storage');
    return uploadToLocalStorage(file, fileName);
  }
}

/**
 * Delete a file from Cloudflare R2 using direct API
 */
export async function deleteFromR2(fileName: string): Promise<void> {
  try {
    console.log(`Deleting from R2 via Direct API: ${fileName}`);
    
    // Use the direct delete URL for R2
    const directDeleteUrl = `https://api.cloudflare.com/client/v4/accounts/${r2Config.accountId}/r2/buckets/${r2Config.bucket}/objects/${fileName}`;
    
    const response = await fetch(directDeleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${r2Config.apiToken}`,
      },
    });
    
    console.log('R2 delete response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('R2 delete error response:', errorText);
      throw new Error(`R2 delete failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    console.log('File deleted successfully from R2');
  } catch (error) {
    console.error('Error deleting from R2 via Direct API:', error);
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
