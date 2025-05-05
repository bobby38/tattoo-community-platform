import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getProperImageUrl } from '@/lib/image-url';
import { slugify } from '@/lib/utils';

// Add this to make the route dynamic and not try to statically generate it
export const dynamic = 'force-dynamic';

// Fallback studios data
const FALLBACK_STUDIOS = [
  {
    id: 'studio1',
    name: 'Lovesick Tattoo Studio',
    slug: 'lovesick-tattoo-studio',
    address: 'Chinatown, Singapore',
    city: 'Singapore',
    lat: '1.2822285',
    lng: '103.8491158',
    website: 'https://lovesick.com',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'studio2',
    name: 'Familiar Strangers Tattoo Studio',
    slug: 'familiar-strangers-tattoo-studio',
    address: '20 Upper Circular Road, The Riverwalk',
    city: 'Singapore',
    lat: '1.2876',
    lng: '103.846',
    website: 'https://familiarstrangers.com',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  console.log(' [API Studios] GET request received'); 
  try {
    // Validate database connection string
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error(' [API Studios] Database connection string is not set');
      console.log(' [API Studios] Returning fallback studios data');
      return NextResponse.json(FALLBACK_STUDIOS);
    }
    
    // Create a new database connection pool
    console.log(' [API Studios] Creating database connection pool');
    const pool = new Pool({
      connectionString,
      // Don't use SSL for local development
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : undefined
    });
    
    try {
      // Check if studios table exists
      const tableResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'studios'
        );
      `);
      
      const studiosTableExists = tableResult.rows[0].exists;
      
      if (!studiosTableExists) {
        console.log(' [API Studios] Studios table does not exist, returning fallback data');
        return NextResponse.json(FALLBACK_STUDIOS);
      }
      
      // Query the studios from PostgreSQL
      const result = await pool.query(`
        SELECT 
          id, 
          name, 
          address, 
          city, 
          lat, 
          lng, 
          website, 
          created_at, 
          updated_at
        FROM studios
        ORDER BY name ASC
      `);
      
      // Process the studios to ensure image URLs are properly formatted and add missing fields
      const studios = result.rows.map(studio => {
        // Generate a slug from the name if it doesn't exist
        const slug = slugify(studio.name);
        
        // Return the studio with all the expected fields
        return {
          ...studio,
          slug,
          image_url: `/images/sample/default.jpg` // Default image since there's no image_url in the database
        };
      });
      
      console.log(` [API Studios] Found ${studios.length} studios`);
      
      // If no studios were found, return fallback data
      if (studios.length === 0) {
        console.log(' [API Studios] No studios found, returning fallback data');
        return NextResponse.json(FALLBACK_STUDIOS);
      }
      
      return NextResponse.json(studios);
    } catch (dbError: any) {
      console.error(' [API Studios] Database error:', dbError);
      console.log(' [API Studios] Returning fallback studios data due to database error');
      return NextResponse.json(FALLBACK_STUDIOS);
    } finally {
      // Close the database connection pool
      console.log(' [API Studios] Closing database connection pool');
      await pool.end();
    }
  } catch (error) {
    console.error(' [API Studios] Unexpected error:', error);
    console.log(' [API Studios] Returning fallback studios data due to unexpected error');
    return NextResponse.json(FALLBACK_STUDIOS);
  }
}
