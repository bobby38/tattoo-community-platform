import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { slugify } from '../src/lib/utils';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Paths to JSON data files
const STYLES_FILE = path.join(__dirname, '../tattoo_project/tattoo_styles.json');
const STUDIOS_ARTISTS_FILE = path.join(__dirname, '../tattoo_project/sea_studios_artists_part1.json');

// Import tattoo styles
async function importStyles() {
  console.log('Importing tattoo styles...');
  
  try {
    // Read styles data
    const stylesData = JSON.parse(fs.readFileSync(STYLES_FILE, 'utf8'));
    
    // Process each style
    for (const style of stylesData.styles) {
      const slug = slugify(style.name);
      
      // Check if style already exists
      const existingStyle = await pool.query(
        'SELECT id FROM styles WHERE slug = $1',
        [slug]
      );
      
      if (existingStyle.rows.length === 0) {
        // Create new style
        const result = await pool.query(
          'INSERT INTO styles (id, name, slug, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
          [generateId(), style.name, slug]
        );
        console.log(`Created style: ${style.name} with ID: ${result.rows[0].id}`);
      } else {
        console.log(`Style already exists: ${style.name}`);
      }
    }
    
    console.log('Styles import completed.');
  } catch (error) {
    console.error('Error importing styles:', error);
  }
}

// Import studios and artists
async function importStudiosAndArtists() {
  console.log('Importing studios and artists...');
  
  try {
    // Read studios and artists data
    const data = JSON.parse(fs.readFileSync(STUDIOS_ARTISTS_FILE, 'utf8'));
    
    // Process each studio
    for (const studioData of data.studios) {
      // Check if studio already exists
      const existingStudio = await pool.query(
        'SELECT id FROM studios WHERE name = $1 AND city = $2',
        [studioData.name, studioData.city || '']
      );
      
      let studioId;
      if (existingStudio.rows.length === 0) {
        // Create new studio
        const result = await pool.query(
          'INSERT INTO studios (id, name, address, city, lat, lng, website, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING id',
          [
            generateId(),
            studioData.name,
            studioData.address || null,
            studioData.city || null,
            studioData.lat || null,
            studioData.lng || null,
            studioData.website || null
          ]
        );
        studioId = result.rows[0].id;
        console.log(`Created studio: ${studioData.name} with ID: ${studioId}`);
      } else {
        studioId = existingStudio.rows[0].id;
        console.log(`Studio already exists: ${studioData.name}`);
      }
      
      // Store studio ID mapping for artist import
      studioIdMap[studioData.id] = studioId;
      
      // Process styles offered by the studio
      if (studioData.styles_offered && studioData.styles_offered.length > 0) {
        for (const styleName of studioData.styles_offered) {
          // Find style by name
          const style = await pool.query(
            'SELECT id FROM styles WHERE name ILIKE $1',
            [styleName]
          );
          
          if (style.rows.length > 0) {
            const styleId = style.rows[0].id;
            
            // Create tag for this style
            const tagName = `style:${slugify(styleName)}`;
            
            // Check if tag exists
            const existingTag = await pool.query(
              'SELECT id FROM tags WHERE name = $1',
              [tagName]
            );
            
            let tagId;
            if (existingTag.rows.length === 0) {
              const tagResult = await pool.query(
                'INSERT INTO tags (id, name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',
                [generateId(), tagName]
              );
              tagId = tagResult.rows[0].id;
            } else {
              tagId = existingTag.rows[0].id;
            }
            
            // Link tag to studio
            const existingStudioTag = await pool.query(
              'SELECT * FROM studio_tags WHERE studio_id = $1 AND tag_id = $2',
              [studioId, tagId]
            );
            
            if (existingStudioTag.rows.length === 0) {
              await pool.query(
                'INSERT INTO studio_tags (studio_id, tag_id) VALUES ($1, $2)',
                [studioId, tagId]
              );
            }
          }
        }
      }
    }
    
    // Process each artist
    for (const artistData of data.artists) {
      // Find associated studio ID from our mapping
      const studioId = studioIdMap[artistData.studio_id];
      
      if (!studioId) {
        console.log(`Studio not found for artist: ${artistData.name}`);
        continue;
      }
      
      // Check if artist already exists
      const existingArtist = await pool.query(
        'SELECT id FROM artists WHERE name = $1 AND studio_id = $2',
        [artistData.name, studioId]
      );
      
      let artistId;
      if (existingArtist.rows.length === 0) {
        // Create new artist
        const result = await pool.query(
          'INSERT INTO artists (id, name, bio, studio_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id',
          [
            generateId(),
            artistData.name,
            artistData.bio || null,
            studioId
          ]
        );
        artistId = result.rows[0].id;
        console.log(`Created artist: ${artistData.name} with ID: ${artistId}`);
        
        // Create contact info
        if (artistData.instagram || artistData.email || artistData.website || artistData.phone) {
          await pool.query(
            'INSERT INTO contact_info (id, artist_id, instagram, email, website, phone, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
            [
              generateId(),
              artistId,
              artistData.instagram || null,
              artistData.email || null,
              artistData.website || null,
              artistData.phone || null
            ]
          );
        }
      } else {
        artistId = existingArtist.rows[0].id;
        console.log(`Artist already exists: ${artistData.name}`);
      }
      
      // Process artist styles
      if (artistData.styles && artistData.styles.length > 0) {
        for (const styleName of artistData.styles) {
          // Find style by name
          const style = await pool.query(
            'SELECT id FROM styles WHERE name ILIKE $1',
            [styleName]
          );
          
          if (style.rows.length > 0) {
            const styleId = style.rows[0].id;
            
            // Link artist to style
            const existingArtistStyle = await pool.query(
              'SELECT * FROM artist_styles WHERE artist_id = $1 AND style_id = $2',
              [artistId, styleId]
            );
            
            if (existingArtistStyle.rows.length === 0) {
              await pool.query(
                'INSERT INTO artist_styles (artist_id, style_id, assigned_at) VALUES ($1, $2, NOW())',
                [artistId, styleId]
              );
            }
          }
        }
      }
    }
    
    console.log('Studios and artists import completed.');
  } catch (error) {
    console.error('Error importing studios and artists:', error);
  }
}

// Helper function to generate a CUID-like ID
function generateId(): string {
  return 'c' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Map to store studio ID mappings (original ID -> new ID)
const studioIdMap: Record<number, string> = {};

// Main function to run the import
async function main() {
  try {
    console.log('Starting data import...');
    
    // Import in the correct order to maintain relationships
    await importStyles();
    await importStudiosAndArtists();
    
    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await pool.end();
  }
}

// Run the import
main();
