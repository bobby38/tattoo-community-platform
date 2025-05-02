import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Initialize Supabase client outside the handler to reuse the instance

// Add this to make the route dynamic and not try to statically generate it
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('GET /api/tribes received'); 
  try {
    // Query the tribes from Supabase directly
    const { data: tribes, error } = await supabase
      .from('tribes')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching tribes from Supabase:', error);
      return NextResponse.json(
        { message: `Error fetching tribes: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log(`Found ${tribes?.length || 0} tribes.`);
    return NextResponse.json(tribes || []);
  } catch (error) {
    console.error('Unexpected error fetching tribes:', error);
    return NextResponse.json(
      { message: 'Internal Server Error fetching tribes' },
      { status: 500 }
    );
  }
}
// Optional: Add other HTTP methods if needed (POST, PUT, DELETE)
