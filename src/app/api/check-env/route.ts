import { NextResponse } from 'next/server';

// Add this to make the route dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  // Get environment variables
  const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
  const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
  const BUNNY_STORAGE_URL = process.env.BUNNY_STORAGE_URL;
  const BUNNY_PULL_ZONE_URL = process.env.BUNNY_PULL_ZONE_URL;

  // Check if Bunny.net configuration is available
  const config = {
    BUNNY_STORAGE_ZONE: BUNNY_STORAGE_ZONE ? 'Set' : 'Not set',
    BUNNY_API_KEY: BUNNY_API_KEY ? 'Set' : 'Not set',
    BUNNY_STORAGE_URL: BUNNY_STORAGE_URL ? 'Set' : 'Not set',
    BUNNY_PULL_ZONE_URL: BUNNY_PULL_ZONE_URL ? 'Set' : 'Not set',
  };

  return NextResponse.json(config);
}
