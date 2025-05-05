import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { getHybridImageUrl } from '@/lib/hybrid-image';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define event type
export interface Event {
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

// Helper function to get events from the database
async function getEventsFromDatabase() {
  try {
    const tableExists = await eventsTableExists();
    
    if (!tableExists) {
      return null;
    }
    
    const result = await pool.query('SELECT * FROM events ORDER BY start_date ASC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching events from database:', error);
    return null;
  }
}

// Helper function to get events from the JSON file
function getEventsFromJson() {
  try {
    const filePath = path.join(process.cwd(), 'tattoo_project', 'sea_events_updated.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    return jsonData.events;
  } catch (error) {
    console.error('Error reading events from JSON file:', error);
    return [];
  }
}

// GET handler for events
export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const country = url.searchParams.get('country');
    const city = url.searchParams.get('city');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    // Try to get events from database first
    let events = await getEventsFromDatabase();
    
    // Fall back to JSON file if database doesn't have events
    if (!events || events.length === 0) {
      console.log('No events found in database, falling back to JSON file');
      events = getEventsFromJson();
    }
    
    // Apply filters if provided
    if (events && events.length > 0) {
      if (country) {
        events = events.filter((event: Event) => 
          event.country.toLowerCase() === country.toLowerCase()
        );
      }
      
      if (city) {
        events = events.filter((event: Event) => 
          event.city.toLowerCase() === city.toLowerCase()
        );
      }
      
      if (startDate) {
        const startDateObj = new Date(startDate);
        events = events.filter((event: Event) => 
          new Date(event.start_date) >= startDateObj
        );
      }
      
      if (endDate) {
        const endDateObj = new Date(endDate);
        events = events.filter((event: Event) => 
          new Date(event.end_date) <= endDateObj
        );
      }
    }
    
    // Process events to ensure all properties are properly formatted
    const processedEvents = events ? events.map((event: any) => {
      // Ensure featured_artists is an array
      if (typeof event.featured_artists === 'string') {
        try {
          event.featured_artists = JSON.parse(event.featured_artists);
        } catch (e) {
          event.featured_artists = event.featured_artists.split(',').map((artist: string) => artist.trim());
        }
      } else if (!Array.isArray(event.featured_artists)) {
        event.featured_artists = [];
      }
      
      // Ensure social is an object
      if (typeof event.social === 'string') {
        try {
          event.social = JSON.parse(event.social);
        } catch (e) {
          event.social = {
            instagram: null,
            facebook: null,
            twitter: null
          };
        }
      } else if (!event.social) {
        event.social = {
          instagram: null,
          facebook: null,
          twitter: null
        };
      }
      
      // Add image URL if not present
      if (!event.image_url) {
        event.image_url = `/images/events/event-${event.id % 5 + 1}.jpg`;
      }
      
      return event;
    }) : [];
    
    return NextResponse.json({ events: processedEvents });
  } catch (error) {
    console.error('Error in events API:', error);
    
    // Return fallback data from JSON file in case of error
    const fallbackEvents = getEventsFromJson();
    return NextResponse.json({ events: fallbackEvents });
  }
}
