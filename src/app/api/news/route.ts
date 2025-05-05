import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define NewsSource interface
export interface NewsSource {
  id: number;
  name: string;
  url: string;
  rss_url: string | null;
  content_focus: string;
  update_frequency: string;
  notable_features: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function to check if news_sources table exists
async function newsSourcesTableExists() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'news_sources'
      );
    `);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking if news_sources table exists:', error);
    return false;
  }
}

// Helper function to get news sources from the database
async function getNewsSourcesFromDatabase() {
  try {
    const tableExists = await newsSourcesTableExists();
    
    if (!tableExists) {
      return null;
    }
    
    const result = await pool.query('SELECT * FROM news_sources ORDER BY name ASC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching news sources from database:', error);
    return null;
  }
}

// Helper function to get news sources from the JSON file
function getNewsSourcesFromJson() {
  try {
    const filePath = path.join(process.cwd(), 'tattoo_project', 'tattoo_news_sources.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    
    // Map the JSON data to match our NewsSource interface
    return jsonData.tattoo_news_sources.map((source: any, index: number) => ({
      id: index + 1,
      name: source.name,
      url: source.url,
      rss_url: source.rss_url,
      content_focus: source.content_focus,
      update_frequency: source.update_frequency,
      notable_features: source.notable_features,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error reading news sources from JSON file:', error);
    return [];
  }
}

// GET handler for news sources
export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const frequency = url.searchParams.get('frequency');
    const search = url.searchParams.get('search');
    
    // Try to get news sources from database first
    let newsSources = await getNewsSourcesFromDatabase();
    
    // Fall back to JSON file if database doesn't have news sources
    if (!newsSources || newsSources.length === 0) {
      newsSources = getNewsSourcesFromJson();
    }
    
    // Apply filters if provided
    if (newsSources && newsSources.length > 0) {
      if (frequency) {
        newsSources = newsSources.filter((source: NewsSource) => 
          source.update_frequency.toLowerCase().includes(frequency.toLowerCase())
        );
      }
      
      if (search) {
        newsSources = newsSources.filter((source: NewsSource) => 
          source.name.toLowerCase().includes(search.toLowerCase()) ||
          source.content_focus.toLowerCase().includes(search.toLowerCase()) ||
          source.notable_features.toLowerCase().includes(search.toLowerCase())
        );
      }
    }
    
    return NextResponse.json({ news_sources: newsSources || [] });
  } catch (error) {
    console.error('Error in news sources API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news sources' },
      { status: 500 }
    );
  }
}
