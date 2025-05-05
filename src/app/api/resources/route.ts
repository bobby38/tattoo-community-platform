import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define Resource interface
export interface Resource {
  id: number;
  name: string;
  provider: string;
  format: string;
  topic: string;
  cost: string;
  duration: string;
  availability: string;
  features: string;
  region: string;
  url: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function to check if resources table exists
async function resourcesTableExists() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'resources'
      );
    `);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking if resources table exists:', error);
    return false;
  }
}

// Helper function to get resources from the database
async function getResourcesFromDatabase() {
  try {
    const tableExists = await resourcesTableExists();
    
    if (!tableExists) {
      return null;
    }
    
    const result = await pool.query('SELECT * FROM resources ORDER BY name ASC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching resources from database:', error);
    return null;
  }
}

// Helper function to get resources from the JSON file
function getResourcesFromJson() {
  try {
    const filePath = path.join(process.cwd(), 'tattoo_project', 'tattoo_education.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    
    // Map the JSON data to match our Resource interface
    return jsonData.tattoo_educational_resources.map((resource: any, index: number) => ({
      id: index + 1,
      name: resource.name,
      provider: resource.provider,
      format: resource.format,
      topic: resource.topic,
      cost: resource.cost,
      duration: resource.duration,
      availability: resource.availability,
      features: resource.features,
      region: resource.region,
      url: resource.url,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error reading resources from JSON file:', error);
    return [];
  }
}

// GET handler for resources
export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const format = url.searchParams.get('format');
    const region = url.searchParams.get('region');
    const search = url.searchParams.get('search');
    
    // Try to get resources from database first
    let resources = await getResourcesFromDatabase();
    
    // Fall back to JSON file if database doesn't have resources
    if (!resources || resources.length === 0) {
      resources = getResourcesFromJson();
    }
    
    // Apply filters if provided
    if (resources && resources.length > 0) {
      if (format) {
        resources = resources.filter((resource: Resource) => 
          resource.format.toLowerCase().includes(format.toLowerCase())
        );
      }
      
      if (region) {
        resources = resources.filter((resource: Resource) => 
          resource.region.toLowerCase().includes(region.toLowerCase())
        );
      }
      
      if (search) {
        resources = resources.filter((resource: Resource) => 
          resource.name.toLowerCase().includes(search.toLowerCase()) ||
          resource.provider.toLowerCase().includes(search.toLowerCase()) ||
          resource.topic.toLowerCase().includes(search.toLowerCase())
        );
      }
    }
    
    return NextResponse.json({ resources: resources || [] });
  } catch (error) {
    console.error('Error in resources API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}
