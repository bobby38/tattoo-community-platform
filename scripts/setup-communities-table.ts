import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define Community interface
interface Community {
  name: string;
  platform: string;
  url: string;
  member_count: number | string;
  focus_theme: string;
  activity_level: string;
  notable_features: string;
  image_url?: string;
}

// Helper function to check if communities table exists
async function communitiesTableExists() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'communities'
      );
    `);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking if communities table exists:', error);
    return false;
  }
}

// Helper function to parse member count
function parseMemberCount(count: string | number): number {
  if (typeof count === 'number') {
    return count;
  }
  
  if (count === 'N/A') {
    return 0;
  }
  
  // Remove commas and '+' sign
  const cleanCount = count.replace(/,|\+/g, '');
  
  // Parse as integer
  return parseInt(cleanCount, 10) || 0;
}

// Function to create communities table
async function createCommunitiesTable() {
  try {
    console.log('Creating communities table...');
    
    await pool.query(`
      CREATE TABLE communities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        member_count INTEGER NOT NULL,
        focus_theme TEXT NOT NULL,
        activity_level TEXT NOT NULL,
        notable_features TEXT,
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Communities table created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating communities table:', error);
    return false;
  }
}

// Function to import communities from JSON file
async function importCommunitiesFromJson() {
  try {
    console.log('Importing communities from JSON file...');
    
    // Read communities from JSON file
    const filePath = path.join(process.cwd(), 'tattoo_project', 'tattoo_communities.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    const communities = jsonData.tattoo_communities;
    
    // Check if we have communities to import
    if (!communities || communities.length === 0) {
      console.log('No communities found in JSON file.');
      return false;
    }
    
    console.log(`Found ${communities.length} communities in JSON file.`);
    
    // Import each community
    for (const community of communities) {
      // Check if community already exists
      const existingCommunity = await pool.query(
        'SELECT id FROM communities WHERE name = $1 AND platform = $2',
        [community.name, community.platform]
      );
      
      if (existingCommunity.rows.length > 0) {
        console.log(`Community "${community.name}" on ${community.platform} already exists, skipping.`);
        continue;
      }
      
      // Insert community
      await pool.query(`
        INSERT INTO communities (
          name, platform, url, member_count, 
          focus_theme, activity_level, notable_features, image_url
        ) VALUES (
          $1, $2, $3, $4, 
          $5, $6, $7, $8
        )
      `, [
        community.name,
        community.platform,
        community.url,
        parseMemberCount(community.member_count),
        community.focus_theme,
        community.activity_level,
        community.notable_features || null,
        community.image_url || null
      ]);
      
      console.log(`Imported community: ${community.name} (${community.platform})`);
    }
    
    console.log('Communities import completed successfully.');
    return true;
  } catch (error) {
    console.error('Error importing communities:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting communities setup...');
    
    // Check if communities table exists
    const tableExists = await communitiesTableExists();
    
    // Create table if it doesn't exist
    if (!tableExists) {
      const tableCreated = await createCommunitiesTable();
      if (!tableCreated) {
        console.error('Failed to create communities table. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('Communities table already exists.');
    }
    
    // Import communities
    await importCommunitiesFromJson();
    
    console.log('Communities setup completed.');
  } catch (error) {
    console.error('Error in communities setup:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
main().catch(console.error);
