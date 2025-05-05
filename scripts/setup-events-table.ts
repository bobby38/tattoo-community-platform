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

// Define Event interface
interface Event {
  id: number;
  name: string;
  country: string;
  city: string;
  venue: string;
  address: string;
  lat: number;
  lng: number;
  start_date: string;
  end_date: string;
  website: string;
  ticket_price: number | null;
  currency: string;
  featured_artists: string[];
  description: string;
  social: {
    instagram: string | null;
    facebook: string | null;
    twitter: string | null;
  };
  image_url?: string;
}

// Helper function to check if events table exists
async function eventsTableExists() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'events'
      );
    `);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking if events table exists:', error);
    return false;
  }
}

// Function to create events table
async function createEventsTable() {
  try {
    console.log('Creating events table...');
    
    await pool.query(`
      CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        city TEXT NOT NULL,
        venue TEXT NOT NULL,
        address TEXT NOT NULL,
        lat NUMERIC NOT NULL,
        lng NUMERIC NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        website TEXT,
        ticket_price NUMERIC,
        currency TEXT,
        featured_artists TEXT[],
        description TEXT,
        social JSONB,
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Events table created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating events table:', error);
    return false;
  }
}

// Function to import events from JSON file
async function importEventsFromJson() {
  try {
    console.log('Importing events from JSON file...');
    
    // Read events from JSON file
    const filePath = path.join(process.cwd(), 'tattoo_project', 'sea_events.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    const events = jsonData.events;
    
    // Check if we have events to import
    if (!events || events.length === 0) {
      console.log('No events found in JSON file.');
      return false;
    }
    
    console.log(`Found ${events.length} events in JSON file.`);
    
    // Import each event
    for (const event of events) {
      // Check if event already exists
      const existingEvent = await pool.query(
        'SELECT id FROM events WHERE name = $1 AND start_date = $2',
        [event.name, event.start_date]
      );
      
      if (existingEvent.rows.length > 0) {
        console.log(`Event "${event.name}" already exists, skipping.`);
        continue;
      }
      
      // Insert event
      await pool.query(`
        INSERT INTO events (
          name, country, city, venue, address, lat, lng, 
          start_date, end_date, website, ticket_price, 
          currency, featured_artists, description, social, image_url
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, 
          $8, $9, $10, $11, 
          $12, $13, $14, $15, $16
        )
      `, [
        event.name,
        event.country,
        event.city,
        event.venue,
        event.address,
        event.lat,
        event.lng,
        event.start_date,
        event.end_date,
        event.website,
        event.ticket_price,
        event.currency,
        event.featured_artists || [],
        event.description,
        JSON.stringify(event.social),
        event.image_url || null
      ]);
      
      console.log(`Imported event: ${event.name}`);
    }
    
    console.log('Events import completed successfully.');
    return true;
  } catch (error) {
    console.error('Error importing events:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting events setup...');
    
    // Check if events table exists
    const tableExists = await eventsTableExists();
    
    // Create table if it doesn't exist
    if (!tableExists) {
      const tableCreated = await createEventsTable();
      if (!tableCreated) {
        console.error('Failed to create events table. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('Events table already exists.');
    }
    
    // Import events
    await importEventsFromJson();
    
    console.log('Events setup completed.');
  } catch (error) {
    console.error('Error in events setup:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
main().catch(console.error);
