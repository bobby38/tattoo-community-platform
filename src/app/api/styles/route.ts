import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Add this to make the route dynamic and not try to statically generate it
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('GET /api/styles received'); 
  try {
    // Query the styles from Supabase directly
    const { data: styles, error } = await supabase
      .from('styles')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching styles from Supabase:', error);
      return NextResponse.json(
        { message: `Error fetching styles: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log(`Found ${styles?.length || 0} styles.`);
    return NextResponse.json(styles || []);
  } catch (error) {
    console.error('Unexpected error fetching styles:', error);
    return NextResponse.json(
      { message: 'Internal Server Error fetching styles' },
      { status: 500 }
    );
  }
}

// Optional: Add other HTTP methods if needed (POST, PUT, DELETE)
