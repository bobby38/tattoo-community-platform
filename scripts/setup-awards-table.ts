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

// Define Award interface
interface Award {
  name: string;
  organizer: string;
  criteria: string;
  prestige_level: string;
  frequency: string;
  past_winners: string[];
}

// Define Notable Figure interface
interface NotableFigure {
  name: string;
  region: string;
  specialty: string;
  contributions: string;
  awards?: string[];
  image_url?: string;
}

// Helper function to check if awards table exists
async function awardsTableExists() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'awards'
      );
    `);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking if awards table exists:', error);
    return false;
  }
}

// Helper function to check if notable_figures table exists
async function notableFiguresTableExists() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'notable_figures'
      );
    `);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking if notable_figures table exists:', error);
    return false;
  }
}

// Function to create awards table
async function createAwardsTable() {
  try {
    console.log('Creating awards table...');
    
    await pool.query(`
      CREATE TABLE awards (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        organizer TEXT NOT NULL,
        criteria TEXT NOT NULL,
        prestige_level TEXT NOT NULL,
        frequency TEXT NOT NULL,
        past_winners TEXT[],
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Awards table created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating awards table:', error);
    return false;
  }
}

// Function to create notable_figures table
async function createNotableFiguresTable() {
  try {
    console.log('Creating notable_figures table...');
    
    await pool.query(`
      CREATE TABLE notable_figures (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        region TEXT NOT NULL,
        specialty TEXT NOT NULL,
        contributions TEXT NOT NULL,
        awards TEXT[],
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Notable figures table created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating notable_figures table:', error);
    return false;
  }
}

// Function to import awards from JSON file
async function importAwardsFromJson() {
  try {
    console.log('Importing awards from JSON file...');
    
    // Read awards from JSON file
    const filePath = path.join(process.cwd(), 'tattoo_project', 'tattoo_awards_figures.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    const awards = jsonData.awards;
    
    // Check if we have awards to import
    if (!awards || awards.length === 0) {
      console.log('No awards found in JSON file.');
      return false;
    }
    
    console.log(`Found ${awards.length} awards in JSON file.`);
    
    // Import each award
    for (const award of awards) {
      // Check if award already exists
      const existingAward = await pool.query(
        'SELECT id FROM awards WHERE name = $1',
        [award.name]
      );
      
      if (existingAward.rows.length > 0) {
        console.log(`Award "${award.name}" already exists, skipping.`);
        continue;
      }
      
      // Insert award
      await pool.query(`
        INSERT INTO awards (
          name, organizer, criteria, prestige_level, 
          frequency, past_winners
        ) VALUES (
          $1, $2, $3, $4, 
          $5, $6
        )
      `, [
        award.name,
        award.organizer,
        award.criteria,
        award.prestige_level,
        award.frequency,
        award.past_winners || []
      ]);
      
      console.log(`Imported award: ${award.name}`);
    }
    
    console.log('Awards import completed successfully.');
    return true;
  } catch (error) {
    console.error('Error importing awards:', error);
    return false;
  }
}

// Function to import notable figures from JSON file
async function importNotableFiguresFromJson() {
  try {
    console.log('Importing notable figures from JSON file...');
    
    // Read notable figures from JSON file
    const filePath = path.join(process.cwd(), 'tattoo_project', 'tattoo_awards_figures.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    const notableFigures = jsonData.notable_figures;
    
    // Check if we have notable figures to import
    if (!notableFigures || notableFigures.length === 0) {
      console.log('No notable figures found in JSON file.');
      return false;
    }
    
    console.log(`Found ${notableFigures.length} notable figures in JSON file.`);
    
    // Import each notable figure
    for (const figure of notableFigures) {
      // Check if figure already exists
      const existingFigure = await pool.query(
        'SELECT id FROM notable_figures WHERE name = $1',
        [figure.name]
      );
      
      if (existingFigure.rows.length > 0) {
        console.log(`Notable figure "${figure.name}" already exists, skipping.`);
        continue;
      }
      
      // Insert notable figure
      await pool.query(`
        INSERT INTO notable_figures (
          name, region, specialty, contributions, awards
        ) VALUES (
          $1, $2, $3, $4, $5
        )
      `, [
        figure.name,
        figure.region,
        figure.specialty,
        figure.contributions,
        figure.awards || []
      ]);
      
      console.log(`Imported notable figure: ${figure.name}`);
    }
    
    console.log('Notable figures import completed successfully.');
    return true;
  } catch (error) {
    console.error('Error importing notable figures:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting awards and notable figures setup...');
    
    // Check if awards table exists
    const awardsExists = await awardsTableExists();
    
    // Create awards table if it doesn't exist
    if (!awardsExists) {
      const tableCreated = await createAwardsTable();
      if (!tableCreated) {
        console.error('Failed to create awards table. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('Awards table already exists.');
    }
    
    // Check if notable_figures table exists
    const notableFiguresExists = await notableFiguresTableExists();
    
    // Create notable_figures table if it doesn't exist
    if (!notableFiguresExists) {
      const tableCreated = await createNotableFiguresTable();
      if (!tableCreated) {
        console.error('Failed to create notable_figures table. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('Notable figures table already exists.');
    }
    
    // Import awards
    await importAwardsFromJson();
    
    // Import notable figures
    await importNotableFiguresFromJson();
    
    console.log('Awards and notable figures setup completed.');
  } catch (error) {
    console.error('Error in awards and notable figures setup:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
main().catch(console.error);
