-- Create Role enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
        CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
    END IF;
END$$;

-- Create ReviewTargetType enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reviewtargettype') THEN
        CREATE TYPE "ReviewTargetType" AS ENUM ('STUDIO', 'ARTIST', 'POST');
    END IF;
END$$;

-- First, create a default system user to handle existing posts
-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(150) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Insert the system user first to handle existing posts
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Create a system user to match existing posts
        INSERT INTO "users" ("id", "name", "email", "role", "created_at", "updated_at")
        VALUES ('system', 'System User', 'system@example.com', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (email) DO NOTHING;
        
        -- Create an admin user
        INSERT INTO "users" ("id", "name", "email", "role", "created_at", "updated_at")
        VALUES ('admin-user-id', 'Admin User', 'admin@example.com', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (email) DO NOTHING;

        -- Create a default regular user
        INSERT INTO "users" ("id", "name", "email", "role", "created_at", "updated_at")
        VALUES ('default-user-id', 'Default User', 'user@example.com', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (email) DO NOTHING;
    END IF;
END$$;

-- Create studios table if it doesn't exist
CREATE TABLE IF NOT EXISTS "studios" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "lat" DECIMAL,
    "lng" DECIMAL,
    "website" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studios_pkey" PRIMARY KEY ("id")
);

-- Create artists table if it doesn't exist
CREATE TABLE IF NOT EXISTS "artists" (
    "id" TEXT NOT NULL,
    "studio_id" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- Create contact_info table if it doesn't exist
CREATE TABLE IF NOT EXISTS "contact_info" (
    "id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "instagram" VARCHAR(100),
    "phone" VARCHAR(50),
    "email" VARCHAR(150),
    "website" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id")
);

-- Create unique index on artist_id for contact_info
CREATE UNIQUE INDEX IF NOT EXISTS "contact_info_artist_id_key" ON "contact_info"("artist_id");

-- Add foreign keys for existing tables
DO $$
BEGIN
    -- Check if user_id column exists in posts table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'user_id') THEN
        ALTER TABLE "posts" ADD COLUMN "user_id" TEXT;
    END IF;
    
    -- Check if the foreign key constraint exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'posts_user_id_fkey' 
        AND table_name = 'posts'
    ) THEN
        -- Add the foreign key if users table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
            ALTER TABLE "posts" 
            ADD CONSTRAINT "posts_user_id_fkey" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") 
            ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
    END IF;
END$$;
