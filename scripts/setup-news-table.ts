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

// Define NewsSource interface
interface NewsSource {
  name: string;
  url: string;
  rss_url: string | null;
  content_focus: string;
  update_frequency: string;
  notable_features: string;
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

// Function to create news_sources table
async function createNewsSourcesTable() {
  try {
    console.log('Creating news_sources table...');
    
    await pool.query(`
      CREATE TABLE news_sources (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        rss_url TEXT,
        content_focus TEXT NOT NULL,
        update_frequency TEXT NOT NULL,
        notable_features TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('News sources table created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating news_sources table:', error);
    return false;
  }
}

// Function to import news sources from JSON file
async function importNewsSourcesFromJson() {
  try {
    console.log('Importing news sources from JSON file...');
    
    // Read news sources from JSON file
    const filePath = path.join(process.cwd(), 'tattoo_project', 'tattoo_news_sources.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    const newsSources = jsonData.tattoo_news_sources;
    
    // Check if we have news sources to import
    if (!newsSources || newsSources.length === 0) {
      console.log('No news sources found in JSON file.');
      return false;
    }
    
    console.log(`Found ${newsSources.length} news sources in JSON file.`);
    
    // Import each news source
    for (const source of newsSources) {
      // Check if news source already exists
      const existingSource = await pool.query(
        'SELECT id FROM news_sources WHERE name = $1',
        [source.name]
      );
      
      if (existingSource.rows.length > 0) {
        console.log(`News source "${source.name}" already exists, skipping.`);
        continue;
      }
      
      // Insert news source
      await pool.query(`
        INSERT INTO news_sources (
          name, url, rss_url, content_focus, 
          update_frequency, notable_features
        ) VALUES (
          $1, $2, $3, $4, 
          $5, $6
        )
      `, [
        source.name,
        source.url,
        source.rss_url,
        source.content_focus,
        source.update_frequency,
        source.notable_features
      ]);
      
      console.log(`Imported news source: ${source.name}`);
    }
    
    console.log('News sources import completed successfully.');
    return true;
  } catch (error) {
    console.error('Error importing news sources:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting news sources setup...');
    
    // Check if news_sources table exists
    const tableExists = await newsSourcesTableExists();
    
    // Create table if it doesn't exist
    if (!tableExists) {
      const tableCreated = await createNewsSourcesTable();
      if (!tableCreated) {
        console.error('Failed to create news_sources table. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('News sources table already exists.');
    }
    
    // Import news sources
    await importNewsSourcesFromJson();
    
    console.log('News sources setup completed.');
  } catch (error) {
    console.error('Error in news sources setup:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
main().catch(console.error);
