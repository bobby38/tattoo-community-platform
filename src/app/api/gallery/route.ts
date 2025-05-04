import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Initialize a direct PostgreSQL connection using the DATABASE_URL from env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const dynamic = 'force-dynamic';

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
    const title = data.title || 'Untitled Gallery Image';
    const content = data.description || 'Gallery image uploaded via Studio Admin';
    const artistId = data.artistId || 'system';

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
          [postId, artistId, data.imageUrl, title, content, data.styleId || null]
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

export async function GET() {
  try {
    // Use direct PostgreSQL connection instead of Prisma
    const client = await pool.connect();
    
    try {
      // Simplified query without joins that might cause errors
      const result = await client.query(`
        SELECT p.*
        FROM posts p
        WHERE p.image_url IS NOT NULL AND p.post_type = 'gallery'
        ORDER BY p.created_at DESC
      `);
      
      // Transform the data to match the expected format in the gallery component
      const galleryItems = result.rows.map((post: any) => {
        // Get the image URL from the post
        let imageUrl = post.image_url;
        
        // Convert old R2 URLs to the new custom domain format
        if (imageUrl && imageUrl.includes('r2.dev')) {
          // Extract the path and filename from the R2 URL
          const urlParts = imageUrl.split('/');
          // The path is everything after the domain part (which is at index 2)
          const pathAndFilename = urlParts.slice(3).join('/');
          
          // Create the new URL with the custom domain
          const customDomain = process.env.R2_PUBLIC_URL || 'https://imagetat.getrezult.com';
          const formattedDomain = customDomain.endsWith('/') ? customDomain.slice(0, -1) : customDomain;
          imageUrl = `${formattedDomain}/${pathAndFilename}`;
          
          console.log(`Converted R2 URL: ${post.image_url} -> ${imageUrl}`);
        }
        // Fall back to local URL if image URL is not accessible
        else if (!imageUrl || (!imageUrl.startsWith('/') && !imageUrl.startsWith('http'))) {
          const filename = imageUrl ? imageUrl.split('/').pop() : 'unknown.jpg';
          imageUrl = `/uploads/gallery/${filename}`;
          console.log(`Using local fallback URL: ${imageUrl}`);
        }
        
        return {
          id: post.id,
          image: imageUrl,
          title: post.title || post.content || 'Untitled',
          artist: post.user_id || 'Unknown Artist',
          style: post.related_style_id || 'Other',
          tags: [], // Initialize with empty array since we don't have tags yet
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          featured: false,
          uploadDate: post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : '',
        };
      });
      
      return NextResponse.json(galleryItems);
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: `Failed to fetch gallery images: ${error.message}` },
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
