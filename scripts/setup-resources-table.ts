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

// Define Resource interface
interface Resource {
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

// Function to create resources table
async function createResourcesTable() {
  try {
    console.log('Creating resources table...');
    
    await pool.query(`
      CREATE TABLE resources (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        format TEXT NOT NULL,
        topic TEXT NOT NULL,
        cost TEXT NOT NULL,
        duration TEXT NOT NULL,
        availability TEXT NOT NULL,
        features TEXT NOT NULL,
        region TEXT NOT NULL,
        url TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Resources table created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating resources table:', error);
    return false;
  }
}

// Function to import resources from JSON file
async function importResourcesFromJson() {
  try {
    console.log('Importing resources from JSON file...');
    
    // Read resources from JSON file
    const filePath = path.join(process.cwd(), 'tattoo_project', 'tattoo_education.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    const resources = jsonData.tattoo_educational_resources;
    
    // Check if we have resources to import
    if (!resources || resources.length === 0) {
      console.log('No resources found in JSON file.');
      return false;
    }
    
    console.log(`Found ${resources.length} resources in JSON file.`);
    
    // Import each resource
    for (const resource of resources) {
      // Check if resource already exists
      const existingResource = await pool.query(
        'SELECT id FROM resources WHERE name = $1 AND provider = $2',
        [resource.name, resource.provider]
      );
      
      if (existingResource.rows.length > 0) {
        console.log(`Resource "${resource.name}" by ${resource.provider} already exists, skipping.`);
        continue;
      }
      
      // Insert resource
      await pool.query(`
        INSERT INTO resources (
          name, provider, format, topic, cost, 
          duration, availability, features, region, url
        ) VALUES (
          $1, $2, $3, $4, $5, 
          $6, $7, $8, $9, $10
        )
      `, [
        resource.name,
        resource.provider,
        resource.format,
        resource.topic,
        resource.cost,
        resource.duration,
        resource.availability,
        resource.features,
        resource.region,
        resource.url
      ]);
      
      console.log(`Imported resource: ${resource.name}`);
    }
    
    console.log('Resources import completed successfully.');
    return true;
  } catch (error) {
    console.error('Error importing resources:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting resources setup...');
    
    // Check if resources table exists
    const tableExists = await resourcesTableExists();
    
    // Create table if it doesn't exist
    if (!tableExists) {
      const tableCreated = await createResourcesTable();
      if (!tableCreated) {
        console.error('Failed to create resources table. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('Resources table already exists.');
    }
    
    // Import resources
    await importResourcesFromJson();
    
    console.log('Resources setup completed.');
  } catch (error) {
    console.error('Error in resources setup:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
main().catch(console.error);
