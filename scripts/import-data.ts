import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { slugify } from '../src/lib/utils';

const prisma = new PrismaClient();

// Paths to JSON data files
const STYLES_FILE = path.join(__dirname, '../tattoo_project/tattoo_styles.json');
const STUDIOS_ARTISTS_FILE = path.join(__dirname, '../tattoo_project/sea_studios_artists_part1.json');

// Helper function to create a slug from a name
function createSlug(name: string): string {
  return slugify(name);
}

// Import tattoo styles
async function importStyles() {
  console.log('Importing tattoo styles...');
  
  try {
    // Read styles data
    const stylesData = JSON.parse(fs.readFileSync(STYLES_FILE, 'utf8'));
    
    // Process each style
    for (const style of stylesData.styles) {
      const slug = createSlug(style.name);
      
      // Check if style already exists
      const existingStyle = await prisma.style.findUnique({
        where: { slug }
      });
      
      if (!existingStyle) {
        // Create new style
        await prisma.style.create({
          data: {
            name: style.name,
            slug
          }
        });
        console.log(`Created style: ${style.name}`);
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
      const existingStudio = await prisma.studio.findFirst({
        where: { 
          name: studioData.name,
          city: studioData.city
        }
      });
      
      let studio;
      if (!existingStudio) {
        // Create new studio
        studio = await prisma.studio.create({
          data: {
            name: studioData.name,
            address: studioData.address,
            city: studioData.city,
            lat: studioData.lat ? parseFloat(studioData.lat.toString()) : null,
            lng: studioData.lng ? parseFloat(studioData.lng.toString()) : null,
            website: studioData.website
          }
        });
        console.log(`Created studio: ${studioData.name}`);
      } else {
        studio = existingStudio;
        console.log(`Studio already exists: ${studioData.name}`);
      }
      
      // Process styles offered by the studio
      if (studioData.styles_offered && studioData.styles_offered.length > 0) {
        for (const styleName of studioData.styles_offered) {
          // Find style by name
          const style = await prisma.style.findFirst({
            where: { name: { equals: styleName, mode: 'insensitive' } }
          });
          
          if (style) {
            // Create tag for this style
            const tagName = `style:${createSlug(styleName)}`;
            
            // Check if tag exists
            let tag = await prisma.tag.findUnique({
              where: { name: tagName }
            });
            
            if (!tag) {
              tag = await prisma.tag.create({
                data: { name: tagName }
              });
            }
            
            // Link tag to studio
            const existingStudioTag = await prisma.studioTag.findUnique({
              where: {
                studioId_tagId: {
                  studioId: studio.id,
                  tagId: tag.id
                }
              }
            });
            
            if (!existingStudioTag) {
              await prisma.studioTag.create({
                data: {
                  studioId: studio.id,
                  tagId: tag.id
                }
              });
            }
          }
        }
      }
    }
    
    // Process each artist
    for (const artistData of data.artists) {
      // Find associated studio
      const studio = await prisma.studio.findFirst({
        where: { 
          name: { 
            equals: data.studios.find((s: { id: number }) => s.id === artistData.studio_id)?.name || '', 
            mode: 'insensitive' 
          }
        }
      });
      
      if (!studio) {
        console.log(`Studio not found for artist: ${artistData.name}`);
        continue;
      }
      
      // Check if artist already exists
      const existingArtist = await prisma.artist.findFirst({
        where: { 
          name: artistData.name,
          studioId: studio.id
        }
      });
      
      let artist;
      if (!existingArtist) {
        // Create new artist
        artist = await prisma.artist.create({
          data: {
            name: artistData.name,
            bio: artistData.bio || null,
            studioId: studio.id
          }
        });
        console.log(`Created artist: ${artistData.name}`);
        
        // Create contact info
        if (artistData.instagram || artistData.email || artistData.website) {
          await prisma.contactInfo.create({
            data: {
              artistId: artist.id,
              instagram: artistData.instagram || null,
              email: artistData.email || null,
              website: artistData.website || null,
              phone: artistData.phone || null
            }
          });
        }
      } else {
        artist = existingArtist;
        console.log(`Artist already exists: ${artistData.name}`);
      }
      
      // Process artist styles
      if (artistData.styles && artistData.styles.length > 0) {
        for (const styleName of artistData.styles) {
          // Find style by name
          const style = await prisma.style.findFirst({
            where: { name: { equals: styleName, mode: 'insensitive' } }
          });
          
          if (style) {
            // Link artist to style
            const existingArtistStyle = await prisma.artistStyle.findUnique({
              where: {
                artistId_styleId: {
                  artistId: artist.id,
                  styleId: style.id
                }
              }
            });
            
            if (!existingArtistStyle) {
              await prisma.artistStyle.create({
                data: {
                  artistId: artist.id,
                  styleId: style.id
                }
              });
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
    await prisma.$disconnect();
  }
}

// Run the import
main();
