import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getProperImageUrl } from '@/lib/image-url';

// Add this to make the route dynamic and not try to statically generate it
export const dynamic = 'force-dynamic';

// Fallback tribes data
const FALLBACK_TRIBES = [
  {
    id: 'tribe1',
    name: 'Traditional Enthusiasts',
    slug: 'traditional-enthusiasts',
    description: 'A community dedicated to traditional and old school tattoo styles.',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tribe2',
    name: 'Polynesian Collective',
    slug: 'polynesian-collective',
    description: 'Celebrating the rich heritage of Polynesian tattoo art and culture.',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tribe3',
    name: 'Minimalist Ink',
    slug: 'minimalist-ink',
    description: 'For those who appreciate the beauty of simple, clean line work.',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tribe4',
    name: 'Color Explosion',
    slug: 'color-explosion',
    description: 'A vibrant community for colorful and bold tattoo designs.',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  console.log(' [API Tribes] GET request received'); 
  try {
    // Validate database connection string
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error(' [API Tribes] Database connection string is not set');
      console.log(' [API Tribes] Returning fallback tribes data');
      return NextResponse.json(FALLBACK_TRIBES);
    }
    
    // Create a new database connection pool
    console.log(' [API Tribes] Creating database connection pool');
    const pool = new Pool({
      connectionString,
      // Don't use SSL for local development
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : undefined
    });
    
    try {
      // Check if tribes table exists
      const tableResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'tribes'
        );
      `);
      
      const tribesTableExists = tableResult.rows[0].exists;
      
      if (!tribesTableExists) {
        console.log(' [API Tribes] Tribes table does not exist, returning fallback data');
        return NextResponse.json(FALLBACK_TRIBES);
      }
      
      // Query the tribes from PostgreSQL
      const result = await pool.query(`
        SELECT id, name, slug, description, image_url, created_at, updated_at
        FROM tribes
        ORDER BY name ASC
      `);
      
      // Process the tribes to ensure image URLs are properly formatted
      const tribes = result.rows.map(tribe => {
        // If the tribe has an image_url, make sure it's properly formatted
        if (tribe.image_url) {
          return {
            ...tribe,
            image_url: getProperImageUrl(tribe.image_url)
          };
        }
        // If no image_url, add a default one
        return {
          ...tribe,
          image_url: `/images/sample/default.jpg`
        };
      });
      
      console.log(` [API Tribes] Found ${tribes.length} tribes`);
      
      // If no tribes were found, return fallback data
      if (tribes.length === 0) {
        console.log(' [API Tribes] No tribes found, returning fallback data');
        return NextResponse.json(FALLBACK_TRIBES);
      }
      
      return NextResponse.json(tribes);
    } catch (dbError: any) {
      console.error(' [API Tribes] Database error:', dbError);
      console.log(' [API Tribes] Returning fallback tribes data due to database error');
      return NextResponse.json(FALLBACK_TRIBES);
    } finally {
      // Close the database connection pool
      console.log(' [API Tribes] Closing database connection pool');
      await pool.end();
    }
  } catch (error) {
    console.error(' [API Tribes] Unexpected error:', error);
    console.log(' [API Tribes] Returning fallback tribes data due to unexpected error');
    return NextResponse.json(FALLBACK_TRIBES);
  }
}
