-- Create posts table for social feed
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  post_type TEXT NOT NULL, -- 'news', 'gallery', 'event', 'discussion', etc.
  related_style_id TEXT, -- Optional reference to a style
  related_tribe_id TEXT, -- Optional reference to a tribe
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for posts" ON posts
  FOR SELECT USING (true);

-- Insert sample posts data
INSERT INTO posts (user_id, title, content, image_url, post_type, related_style_id, related_tribe_id) VALUES
  ('system', 'Welcome to the Tattoo Community', 'Join our growing community of tattoo enthusiasts, artists, and studios!', 'https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80', 'news', NULL, NULL),
  ('system', 'New Japanese Style Artists Added', 'Check out the latest artists specializing in traditional Japanese tattooing.', 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'news', (SELECT id FROM styles WHERE slug = 'japanese-irezumi' LIMIT 1), NULL),
  ('system', 'Upcoming Tattoo Convention in San Francisco', 'The annual SF Tattoo Expo is happening next month. Get your tickets now!', 'https://images.unsplash.com/photo-1607461194891-3b208b8f47ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'event', NULL, NULL),
  ('system', 'Blackwork Tribe Meetup', 'The Blackwork Enthusiasts tribe is organizing a virtual meetup next week.', 'https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'event', NULL, (SELECT id FROM tribes WHERE slug = 'blackwork-enthusiasts' LIMIT 1)),
  ('system', 'Featured Gallery: Geometric Masterpieces', 'Check out this collection of stunning geometric tattoos from our community.', 'https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80', 'gallery', (SELECT id FROM styles WHERE slug = 'geometric' LIMIT 1), NULL),
  ('system', 'Artist Spotlight: Maya Vega', 'Introducing Maya Vega, a rising star in watercolor tattoos based in Portland.', 'https://images.unsplash.com/photo-1526066755126-6f00a4b32116?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'spotlight', (SELECT id FROM styles WHERE slug = 'watercolor' LIMIT 1), NULL)
ON CONFLICT (id) DO NOTHING;
