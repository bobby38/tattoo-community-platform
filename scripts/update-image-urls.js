// Update image URLs in the database to use the custom domain
const { Pool } = require('pg');
require('dotenv').config();

async function updateImageUrls() {
  // Initialize PostgreSQL connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('Fetching images from database...');
    const result = await client.query(`
      SELECT id, image_url
      FROM posts
      WHERE image_url IS NOT NULL AND image_url LIKE '%r2.dev%'
    `);
    
    console.log(`Found ${result.rows.length} images with old R2 domain`);
    
    // Get the custom domain from environment
    const customDomain = process.env.R2_PUBLIC_URL || 'https://imagetat.getrezult.com';
    
    // Process each image URL
    for (const row of result.rows) {
      const oldUrl = row.image_url;
      
      // Extract the path from the old URL
      const urlParts = oldUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folderPath = urlParts.slice(3, -1).join('/');
      
      // Construct the new URL with the custom domain
      const newPath = folderPath ? `${folderPath}/${fileName}` : fileName;
      const newUrl = `${customDomain.endsWith('/') ? customDomain.slice(0, -1) : customDomain}/${newPath}`;
      
      console.log(`Updating image ID ${row.id}:`);
      console.log(`  Old URL: ${oldUrl}`);
      console.log(`  New URL: ${newUrl}`);
      
      // Update the database
      await client.query(
        'UPDATE posts SET image_url = $1 WHERE id = $2',
        [newUrl, row.id]
      );
    }
    
    console.log('Image URLs updated successfully!');
    client.release();
  } catch (error) {
    console.error('Error updating image URLs:', error);
  } finally {
    await pool.end();
  }
}

updateImageUrls().catch(console.error);
