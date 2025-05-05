import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🔍 Creating sample posts...');
  
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
    // First, clear existing posts to avoid duplicates
    console.log('🔍 Clearing existing posts...');
    await pool.query('DELETE FROM posts');
    console.log('✅ Existing posts cleared');
    
    // Get all artists
    const artistsResult = await pool.query('SELECT id, name, studio_id FROM artists');
    const artists = artistsResult.rows;
    
    if (artists.length === 0) {
      console.log('❌ No artists found. Please run the import-sql script first.');
      process.exit(1);
    }
    
    console.log(`🔍 Found ${artists.length} artists`);
    
    // Get all styles
    const stylesResult = await pool.query('SELECT id, name, slug FROM styles');
    const styles = stylesResult.rows;
    
    if (styles.length === 0) {
      console.log('❌ No styles found. Please run the import-sql script first.');
      process.exit(1);
    }
    
    console.log(`🔍 Found ${styles.length} styles`);
    
    // Get all studios
    const studiosResult = await pool.query('SELECT id, name FROM studios');
    const studios = studiosResult.rows;
    
    if (studios.length === 0) {
      console.log('❌ No studios found. Please run the import-sql script first.');
      process.exit(1);
    }
    
    console.log(`🔍 Found ${studios.length} studios`);
    
    // Get a system user or create one if it doesn't exist
    let systemUserId;
    const userResult = await pool.query('SELECT id FROM users WHERE name = $1', ['System']);
    
    if (userResult.rows.length === 0) {
      const newUserResult = await pool.query(
        'INSERT INTO users (id, name, email, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id',
        [uuidv4(), 'System', 'system@ink2tattoo.com', 'ADMIN']
      );
      systemUserId = newUserResult.rows[0].id;
    } else {
      systemUserId = userResult.rows[0].id;
    }
    
    console.log(`🔍 Using system user ID: ${systemUserId}`);
    
    // Create sample posts for each artist
    for (const artist of artists) {
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
      
      // Get style details
      const styleResult = await pool.query('SELECT name FROM styles WHERE id = $1', [styleId]);
      const styleName = styleResult.rows[0]?.name || 'Unknown Style';
      
      // Create a gallery post
      const galleryPostId = uuidv4();
      await pool.query(
        `INSERT INTO posts (
          id, user_id, title, content, image_url, post_type, related_style_id, created_at, updated_at, likes_count, comments_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9)`,
        [
          galleryPostId,
          systemUserId,
          `${styleName} tattoo by ${artist.name}`,
          `Check out this amazing ${styleName} tattoo by ${artist.name}!`,
          `https://source.unsplash.com/random/800x600/?tattoo,${styleName.replace(/\s+/g, '')}`,
          'gallery',
          styleId,
          Math.floor(Math.random() * 50),
          Math.floor(Math.random() * 10)
        ]
      );
      
      console.log(`✅ Created gallery post for ${artist.name} with ID: ${galleryPostId}`);
      
      // Create a news post
      const newsPostId = uuidv4();
      await pool.query(
        `INSERT INTO posts (
          id, user_id, title, content, image_url, post_type, related_style_id, created_at, updated_at, likes_count, comments_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9)`,
        [
          newsPostId,
          systemUserId,
          `${artist.name} joins our platform!`,
          `We're excited to welcome ${artist.name} to our community. They specialize in ${styleName} tattoos and are ready to showcase their work.`,
          `https://source.unsplash.com/random/800x600/?artist,tattoo`,
          'news',
          styleId,
          Math.floor(Math.random() * 30),
          Math.floor(Math.random() * 5)
        ]
      );
      
      console.log(`✅ Created news post for ${artist.name} with ID: ${newsPostId}`);
      
      // Create a spotlight post for some artists
      if (Math.random() > 0.5) {
        const spotlightPostId = uuidv4();
        await pool.query(
          `INSERT INTO posts (
            id, user_id, title, content, image_url, post_type, related_style_id, created_at, updated_at, likes_count, comments_count
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9)`,
          [
            spotlightPostId,
            systemUserId,
            `Artist Spotlight: ${artist.name}`,
            `This week's spotlight is on ${artist.name}, a talented artist specializing in ${styleName} tattoos. Check out their portfolio and book a session today!`,
            `https://source.unsplash.com/random/800x600/?portrait,artist`,
            'spotlight',
            styleId,
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 20)
          ]
        );
        
        console.log(`✅ Created spotlight post for ${artist.name} with ID: ${spotlightPostId}`);
      }
    }
    
    // Create some style-focused posts
    for (const style of styles) {
      const stylePostId = uuidv4();
      await pool.query(
        `INSERT INTO posts (
          id, user_id, title, content, image_url, post_type, related_style_id, created_at, updated_at, likes_count, comments_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9)`,
        [
          stylePostId,
          systemUserId,
          `Exploring ${style.name} Tattoos`,
          `${style.name} tattoos are known for their unique characteristics and rich history. In this post, we explore the origins and techniques of this popular style.`,
          `https://source.unsplash.com/random/800x600/?tattoo,${style.name.replace(/\s+/g, '')}`,
          'discussion',
          style.id,
          Math.floor(Math.random() * 80),
          Math.floor(Math.random() * 15)
        ]
      );
      
      console.log(`✅ Created style post for ${style.name} with ID: ${stylePostId}`);
    }
    
    // Create some studio-focused posts
    for (const studio of studios) {
      const studioPostId = uuidv4();
      
      // Get a random style for this studio
      const studioStyleResult = await pool.query(`
        SELECT s.id FROM styles s
        JOIN artist_styles as2 ON s.id = as2.style_id
        JOIN artists a ON as2.artist_id = a.id
        WHERE a.studio_id = $1
        LIMIT 1
      `, [studio.id]);
      
      const studioStyleId = studioStyleResult.rows.length > 0
        ? studioStyleResult.rows[0].id
        : styles[Math.floor(Math.random() * styles.length)].id;
      
      await pool.query(
        `INSERT INTO posts (
          id, user_id, title, content, image_url, post_type, related_style_id, created_at, updated_at, likes_count, comments_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9)`,
        [
          studioPostId,
          systemUserId,
          `Featured Studio: ${studio.name}`,
          `${studio.name} is one of our premier tattoo studios. They offer a wide range of styles and have a team of talented artists ready to bring your tattoo ideas to life.`,
          `https://source.unsplash.com/random/800x600/?tattoo,studio`,
          'news',
          studioStyleId,
          Math.floor(Math.random() * 60),
          Math.floor(Math.random() * 12)
        ]
      );
      
      console.log(`✅ Created studio post for ${studio.name} with ID: ${studioPostId}`);
    }
    
    // Create some event posts
    const eventTypes = ['Convention', 'Workshop', 'Guest Artist', 'Flash Day', 'Charity Event'];
    
    for (let i = 0; i < 5; i++) {
      const eventPostId = uuidv4();
      const eventType = eventTypes[i];
      const randomStudio = studios[Math.floor(Math.random() * studios.length)];
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      
      await pool.query(
        `INSERT INTO posts (
          id, user_id, title, content, image_url, post_type, related_style_id, created_at, updated_at, likes_count, comments_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9)`,
        [
          eventPostId,
          systemUserId,
          `Upcoming ${eventType}: ${randomStyle.name} at ${randomStudio.name}`,
          `Join us for an exciting ${eventType.toLowerCase()} featuring ${randomStyle.name} tattoos at ${randomStudio.name}. Don't miss this opportunity to get inked by talented artists!`,
          `https://source.unsplash.com/random/800x600/?event,tattoo`,
          'event',
          randomStyle.id,
          Math.floor(Math.random() * 40),
          Math.floor(Math.random() * 8)
        ]
      );
      
      console.log(`✅ Created event post: ${eventType} with ID: ${eventPostId}`);
    }
    
    console.log('✅ Sample posts created successfully');
    
    // Count the total number of posts created
    const countResult = await pool.query('SELECT COUNT(*) FROM posts');
    console.log(`✅ Total posts created: ${countResult.rows[0].count}`);
  } catch (error) {
    console.error('❌ Error creating sample posts:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
