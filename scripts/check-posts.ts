import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🔍 Checking posts table...');
  
  // Validate database connection string
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ Database connection string is not set');
    process.exit(1);
  }
  
  // Create a new database connection pool
  console.log('🔍 Creating database connection pool');
  const pool = new Pool({
    connectionString,
  });
  
  try {
    // Check if posts table exists
    const tableResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'posts'
      );
    `);
    
    const postsTableExists = tableResult.rows[0].exists;
    console.log(`🔍 Posts table exists: ${postsTableExists}`);
    
    if (!postsTableExists) {
      console.log('🔍 Creating posts table...');
      
      // Create posts table
      await pool.query(`
        CREATE TABLE posts (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          content TEXT,
          image_url TEXT,
          post_type TEXT NOT NULL,
          style_id TEXT,
          tribe_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      console.log('✅ Posts table created successfully');
    } else {
      // Check if posts table has the required columns
      const columnsResult = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'posts';
      `);
      
      console.log('🔍 Posts table columns:');
      columnsResult.rows.forEach((col: any) => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });
      
      // Check if style_id column exists
      const styleIdExists = columnsResult.rows.some((col: any) => col.column_name === 'style_id');
      if (!styleIdExists) {
        console.log('🔍 Adding style_id column to posts table...');
        await pool.query(`ALTER TABLE posts ADD COLUMN style_id TEXT;`);
        console.log('✅ Added style_id column to posts table');
      }
      
      // Check if tribe_id column exists
      const tribeIdExists = columnsResult.rows.some((col: any) => col.column_name === 'tribe_id');
      if (!tribeIdExists) {
        console.log('🔍 Adding tribe_id column to posts table...');
        await pool.query(`ALTER TABLE posts ADD COLUMN tribe_id TEXT;`);
        console.log('✅ Added tribe_id column to posts table');
      }
    }
    
    // Check if users table exists
    const usersResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const usersTableExists = usersResult.rows[0].exists;
    console.log(`🔍 Users table exists: ${usersTableExists}`);
    
    if (!usersTableExists) {
      console.log('🔍 Creating users table...');
      
      // Create users table
      await pool.query(`
        CREATE TABLE users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          role TEXT DEFAULT 'USER',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      console.log('✅ Users table created successfully');
    }
    
    // Create sample posts
    console.log('🔍 Creating sample posts...');
    await createSamplePosts(pool);
    
    console.log('✅ Database check completed successfully');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

async function createSamplePosts(pool: Pool) {
  try {
    // Check if there are any posts
    const postsResult = await pool.query('SELECT COUNT(*) as count FROM posts');
    const postsCount = parseInt(postsResult.rows[0].count);
    
    if (postsCount > 0) {
      console.log(`🔍 Found ${postsCount} existing posts, skipping sample post creation`);
      return;
    }
    
    // Get all artists
    const artistsResult = await pool.query('SELECT COUNT(*) as count FROM artists');
    const artistsCount = parseInt(artistsResult.rows[0].count);
    
    if (artistsCount === 0) {
      console.log('🔍 No artists found, skipping sample post creation');
      return;
    }
    
    const artists = await pool.query('SELECT id, name, studio_id FROM artists');
    
    // Get all styles
    const stylesResult = await pool.query('SELECT id, name FROM styles');
    const styles = stylesResult.rows;
    
    if (styles.length === 0) {
      console.log('🔍 No styles found, skipping sample post creation');
      return;
    }
    
    // Get a system user or create one if it doesn't exist
    let systemUserId;
    const userResult = await pool.query('SELECT id FROM users WHERE name = $1', ['System']);
    
    if (userResult.rows.length === 0) {
      const newUserResult = await pool.query(
        'INSERT INTO users (id, name, email, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id',
        [`c${Math.random().toString(36).substring(2, 15)}`, 'System', 'system@ink2tattoo.com', 'ADMIN']
      );
      systemUserId = newUserResult.rows[0].id;
    } else {
      systemUserId = userResult.rows[0].id;
    }
    
    console.log(`🔍 Using system user ID: ${systemUserId}`);
    
    // Create sample posts for each artist
    for (const artist of artists.rows) {
      // Get the artist's styles
      const artistStylesResult = await pool.query(
        'SELECT style_id FROM artist_styles WHERE artist_id = $1',
        [artist.id]
      );
      
      const artistStyles = artistStylesResult.rows.map((row: any) => row.style_id);
      
      // If the artist has no styles, use a random one
      const styleId = artistStyles.length > 0 
        ? artistStyles[Math.floor(Math.random() * artistStyles.length)]
        : styles[Math.floor(Math.random() * styles.length)].id;
      
      // Create a gallery post
      const galleryPostId = `c${Math.random().toString(36).substring(2, 15)}`;
      await pool.query(
        `INSERT INTO posts (
          id, user_id, title, content, image_url, post_type, style_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          galleryPostId,
          systemUserId,
          `Latest work by ${artist.name}`,
          `Check out this amazing tattoo by ${artist.name}!`,
          `https://source.unsplash.com/random/800x600/?tattoo`,
          'gallery',
          styleId
        ]
      );
      
      console.log(`✅ Created gallery post for ${artist.name} with ID: ${galleryPostId}`);
      
      // Create a news post
      const newsPostId = `c${Math.random().toString(36).substring(2, 15)}`;
      await pool.query(
        `INSERT INTO posts (
          id, user_id, title, content, image_url, post_type, style_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          newsPostId,
          systemUserId,
          `${artist.name} joins our platform!`,
          `We're excited to welcome ${artist.name} to our community. They specialize in various tattoo styles and are ready to showcase their work.`,
          `https://source.unsplash.com/random/800x600/?artist`,
          'news',
          styleId
        ]
      );
      
      console.log(`✅ Created news post for ${artist.name} with ID: ${newsPostId}`);
    }
    
    console.log('✅ Sample posts created successfully');
  } catch (error) {
    console.error('❌ Error creating sample posts:', error);
  }
}

main().catch(console.error);
