import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getProperImageUrl } from '@/lib/image-url';

// Add this to make the route dynamic and not try to statically generate it
export const dynamic = 'force-dynamic';

// Fallback styles data
const FALLBACK_STYLES = [
  {
    id: 'style1',
    name: 'American Traditional',
    slug: 'american-traditional',
    description: 'Bold lines, vibrant colors, and classic motifs like roses, anchors, and eagles.',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'style2',
    name: 'Japanese Irezumi',
    slug: 'japanese-irezumi',
    description: 'Traditional Japanese style featuring mythical creatures, nature, and heroes.',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'style3',
    name: 'Blackwork',
    slug: 'blackwork',
    description: 'Bold black ink designs with intricate patterns and geometric shapes.',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'style4',
    name: 'Realism',
    slug: 'realism',
    description: 'Photorealistic tattoos that look like photographs or 3D images.',
    image_url: '/images/sample/default.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  console.log(' [API Styles] GET request received'); 
  try {
    // Validate database connection string
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('[API Styles] Database connection string is not set');
      console.log('[API Styles] Returning fallback styles data');
      return NextResponse.json(FALLBACK_STYLES);
    }
    
    // Create a new database connection pool
    console.log('[API Styles] Creating database connection pool');
    const pool = new Pool({
      connectionString,
      // Don't use SSL for local development
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : undefined
    });
    
    try {
      // Check if styles table exists
      const tableResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'styles'
        );
      `);
      
      const stylesTableExists = tableResult.rows[0].exists;
      
      if (!stylesTableExists) {
        console.log('[API Styles] Styles table does not exist, returning fallback data');
        return NextResponse.json(FALLBACK_STYLES);
      }
      
      // Query the styles from PostgreSQL
      const result = await pool.query(`
        SELECT id, name, slug, description, image_url, created_at, updated_at
        FROM styles
        ORDER BY name ASC
      `);
      
      // Process the styles to ensure image URLs are properly formatted
      const styles = result.rows.map(style => {
        // If the style has an image_url, make sure it's properly formatted
        if (style.image_url) {
          return {
            ...style,
            image_url: getProperImageUrl(style.image_url)
          };
        }
        // If no image_url, add a default one
        return {
          ...style,
          image_url: `/images/sample/default.jpg`
        };
      });
      
      console.log(`[API Styles] Found ${styles.length} styles`);
      
      // If no styles were found, return fallback data
      if (styles.length === 0) {
        console.log('[API Styles] No styles found, returning fallback data');
        return NextResponse.json(FALLBACK_STYLES);
      }
      
      return NextResponse.json(styles);
    } catch (dbError: any) {
      console.error('[API Styles] Database error:', dbError);
      console.log('[API Styles] Returning fallback styles data due to database error');
      return NextResponse.json(FALLBACK_STYLES);
    } finally {
      // Close the database connection pool
      console.log('[API Styles] Closing database connection pool');
      await pool.end();
    }
  } catch (error) {
    console.error('[API Styles] Unexpected error:', error);
    console.log('[API Styles] Returning fallback styles data due to unexpected error');
    return NextResponse.json(FALLBACK_STYLES);
  }
}

// Optional: Add other HTTP methods if needed (POST, PUT, DELETE)
