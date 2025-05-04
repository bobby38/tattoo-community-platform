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

// Allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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

// Helper function to sanitize a string
function sanitizeString(input: string | null | undefined): string {
  if (!input) return '';
  
  // Remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  return withoutTags.trim();
}

// Helper function to validate and sanitize tags
function sanitizeTags(tagsInput: string): string[] {
  if (!tagsInput) return [];
  
  // Split by comma, trim whitespace, remove empty tags
  return tagsInput
    .split(',')
    .map(tag => sanitizeString(tag))
    .filter(Boolean);
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
  console.log(' [API] Upload endpoint called');
  
  try {
    console.log(' [API] Parsing form data...');
    
    // Parse the multipart form data
    const formData = await request.formData();
    console.log(' [API] Form data received:', Array.from(formData.entries()).map(([key]) => key));
    
    // Get the file from the form data
    const file = formData.get('file') as File;
    if (!file) {
      console.error(' [API] No file provided in form data');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    console.log(' [API] File details:', { 
      name: file.name, 
      type: file.type, 
      size: file.size 
    });
    
    // Validate file name
    const fileName = file.name;
    if (!/^[a-zA-Z0-9_\-. ]+\.(jpg|jpeg|png|webp)$/i.test(fileName)) {
      console.error(' [API] Invalid file name:', fileName);
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      console.error(' [API] File size exceeds limit', { size: file.size, limit: MAX_FILE_SIZE });
      return NextResponse.json({ error: 'File size exceeds the maximum limit (5MB)' }, { status: 400 });
    }
    
    // Check file type
    const fileType = file.type;
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      console.error(' [API] File type not allowed', { type: fileType, allowed: ALLOWED_FILE_TYPES });
      return NextResponse.json({ error: 'File type not supported' }, { status: 400 });
    }
    
    // Get and sanitize other form data
    const title = sanitizeString(formData.get('title') as string);
    if (!title) {
      console.error(' [API] Title is required');
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const description = sanitizeString(formData.get('description') as string) || '';
    const folder = sanitizeString(formData.get('folder') as string) || '';
    const style = sanitizeString(formData.get('style') as string) || '';
    const artist = sanitizeString(formData.get('artist') as string) || '';
    
    // Validate folder (only allow certain folders)
    if (folder && !['gallery', 'profile', 'posts'].includes(folder)) {
      console.error(' [API] Invalid folder:', folder);
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
    }
    
    // Sanitize and validate tags
    const tagsString = formData.get('tags') as string || '';
    const tags = sanitizeTags(tagsString);
    
    console.log(' [API] Sanitized metadata:', { title, description, folder, style, tags, artist });
    
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    
    // Create the storage path - ensure proper formatting with single slash
    // Remove any trailing slashes from folder and ensure clean path
    const cleanFolder = folder ? folder.replace(/\/+$/, '') : '';
    const storagePath = cleanFolder ? `${cleanFolder}/${uniqueFilename}` : uniqueFilename;
    
    console.log(' [API] Storage path:', storagePath);

    // Ensure the upload directory exists
    const uploadDir = path.join(UPLOADS_DIR, cleanFolder);
    console.log(' [API] Ensuring upload directory exists:', uploadDir);
    ensureDirExists(uploadDir);
    
    // Get file buffer
    console.log(' [API] Converting file to buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(' [API] Buffer created, size:', buffer.length);
    
    // File URL to be saved in the database
    let fileUrl = '';
    let r2Error = null;
    
    // In production, always try R2 first and don't fall back to local storage
    // In development, try R2 first but fall back to local storage if R2 fails
    const isProd = process.env.NODE_ENV === 'production';
    console.log(' [API] Environment:', isProd ? 'production' : 'development');
    
    try {
      // Always try to upload to R2 first
      console.log(' [API] Attempting to upload to R2...');
      console.log(' [API] R2 config:', { 
        accountId: process.env.R2_ACCOUNT_ID ? ' Set' : ' Not set',
        accessKeyId: process.env.R2_ACCESS_KEY_ID ? ' Set' : ' Not set',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ? ' Set' : ' Not set',
        bucket: process.env.R2_BUCKET ? ' Set' : ' Not set',
        publicUrl: process.env.R2_PUBLIC_URL ? ' Set' : ' Not set'
      });
      
      const r2Result = await uploadToR2(buffer, storagePath, fileType);
      // The uploadToR2 function returns a string, not an object with url property
      fileUrl = r2Result;
      console.log(' [API] Successfully uploaded to R2:', fileUrl);
    } catch (err) {
      r2Error = err;
      console.error(' [API] Failed to upload to R2:', err);
      
      // Only fall back to local storage in development
      if (!isProd) {
        console.log(' [API] Falling back to local storage in development environment');
        // Save to local storage as fallback in development only
        const localFilePath = path.join(uploadDir, uniqueFilename);
        console.log(' [API] Saving to local path:', localFilePath);
        fs.writeFileSync(localFilePath, buffer);
        fileUrl = `${PUBLIC_URL}/${cleanFolder ? cleanFolder + '/' : ''}${uniqueFilename}`;
        console.log(' [API] Saved to local storage:', fileUrl);
      } else {
        // In production, if R2 fails, return an error
        console.error(' [API] R2 upload failed in production, returning error');
        return NextResponse.json({ 
          error: 'Failed to upload to R2 storage',
          details: r2Error
        }, { status: 500 });
      }
    }
    
    // Return the response with sanitized data
    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: uniqueFilename,
      metadata: {
        title,
        artist,
        style,
        tags
      }
    });
  } catch (error: any) {
    console.error(' [API] Upload error:', error);
    return NextResponse.json(
      { error: `Failed to upload file: ${error.message}` },
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
