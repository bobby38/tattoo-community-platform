// Test script to directly insert a record into the database
const { Pool } = require('pg');
require('dotenv').config();

// Initialize a direct PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testDatabaseInsert() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to database');
    
    // First, check the table structure
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
    
    // Generate a unique ID
    const postId = `test-post-${Date.now()}`;
    
    // Try inserting with hardcoded values
    console.log('\nAttempting to insert a test record...');
    const result = await client.query(
      `INSERT INTO posts (id, user_id, image_url, title) 
       VALUES ($1, 'system', '/uploads/test-image.jpg', 'Test Title') 
       RETURNING *`,
      [postId]
    );
    
    console.log('\nInsert successful!');
    console.log('Inserted record:', result.rows[0]);
    
    console.log('\nTest completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    client.release();
    pool.end();
  }
}

// Run the test
testDatabaseInsert().catch(console.error);
