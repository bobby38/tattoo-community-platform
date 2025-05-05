import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define Community interface
export interface Community {
  id: number;
  name: string;
  platform: string;
  url: string;
  member_count: number;
  focus_theme: string;
  activity_level: string;
  notable_features: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// GET handler for communities
export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const platform = url.searchParams.get('platform');
    const activityLevel = url.searchParams.get('activity_level');
    const search = url.searchParams.get('search');
    
    // Base query
    let query = 'SELECT * FROM communities';
    const queryParams: any[] = [];
    const conditions: string[] = [];
    
    // Add filters if provided
    if (platform) {
      conditions.push(`platform = $${queryParams.length + 1}`);
      queryParams.push(platform);
    }
    
    if (activityLevel) {
      conditions.push(`activity_level = $${queryParams.length + 1}`);
      queryParams.push(activityLevel);
    }
    
    if (search) {
      conditions.push(`(name ILIKE $${queryParams.length + 1} OR focus_theme ILIKE $${queryParams.length + 1})`);
      queryParams.push(`%${search}%`);
    }
    
    // Add WHERE clause if we have conditions
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Add ORDER BY clause
    query += ' ORDER BY member_count DESC';
    
    // Execute query
    const result = await pool.query(query, queryParams);
    
    return NextResponse.json({ communities: result.rows });
  } catch (error) {
    console.error('Error in communities API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    );
  }
}
