-- Create styles table
CREATE TABLE IF NOT EXISTS styles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tribes table
CREATE TABLE IF NOT EXISTS tribes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert styles data
INSERT INTO styles (name, slug) VALUES
  ('Traditional (Old School)', 'traditional-old-school'),
  ('Realism', 'realism'),
  ('Watercolor', 'watercolor'),
  ('Tribal', 'tribal'),
  ('New School', 'new-school'),
  ('Neo Traditional', 'neo-traditional'),
  ('Japanese (Irezumi)', 'japanese-irezumi'),
  ('Blackwork', 'blackwork'),
  ('Illustrative', 'illustrative'),
  ('Geometric', 'geometric')
ON CONFLICT (slug) DO NOTHING;

-- Insert tribes data
INSERT INTO tribes (name, slug, icon_url) VALUES
  ('Polynesian', 'polynesian', '/icons/tribes/polynesian.svg'),
  ('Japanese Style Fans', 'japanese-style-fans', '/icons/tribes/japanese.svg'),
  ('Blackwork Enthusiasts', 'blackwork-enthusiasts', '/icons/tribes/blackwork.svg')
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tribes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for styles" ON styles
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access for tribes" ON tribes
  FOR SELECT USING (true);
