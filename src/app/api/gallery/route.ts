import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getHybridImageUrl } from '@/lib/hybrid-image';

// Initialize a direct PostgreSQL connection using the DATABASE_URL from env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const dynamic = 'force-dynamic';

// Helper function to sanitize a string
function sanitizeString(input: string | null | undefined): string {
  if (!input) return '';
  
  // Remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  return withoutTags.trim();
}

// Helper function to sanitize an image URL
function sanitizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Validate URL format
  if (url.startsWith('/uploads/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's not a valid URL format, return empty string
  return '';
}

// Helper function to ensure image URL uses the custom domain
function getProperImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  url = sanitizeImageUrl(url);
  if (!url) return '';
  
  // Check if the image URL is from the old R2 domain
  const oldR2Domain = 'pub-7de639d71ac205cf86c59c89880753fa.r2.dev';
  const customDomain = 'imagetat.getrezult.com';
  
  if (url.includes(oldR2Domain)) {
    // Extract the path from the old R2 URL
    const urlParts = url.split('/');
    // The path is everything after the domain part (which is at index 2)
    const pathAndFilename = urlParts.slice(3).join('/');
    
    // Use the custom domain
    return `https://${customDomain}/${pathAndFilename}`;
  } else if (url.startsWith('/uploads/')) {
    // In production, convert local paths to use the custom domain
    if (process.env.NODE_ENV === 'production') {
      const pathParts = url.split('/uploads/');
      if (pathParts.length > 1) {
        const pathAndFilename = pathParts[1].replace(/^\/+/, ''); // Remove leading slashes
        return `https://${customDomain}/${pathAndFilename}`;
      }
    }
  }
  
  return url;
}

// Mock gallery data for fallback when database connection fails
const FALLBACK_GALLERY_ITEMS = [
  {
    id: 'fallback-1',
    image: '/images/sample/gallery-1.jpg',
    title: 'Traditional Sleeve',
    artist: 'Mike Ink',
    style: 'Traditional',
    likes: 124,
    comments: 18
  },
  {
    id: 'fallback-2',
    image: '/images/sample/gallery-2.jpg',
    title: 'Japanese Back Piece',
    artist: 'Yuki Tora',
    style: 'Japanese',
    likes: 98,
    comments: 12
  },
  {
    id: 'fallback-3',
    image: '/images/sample/gallery-3.jpg',
    title: 'Geometric Mandala',
    artist: 'Lina Patterns',
    style: 'Geometric',
    likes: 156,
    comments: 24
  },
  {
    id: 'fallback-4',
    image: '/images/sample/gallery-4.jpg',
    title: 'Watercolor Bird',
    artist: 'Sophia Colors',
    style: 'Watercolor',
    likes: 87,
    comments: 9
  },
  {
    id: 'fallback-5',
    image: '/images/sample/gallery-5.jpg',
    title: 'Blackwork Portrait',
    artist: 'Dark Lines',
    style: 'Blackwork',
    likes: 112,
    comments: 15
  },
  {
    id: 'fallback-6',
    image: '/images/sample/gallery-6.jpg',
    title: 'Neo-Traditional Fox',
    artist: 'Alex Modern',
    style: 'Neo-Traditional',
    likes: 143,
    comments: 21
  }
];

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Gallery API received data:', JSON.stringify(data));
    
    // Validate required fields
    if (!data.imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Get title and artist from request or use defaults
    const title = sanitizeString(data.title) || 'Untitled Gallery Image';
    const content = sanitizeString(data.description) || 'Gallery image uploaded via Studio Admin';
    const artistId = sanitizeString(data.artistId) || 'system';

    // Create a new post entry for the gallery image
    try {
      // Generate a unique ID for the post
      const postId = `post-${Date.now()}`;
      
      // Use a direct PostgreSQL connection instead of Prisma
      const client = await pool.connect();
      
      try {
        // First, let's log the table structure to understand the constraints
        const tableInfo = await client.query(`
          SELECT column_name, is_nullable, column_default, data_type
          FROM information_schema.columns 
          WHERE table_name = 'posts'
          ORDER BY ordinal_position
        `);
        
        console.log('Posts table structure:', JSON.stringify(tableInfo.rows));
        
        // Insert with all required fields including title AND content
        const result = await client.query(
          `INSERT INTO posts (id, user_id, image_url, title, content, post_type, related_style_id) 
           VALUES ($1, $2, $3, $4, $5, 'gallery', $6) 
           RETURNING *`,
          [postId, artistId, getHybridImageUrl(data.imageUrl, 'studio', postId), title, content, data.styleId || null]
        );
        
        console.log('Post created, complete result:', JSON.stringify(result.rows[0]));
        
        return NextResponse.json({ 
          success: true, 
          message: 'Gallery image saved successfully',
          id: postId,
          post: result.rows[0]
        });
      } finally {
        // Release the client back to the pool
        client.release();
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      return NextResponse.json(
        { error: `Failed to save gallery image: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error saving gallery image:', error);
    return NextResponse.json(
      { error: `Failed to save gallery image: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Connect to the database and fetch gallery items
    const client = await pool.connect();
    
    try {
      // Query to get gallery items from the posts table
      // We're looking for posts with type 'gallery'
      const result = await client.query(`
        SELECT 
          p.id, 
          p.title, 
          p.image_url as image, 
          u.username as artist,
          s.name as style,
          (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes,
          (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments
        FROM 
          posts p
        LEFT JOIN 
          users u ON p.user_id = u.id
        LEFT JOIN 
          styles s ON p.style_id = s.id
        WHERE 
          p.post_type = 'gallery'
        ORDER BY 
          p.created_at DESC
        LIMIT 50
      `);
      
      // Process the results
      const galleryItems = result.rows.map(row => ({
        id: row.id,
        image: getHybridImageUrl(row.image, 'studio', row.id) || '',
        title: sanitizeString(row.title),
        artist: sanitizeString(row.artist) || 'Unknown Artist',
        style: sanitizeString(row.style) || 'Mixed Style',
        likes: parseInt(row.likes) || 0,
        comments: parseInt(row.comments) || 0
      }));
      
      // If we have no gallery items, use the fallback data
      if (galleryItems.length === 0) {
        return NextResponse.json(FALLBACK_GALLERY_ITEMS);
      }
      
      return NextResponse.json(galleryItems);
    } catch (error) {
      console.error('Database query error:', error);
      // Return fallback data if the query fails
      return NextResponse.json(FALLBACK_GALLERY_ITEMS);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    // Return fallback data if the connection fails
    return NextResponse.json(FALLBACK_GALLERY_ITEMS);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Use direct PostgreSQL connection instead of Prisma
    const client = await pool.connect();
    
    try {
      // Delete associated tags first if the relation exists
      try {
        await client.query(
          'DELETE FROM post_tags WHERE post_id = $1',
          [id]
        );
      } catch (error) {
        console.error('Error deleting post tags (continuing):', error);
        // Continue even if this fails - we still want to delete the post
      }

      // Delete the post
      await client.query(
        'DELETE FROM posts WHERE id = $1',
        [id]
      );

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { error: `Failed to delete gallery image: ${error.message}` },
      { status: 500 }
    );
  }
}
