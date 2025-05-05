// Test script to verify gallery functionality
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize a direct PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test configuration
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');
const TEST_IMAGE_PATH = path.join(__dirname, 'public', 'placeholder.jpg');

async function testGalleryFunctionality() {
  const client = await pool.connect();
  
  try {
    console.log('=== GALLERY FUNCTIONALITY TEST ===');
    console.log('Connected to database');
    
    // 1. Test database structure
    console.log('\n1. Checking database structure...');
    const tableInfo = await client.query(`
      SELECT column_name, is_nullable, column_default, data_type
      FROM information_schema.columns 
      WHERE table_name = 'posts'
      ORDER BY ordinal_position
    `);
    
    console.log('Posts table structure:');
    tableInfo.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : ''} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });
    
    // 2. Test file system access
    console.log('\n2. Testing file system access...');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      console.log(`Created uploads directory: ${UPLOADS_DIR}`);
    } else {
      console.log(`Uploads directory exists: ${UPLOADS_DIR}`);
    }
    
    // Check if we can write to the directory
    const testFilePath = path.join(UPLOADS_DIR, 'test-file.txt');
    try {
      fs.writeFileSync(testFilePath, 'Test content');
      console.log(`Successfully wrote test file to: ${testFilePath}`);
      
      // Clean up test file
      fs.unlinkSync(testFilePath);
      console.log('Successfully deleted test file');
    } catch (error) {
      console.error('Error writing to uploads directory:', error);
    }
    
    // 3. Test database insertion
    console.log('\n3. Testing database insertion...');
    
    // Generate a unique ID
    const postId = `test-post-${Date.now()}`;
    
    // Try inserting with all required fields
    try {
      const result = await client.query(
        `INSERT INTO posts (id, user_id, image_url, title, content, post_type) 
         VALUES ($1, 'system', '/uploads/gallery/test-image.jpg', 'Test Gallery Image', 'Test content for gallery image', 'gallery') 
         RETURNING *`,
        [postId]
      );
      
      console.log('Insert successful!');
      console.log('Inserted record ID:', result.rows[0].id);
      
      // Clean up test record
      await client.query('DELETE FROM posts WHERE id = $1', [postId]);
      console.log('Successfully deleted test record');
    } catch (error) {
      console.error('Error inserting test record:', error);
    }
    
    // 4. Test query performance
    console.log('\n4. Testing query performance...');
    
    console.time('Gallery query');
    const galleryResult = await client.query(
      'SELECT * FROM posts WHERE image_url IS NOT NULL AND post_type = $1 ORDER BY created_at DESC LIMIT 10',
      ['gallery']
    );
    console.timeEnd('Gallery query');
    
    console.log(`Found ${galleryResult.rows.length} gallery images`);
    
    console.log('\nTest completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    client.release();
    pool.end();
  }
}

// Run the test
testGalleryFunctionality().catch(console.error);
