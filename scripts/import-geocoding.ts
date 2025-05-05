/**
 * Import geocoding data from JSON files into the database
 * This script reads studio coordinates from the tattoo_project folder
 * and updates the studios table with the location data
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Path to the geocoding data file
const GEOCODING_FILE = path.join(__dirname, '../tattoo_project/geocoding/studio_coordinates_complete.json');
const STUDIOS_FILE = path.join(__dirname, '../tattoo_project/sea_studios_artists_part1.json');

interface StudioCoordinate {
  name: string;
  country: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
}

interface Studio {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string;
  lat?: number;
  lng?: number;
}

async function importGeocodingData() {
  try {
    console.log('Starting geocoding data import...');
    
    // Check if the studios table exists
    const tableExists = await checkTableExists('studios');
    if (!tableExists) {
      console.error('Studios table does not exist. Please run check-db.ts first.');
      return;
    }
    
    // Read the geocoding data
    const geocodingData: StudioCoordinate[] = JSON.parse(
      fs.readFileSync(GEOCODING_FILE, 'utf-8')
    );
    
    console.log(`Read ${geocodingData.length} studio coordinates from file.`);
    
    // Read the studios data to get IDs
    const studiosFile = fs.readFileSync(STUDIOS_FILE, 'utf-8');
    const studiosData = JSON.parse(studiosFile).studios as Studio[];
    
    console.log(`Read ${studiosData.length} studios from file.`);
    
    // Create a map of studio names to studio IDs
    const studioMap = new Map<string, number>();
    studiosData.forEach(studio => {
      studioMap.set(studio.name, studio.id);
    });
    
    // Update each studio with its coordinates
    let updatedCount = 0;
    
    for (const coordinate of geocodingData) {
      const studioId = studioMap.get(coordinate.name);
      
      if (!studioId) {
        console.log(`No matching studio found for: ${coordinate.name}`);
        continue;
      }
      
      try {
        // Update the studio with coordinates
        const result = await pool.query(
          `UPDATE studios 
           SET lat = $1, lng = $2, address = $3 
           WHERE id = $4`,
          [coordinate.lat, coordinate.lng, coordinate.address, studioId.toString()]
        );
        
        if (result.rowCount && result.rowCount > 0) {
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error updating studio ${coordinate.name}:`, error);
      }
    }
    
    console.log(`Updated ${updatedCount} studios with geocoding data.`);
    
  } catch (error) {
    console.error('Error importing geocoding data:', error);
  } finally {
    await pool.end();
  }
}

async function checkTableExists(tableName: string): Promise<boolean> {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )
  `, [tableName]);
  
  return result.rows[0].exists;
}

// Run the import function
importGeocodingData()
  .then(() => console.log('Geocoding data import completed.'))
  .catch(error => console.error('Import failed:', error));
