import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define NotableFigure interface
export interface NotableFigure {
  id: number;
  name: string;
  region: string;
  specialty: string;
  contributions: string;
  awards: string[] | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// GET handler for notable figures
export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const region = url.searchParams.get('region');
    const specialty = url.searchParams.get('specialty');
    const search = url.searchParams.get('search');
    
    // Base query
    let query = 'SELECT * FROM notable_figures';
    const queryParams: any[] = [];
    const conditions: string[] = [];
    
    // Add filters if provided
    if (region) {
      conditions.push(`region ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${region}%`);
    }
    
    if (specialty) {
      conditions.push(`specialty ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${specialty}%`);
    }
    
    if (search) {
      conditions.push(`(name ILIKE $${queryParams.length + 1} OR contributions ILIKE $${queryParams.length + 1})`);
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
    
    return NextResponse.json({ notable_figures: result.rows });
  } catch (error) {
    console.error('Error in notable figures API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notable figures' },
      { status: 500 }
    );
  }
}
