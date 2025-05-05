import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define Award interface
export interface Award {
  id: number;
  name: string;
  organizer: string;
  criteria: string;
  prestige_level: string;
  frequency: string;
  past_winners: string[];
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// GET handler for awards
export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const prestige = url.searchParams.get('prestige_level');
    const search = url.searchParams.get('search');
    
    // Base query
    let query = 'SELECT * FROM awards';
    const queryParams: any[] = [];
    const conditions: string[] = [];
    
    // Add filters if provided
    if (prestige) {
      conditions.push(`prestige_level ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${prestige}%`);
    }
    
    if (search) {
      conditions.push(`(name ILIKE $${queryParams.length + 1} OR organizer ILIKE $${queryParams.length + 1} OR criteria ILIKE $${queryParams.length + 1})`);
      queryParams.push(`%${search}%`);
    }
    
    // Add WHERE clause if we have conditions
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Add ORDER BY clause
    query += ' ORDER BY name ASC';
    
    // Execute query
    const result = await pool.query(query, queryParams);
    
    return NextResponse.json({ awards: result.rows });
  } catch (error) {
    console.error('Error in awards API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch awards' },
      { status: 500 }
    );
  }
}
