import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkAndCreateTables() {
  try {
    console.log('Checking database structure...');
    
    // Check if the styles table exists
    const stylesExists = await tableExists('styles');
    if (!stylesExists) {
      console.log('Creating styles table...');
      await pool.query(`
        CREATE TABLE styles (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      console.log('Styles table created.');
    } else {
      console.log('Styles table already exists.');
    }
    
    // Check if the tags table exists
    const tagsExists = await tableExists('tags');
    if (!tagsExists) {
      console.log('Creating tags table...');
      await pool.query(`
        CREATE TABLE tags (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      console.log('Tags table created.');
    } else {
      console.log('Tags table already exists.');
    }
    
    // Check if the studio_tags table exists
    const studioTagsExists = await tableExists('studio_tags');
    if (!studioTagsExists) {
      console.log('Creating studio_tags table...');
      await pool.query(`
        CREATE TABLE studio_tags (
          id TEXT PRIMARY KEY,
          studio_id TEXT NOT NULL,
          tag_id TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(studio_id, tag_id)
        )
      `);
      console.log('Studio tags table created.');
    } else {
      console.log('Studio tags table already exists.');
    }
    
    // Check if the artist_styles table exists
    const artistStylesExists = await tableExists('artist_styles');
    if (!artistStylesExists) {
      console.log('Creating artist_styles table...');
      await pool.query(`
        CREATE TABLE artist_styles (
          id TEXT PRIMARY KEY,
          artist_id TEXT NOT NULL,
          style_id TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(artist_id, style_id)
        )
      `);
      console.log('Artist styles table created.');
    } else {
      console.log('Artist styles table already exists.');
    }
    
    // Check if the contact_info table exists
    const contactInfoExists = await tableExists('contact_info');
    if (!contactInfoExists) {
      console.log('Creating contact_info table...');
      await pool.query(`
        CREATE TABLE contact_info (
          id TEXT PRIMARY KEY,
          studio_id TEXT,
          artist_id TEXT,
          phone TEXT,
          email TEXT,
          website TEXT,
          instagram TEXT,
          facebook TEXT,
          twitter TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          CHECK (studio_id IS NOT NULL OR artist_id IS NOT NULL)
        )
      `);
      console.log('Contact info table created.');
    } else {
      console.log('Contact info table already exists.');
    }
    
    // Check if the resources table exists
    const resourcesExists = await tableExists('resources');
    if (!resourcesExists) {
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
      console.log('Resources table created.');
    } else {
      console.log('Resources table already exists.');
    }
    
    // Check if the news_sources table exists
    const newsSourcesExists = await tableExists('news_sources');
    if (!newsSourcesExists) {
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
      console.log('News sources table created.');
    } else {
      console.log('News sources table already exists.');
    }
    
    console.log('Database structure check completed.');
  } catch (error) {
    console.error('Error checking database structure:', error);
  }
}

async function tableExists(tableName: string): Promise<boolean> {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )
  `, [tableName]);
  
  return result.rows[0].exists;
}

async function main() {
  try {
    await checkAndCreateTables();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

main();
