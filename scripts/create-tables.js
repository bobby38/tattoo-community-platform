// scripts/create-tables.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client with your project URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createStylesTable() {
  console.log('Creating styles table...');
  
  const { error } = await supabase.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS styles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  });
  
  if (error) {
    console.error('Error creating styles table:', error);
    return false;
  }
  
  console.log('Styles table created successfully');
  return true;
}

async function createTribesTable() {
  console.log('Creating tribes table...');
  
  const { error } = await supabase.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS tribes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        icon_url TEXT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  });
  
  if (error) {
    console.error('Error creating tribes table:', error);
    return false;
  }
  
  console.log('Tribes table created successfully');
  return true;
}

async function seedStylesTable() {
  console.log('Seeding styles table...');
  
  const stylesData = [
    { id: 'style_1', name: 'Traditional (Old School)', slug: 'traditional-old-school' }, 
    { id: 'style_2', name: 'Realism', slug: 'realism' },
    { id: 'style_3', name: 'Watercolor', slug: 'watercolor' }, 
    { id: 'style_4', name: 'Tribal', slug: 'tribal' }, 
    { id: 'style_5', name: 'New School', slug: 'new-school' }, 
    { id: 'style_6', name: 'Neo Traditional', slug: 'neo-traditional' },
    { id: 'style_7', name: 'Japanese (Irezumi)', slug: 'japanese-irezumi' },
    { id: 'style_8', name: 'Blackwork', slug: 'blackwork' }, 
    { id: 'style_9', name: 'Illustrative', slug: 'illustrative' }, 
    { id: 'style_10', name: 'Geometric', slug: 'geometric' },
  ];
  
  const { error } = await supabase.from('styles').upsert(stylesData);
  
  if (error) {
    console.error('Error seeding styles table:', error);
    return false;
  }
  
  console.log('Styles table seeded successfully');
  return true;
}

async function seedTribesTable() {
  console.log('Seeding tribes table...');
  
  const tribesData = [
    { id: 'tribe_1', name: 'Polynesian', slug: 'polynesian', icon_url: '/icons/tribes/polynesian.svg' },
    { id: 'tribe_2', name: 'Japanese Style Fans', slug: 'japanese-style-fans', icon_url: '/icons/tribes/japanese.svg' }, 
    { id: 'tribe_3', name: 'Blackwork Enthusiasts', slug: 'blackwork-enthusiasts', icon_url: '/icons/tribes/blackwork.svg' },
  ];
  
  const { error } = await supabase.from('tribes').upsert(tribesData);
  
  if (error) {
    console.error('Error seeding tribes table:', error);
    return false;
  }
  
  console.log('Tribes table seeded successfully');
  return true;
}

async function main() {
  console.log('Starting database setup...');
  
  // Create tables
  const stylesTableCreated = await createStylesTable();
  const tribesTableCreated = await createTribesTable();
  
  // Seed tables if they were created successfully
  if (stylesTableCreated) {
    await seedStylesTable();
  }
  
  if (tribesTableCreated) {
    await seedTribesTable();
  }
  
  console.log('Database setup completed');
}

main().catch(err => {
  console.error('Unexpected error during database setup:', err);
  process.exit(1);
});
