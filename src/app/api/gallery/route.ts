import { NextResponse } from 'next/server';
import { Pool } from 'pg';

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
          [postId, artistId, getProperImageUrl(data.imageUrl), title, content, data.styleId || null]
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
  console.log('🔍 [API Gallery] GET request received');
  
  try {
    // Validate database connection string
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('❌ [API Gallery] Database connection string is not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }
    
    // Create a new database connection pool
    console.log('🔍 [API Gallery] Creating database connection pool');
    const pool = new Pool({
      connectionString,
    });
    
    try {
      // Query the database for gallery items
      console.log('🔍 [API Gallery] Querying database for gallery items');
      const result = await pool.query(`
        SELECT 
          p.id, 
          p.title, 
          p.content as description, 
          p.image_url as "imageUrl", 
          p.created_at as "createdAt",
          p.user_id as "userId",
          u.name as artist,
          COALESCE(s.name, 'Other') as style,
          ARRAY_AGG(DISTINCT t.name) as tags
        FROM 
          posts p
        LEFT JOIN 
          users u ON p.user_id = u.id
        LEFT JOIN 
          styles s ON p.style_id = s.id
        LEFT JOIN 
          post_tags pt ON p.id = pt.post_id
        LEFT JOIN 
          tags t ON pt.tag_id = t.id
        WHERE 
          p.post_type = 'gallery'
        GROUP BY 
          p.id, u.name, s.name
        ORDER BY 
          p.created_at DESC
      `);
      
      console.log('✅ [API Gallery] Database query successful, rows:', result.rows.length);
      
      // Process and sanitize the results
      const galleryItems = result.rows.map(item => {
        // Sanitize all string fields
        const sanitizedItem = {
          id: item.id,
          title: sanitizeString(item.title) || 'Untitled',
          description: sanitizeString(item.description) || '',
          imageUrl: getProperImageUrl(item.imageUrl),
          createdAt: item.createdAt,
          userId: sanitizeString(item.userId) || '',
          artist: sanitizeString(item.artist) || 'Unknown Artist',
          style: sanitizeString(item.style) || 'Other',
          tags: Array.isArray(item.tags) 
            ? item.tags.filter(Boolean).map((tag: string) => sanitizeString(tag)) 
            : []
        };
        
        // Skip items with invalid image URLs
        if (!sanitizedItem.imageUrl) {
          console.log('⚠️ [API Gallery] Skipping item with invalid image URL:', item.id);
          return null;
        }
        
        return sanitizedItem;
      }).filter(Boolean); // Remove null items
      
      console.log('✅ [API Gallery] Returning sanitized gallery items:', galleryItems.length);
      
      // Return the gallery items
      return NextResponse.json(galleryItems);
    } catch (dbError: any) {
      console.error('❌ [API Gallery] Database error:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    } finally {
      // Close the database connection pool
      console.log('🔍 [API Gallery] Closing database connection pool');
      await pool.end();
    }
  } catch (error: any) {
    console.error('❌ [API Gallery] Server error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
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
