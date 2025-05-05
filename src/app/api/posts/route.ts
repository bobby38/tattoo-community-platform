import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Add this to make the route dynamic and not try to statically generate it
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log(' [API Posts] GET request received');
  
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const sort = url.searchParams.get('sort') || 'created_at';
    const order = url.searchParams.get('order') || 'desc';
    const type = url.searchParams.get('type') || null;
    const styleId = url.searchParams.get('styleId') || null;
    const tribeId = url.searchParams.get('tribeId') || null;
    const offset = (page - 1) * limit;

    // Filter out 'all' values which should be treated as null
    const typeFilter = type === 'all' ? null : type;
    const styleIdFilter = styleId === 'all' ? null : styleId;
    const tribeIdFilter = tribeId === 'all' ? null : tribeId;

    // Validate database connection string
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error(' [API Posts] Database connection string is not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }
    
    // Create a new database connection pool
    console.log(' [API Posts] Creating database connection pool');
    const pool = new Pool({
      connectionString,
      // Don't use SSL for local development
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : undefined
    });
    
    try {
      // Build the query
      let query = `
        SELECT 
          p.id, 
          p.user_id,
          p.title,
          p.content,
          p.image_url,
          p.post_type,
          p.created_at,
          p.updated_at,
          s.id as style_id,
          s.name as style_name,
          s.slug as style_slug,
          t.id as tribe_id,
          t.name as tribe_name,
          t.slug as tribe_slug,
          p.likes_count,
          p.comments_count
        FROM 
          posts p
        LEFT JOIN 
          styles s ON p.related_style_id = s.id
        LEFT JOIN 
          tribes t ON p.related_tribe_id = t.id
        WHERE 1=1
      `;
      
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      // Add filters
      if (typeFilter) {
        query += ` AND p.post_type = $${paramIndex}`;
        queryParams.push(typeFilter);
        paramIndex++;
      }
      
      if (styleIdFilter) {
        query += ` AND s.id = $${paramIndex}`;
        queryParams.push(styleIdFilter);
        paramIndex++;
      }
      
      if (tribeIdFilter) {
        query += ` AND t.id = $${paramIndex}`;
        queryParams.push(tribeIdFilter);
        paramIndex++;
      }
      
      // Add sorting
      query += ` ORDER BY p.${sort} ${order === 'asc' ? 'ASC' : 'DESC'}`;
      
      // Add pagination
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);
      
      console.log(' [API Posts] Executing query:', query);
      console.log(' [API Posts] Query params:', queryParams);
      
      // Execute the query
      const result = await pool.query(query, queryParams);
      
      // Get the total count for pagination
      const countQuery = `
        SELECT COUNT(*) as total
        FROM posts p
        LEFT JOIN styles s ON p.related_style_id = s.id
        LEFT JOIN tribes t ON p.related_tribe_id = t.id
        WHERE 1=1
        ${typeFilter ? ` AND p.post_type = $1` : ''}
        ${styleIdFilter ? ` AND s.id = $${typeFilter ? 2 : 1}` : ''}
        ${tribeIdFilter ? ` AND t.id = $${(typeFilter ? 1 : 0) + (styleIdFilter ? 1 : 0) + 1}` : ''}
      `;
      
      const countParams = [];
      if (typeFilter) countParams.push(typeFilter);
      if (styleIdFilter) countParams.push(styleIdFilter);
      if (tribeIdFilter) countParams.push(tribeIdFilter);
      
      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].total);
      
      // Format the posts
      const posts = result.rows.map(row => {
        return {
          id: row.id,
          user_id: row.user_id,
          title: row.title,
          content: row.content,
          image_url: row.image_url,
          post_type: row.post_type,
          created_at: row.created_at,
          updated_at: row.updated_at,
          related_style: row.style_id ? {
            id: row.style_id,
            name: row.style_name,
            slug: row.style_slug
          } : null,
          related_tribe: row.tribe_id ? {
            id: row.tribe_id,
            name: row.tribe_name,
            slug: row.tribe_slug
          } : null,
          likes_count: parseInt(row.likes_count) || 0,
          comments_count: parseInt(row.comments_count) || 0
        };
      });
      
      // If no posts were found but we have imported data, create some sample posts
      if (posts.length === 0 && page === 1) {
        console.log(' [API Posts] No posts found, checking if we need to create sample posts');
        
        // Check if we have artists and styles
        const artistsResult = await pool.query('SELECT COUNT(*) as count FROM artists');
        const artistsCount = parseInt(artistsResult.rows[0].count);
        
        if (artistsCount > 0) {
          console.log(' [API Posts] Artists found, creating sample posts');
          
          // Create sample posts
          await createSamplePosts(pool);
          
          // Retry the query
          const retryResult = await pool.query(query, queryParams);
          const retryPosts = retryResult.rows.map(row => {
            return {
              id: row.id,
              user_id: row.user_id,
              title: row.title,
              content: row.content,
              image_url: row.image_url,
              post_type: row.post_type,
              created_at: row.created_at,
              updated_at: row.updated_at,
              related_style: row.style_id ? {
                id: row.style_id,
                name: row.style_name,
                slug: row.style_slug
              } : null,
              related_tribe: row.tribe_id ? {
                id: row.tribe_id,
                name: row.tribe_name,
                slug: row.tribe_slug
              } : null,
              likes_count: parseInt(row.likes_count) || 0,
              comments_count: parseInt(row.comments_count) || 0
            };
          });
          
          return NextResponse.json({ 
            posts: retryPosts, 
            pagination: { 
              total: retryPosts.length, 
              page, 
              limit, 
              pages: Math.ceil(retryPosts.length / limit) 
            } 
          });
        }
      }
      
      return NextResponse.json({ 
        posts, 
        pagination: { 
          total, 
          page, 
          limit, 
          pages: Math.ceil(total / limit) 
        } 
      });
    } catch (dbError: any) {
      console.error(' [API Posts] Database error:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    } finally {
      // Close the database connection pool
      console.log(' [API Posts] Closing database connection pool');
      await pool.end();
    }
  } catch (e: any) {
    console.error(' [API Posts] Unexpected error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper function to create sample posts
async function createSamplePosts(pool: Pool) {
  console.log(' [API Posts] Creating sample posts');
  
  try {
    // Get all artists
    const artistsResult = await pool.query('SELECT id, name, studio_id FROM artists');
    const artists = artistsResult.rows;
    
    // Get all styles
    const stylesResult = await pool.query('SELECT id, name FROM styles');
    const styles = stylesResult.rows;
    
    // Get a system user or create one if it doesn't exist
    let systemUserId;
    const userResult = await pool.query('SELECT id FROM users WHERE name = $1', ['System']);
    
    if (userResult.rows.length === 0) {
      const newUserResult = await pool.query(
        'INSERT INTO users (id, name, email, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id',
        [`c${Math.random().toString(36).substring(2, 15)}`, 'System', 'system@ink2tattoo.com', 'ADMIN']
      );
      systemUserId = newUserResult.rows[0].id;
    } else {
      systemUserId = userResult.rows[0].id;
    }
    
    // Create sample posts for each artist
    for (const artist of artists) {
      // Get the artist's styles
      const artistStylesResult = await pool.query(
        'SELECT style_id FROM artist_styles WHERE artist_id = $1',
        [artist.id]
      );
      
      const artistStyles = artistStylesResult.rows.map(row => row.style_id);
      
      // If the artist has no styles, use a random one
      const styleId = artistStyles.length > 0 
        ? artistStyles[Math.floor(Math.random() * artistStyles.length)]
        : styles[Math.floor(Math.random() * styles.length)].id;
      
      // Create a gallery post
      await pool.query(
        `INSERT INTO posts (
          id, user_id, title, content, image_url, post_type, related_style_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          `c${Math.random().toString(36).substring(2, 15)}`,
          systemUserId,
          `Latest work by ${artist.name}`,
          `Check out this amazing tattoo by ${artist.name}!`,
          `https://source.unsplash.com/random/800x600/?tattoo`,
          'gallery',
          styleId
        ]
      );
      
      // Create a news post
      await pool.query(
        `INSERT INTO posts (
          id, user_id, title, content, image_url, post_type, related_style_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          `c${Math.random().toString(36).substring(2, 15)}`,
          systemUserId,
          `${artist.name} joins our platform!`,
          `We're excited to welcome ${artist.name} to our community. They specialize in various tattoo styles and are ready to showcase their work.`,
          `https://source.unsplash.com/random/800x600/?artist`,
          'news',
          styleId
        ]
      );
    }
    
    console.log(' [API Posts] Sample posts created successfully');
  } catch (error) {
    console.error(' [API Posts] Error creating sample posts:', error);
  }
}
