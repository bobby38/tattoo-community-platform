import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { uploadToR2, deleteFromR2 } from '@/lib/cloudflare-r2';

// Add this to make the route dynamic
export const dynamic = 'force-dynamic';

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Local file storage configuration (fallback only)
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const PUBLIC_URL = '/uploads';

// Helper function to ensure a directory exists
function ensureDirExists(dirPath: string): string {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    try {
      // Try to set permissions, but don't fail if it doesn't work
      fs.chmodSync(dirPath, 0o777);
    } catch (error) {
      console.warn(`Warning: Could not set permissions for ${dirPath}`);
    }
  }
  return dirPath;
}

// Ensure uploads directory exists for fallback
try {
  // Check if we're in a production environment
  if (process.env.NODE_ENV === 'production') {
    // In production, the directory should be created by the ensure-uploads-dir.js script
    console.log('Production environment detected, uploads directory should be created by startup script');
  } else {
    // In development, create the directory if it doesn't exist
    ensureDirExists(UPLOADS_DIR);
    console.log('Created uploads directory:', UPLOADS_DIR);
  }
} catch (err) {
  console.error('Failed to create uploads directory:', err);
}

export async function POST(request: Request) {
  try {
    console.log('Upload request received');
    
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Get the file from the form data
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the maximum limit (5MB)' }, { status: 400 });
    }
    
    // Check file type
    const fileType = file.type;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'File type not supported' }, { status: 400 });
    }
    
    // Get other form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const folder = formData.get('folder') as string || '';
    const style = formData.get('style') as string || '';
    const tagsString = formData.get('tags') as string || '';
    const tags = tagsString ? tagsString.split(',') : [];
    
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    
    // Create the storage path - ensure proper formatting with single slash
    // Remove any trailing slashes from folder and ensure clean path
    const cleanFolder = folder ? folder.replace(/\/+$/, '') : '';
    const storagePath = cleanFolder ? `${cleanFolder}/${uniqueFilename}` : uniqueFilename;
    
    console.log('Preparing to upload file:', storagePath);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    // Ensure the upload directory exists
    const uploadDir = path.join(UPLOADS_DIR, cleanFolder);
    ensureDirExists(uploadDir);
    
    // Get file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // File URL to be saved in the database
    let fileUrl = '';
    let r2Error = null;
    
    // In production, always try R2 first and don't fall back to local storage
    // In development, try R2 first but fall back to local storage if R2 fails
    const isProd = process.env.NODE_ENV === 'production';
    
    try {
      // Always try to upload to R2 first
      const r2Result = await uploadToR2(buffer, storagePath, fileType);
      // The uploadToR2 function returns a string, not an object with url property
      fileUrl = r2Result;
      console.log('Successfully uploaded to R2:', fileUrl);
    } catch (err) {
      r2Error = err;
      console.error('Failed to upload to R2:', err);
      
      // Only fall back to local storage in development
      if (!isProd) {
        // Save to local storage as fallback in development only
        const localFilePath = path.join(uploadDir, uniqueFilename);
        fs.writeFileSync(localFilePath, buffer);
        fileUrl = `${PUBLIC_URL}/${cleanFolder ? cleanFolder + '/' : ''}${uniqueFilename}`;
        console.log('Saved to local storage:', localFilePath);
      } else {
        // In production, if R2 fails, return an error
        return NextResponse.json({ 
          error: 'Failed to upload to R2 storage',
          details: r2Error
        }, { status: 500 });
      }
    }
    
    // Extract additional metadata from the form
    const artist = formData.get('artist') as string || '';
    
    console.log('Metadata received:', { title, artist, style, tags });
    
    // Save metadata to database if needed
    // This is where you would save the file metadata to your database
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: uniqueFilename,
      metadata: {
        title,
        artist,
        style,
        tags: tags.map(tag => tag.trim()).filter(Boolean)
      }
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Get the file path from the request
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'No file path provided' },
        { status: 400 }
      );
    }

    // Extract the filename from the URL
    // For R2 URLs: https://pub-xxx.r2.dev/folder/filename.jpg
    // For local URLs: /uploads/folder/filename.jpg
    let storagePath = '';
    
    if (filePath.includes('r2.dev')) {
      // R2 URL format
      const urlParts = filePath.split('r2.dev/');
      if (urlParts.length > 1) {
        storagePath = urlParts[1];
      }
    } else {
      // Local URL format
      // Remove the leading slash if present
      const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      
      // Remove the /uploads prefix if present
      storagePath = normalizedPath.startsWith('uploads/') 
        ? normalizedPath.substring(8) 
        : normalizedPath;
    }
    
    console.log('Deleting file:', storagePath);
    
    try {
      // Delete from R2 storage
      await deleteFromR2(storagePath);
      console.log('File deleted successfully');
      return NextResponse.json({ success: true });
    } catch (deleteError: any) {
      console.error('Error deleting file:', deleteError);
      return NextResponse.json(
        { error: `Failed to delete file: ${deleteError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
