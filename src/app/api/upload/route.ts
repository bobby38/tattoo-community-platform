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

// Ensure uploads directory exists for fallback
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log('Created uploads directory:', UPLOADS_DIR);
  }
} catch (err) {
  console.error('Failed to create uploads directory:', err);
}

export async function POST(request: Request) {
  try {
    console.log('Upload request received');
    
    // Get the form data from the request
    const formData = await request.formData();
    console.log('FormData received, entries:', Array.from(formData.entries()).map(([key]) => key));
    
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || '';

    // Validate the file
    if (!file) {
      console.error('No file provided in form data');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File details:', { 
      name: file.name, 
      type: file.type, 
      size: file.size,
      folder
    });

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      console.error('File size exceeds limit', { size: file.size, limit: MAX_FILE_SIZE });
      return NextResponse.json(
        { error: 'File size exceeds the 5MB limit' },
        { status: 400 }
      );
    }

    // Check file type (optional - adjust as needed)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('File type not allowed', { type: file.type, allowed: allowedTypes });
      return NextResponse.json(
        { error: 'File type not allowed. Only JPEG, PNG, and WEBP are supported.' },
        { status: 400 }
      );
    }

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

    // Get file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    try {
      // Upload to R2 storage
      const fileUrl = await uploadToR2(buffer, storagePath, file.type);
      console.log('File uploaded successfully, URL:', fileUrl);
      
      // Extract additional metadata from the form
      const title = formData.get('title') as string || 'Untitled';
      const artist = formData.get('artist') as string || '';
      const style = formData.get('style') as string || '';
      const tags = formData.get('tags') as string || '';
      
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
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }
      });
    } catch (saveError: any) {
      console.error('Error uploading file:', saveError);
      return NextResponse.json(
        { error: `Failed to upload file: ${saveError.message}` },
        { status: 500 }
      );
    }
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
