import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { slugify } from '@/lib/utils';

// Add this to make the route dynamic and not try to statically generate it
export const dynamic = 'force-dynamic';

// Fallback artists data
const FALLBACK_ARTISTS = [
  {
    id: 'artist1',
    name: 'John Doe',
    slug: 'john-doe',
    studio_id: 'studio1',
    bio: 'Specializes in traditional and neo-traditional tattoos.',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'artist2',
    name: 'Jane Smith',
    slug: 'jane-smith',
    studio_id: 'studio2',
    bio: 'Known for realistic and portrait tattoos.',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  console.log('[API Artists] GET request received'); 
  try {
    // Validate database connection string
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('[API Artists] Database connection string is not set');
      console.log('[API Artists] Returning fallback artists data');
      return NextResponse.json(FALLBACK_ARTISTS);
    }
    
    // Create a new database connection pool
    console.log('[API Artists] Creating database connection pool');
    const pool = new Pool({
      connectionString,
      // Don't use SSL for local development
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : undefined
    });
    
    try {
      // Check if artists table exists
      const tableResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'artists'
        );
      `);
      
      const artistsTableExists = tableResult.rows[0].exists;
      
      if (!artistsTableExists) {
        console.log('[API Artists] Artists table does not exist, returning fallback data');
        return NextResponse.json(FALLBACK_ARTISTS);
      }
      
      // Get query parameters
      const url = new URL(request.url);
      const studioId = url.searchParams.get('studio_id');
      
      // Build the query based on parameters
      let query = `
        SELECT 
          id, 
          studio_id, 
          name, 
          bio, 
          created_at, 
          updated_at
        FROM artists
      `;
      
      const queryParams = [];
      
      if (studioId) {
        query += ` WHERE studio_id = $1`;
        queryParams.push(studioId);
      }
      
      query += ` ORDER BY name ASC`;
      
      // Query the artists from PostgreSQL
      const result = await pool.query(query, queryParams);
      
      // Process the artists to add missing fields
      const artists = result.rows.map(artist => {
        // Generate a slug from the name if it doesn't exist
        const slug = slugify(artist.name);
        
        // Return the artist with all the expected fields
        return {
          ...artist,
          slug,
          image_url: `/images/sample/default.jpg` // Default image since there's no image_url in the database
        };
      });
      
      console.log(`[API Artists] Found ${artists.length} artists`);
      
      // If no artists were found, return fallback data
      if (artists.length === 0) {
        console.log('[API Artists] No artists found, returning fallback data');
        return NextResponse.json(FALLBACK_ARTISTS);
      }
      
      return NextResponse.json(artists);
    } catch (dbError: any) {
      console.error('[API Artists] Database error:', dbError);
      console.log('[API Artists] Returning fallback artists data due to database error');
      return NextResponse.json(FALLBACK_ARTISTS);
    } finally {
      // Close the database connection pool
      console.log('[API Artists] Closing database connection pool');
      await pool.end();
    }
  } catch (error) {
    console.error('[API Artists] Unexpected error:', error);
    console.log('[API Artists] Returning fallback artists data due to unexpected error');
    return NextResponse.json(FALLBACK_ARTISTS);
  }
}
