import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  console.log('GET /api/posts received');
  
  // Get URL parameters
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const page = parseInt(url.searchParams.get('page') || '1');
  const postType = url.searchParams.get('type');
  const styleId = url.searchParams.get('styleId');
  const tribeId = url.searchParams.get('tribeId');
  
  // Calculate offset for pagination
  const offset = (page - 1) * limit;
  
  try {
    // Start building the query
    let query = supabase
      .from('posts')
      .select(`
        *,
        related_style:related_style_id(id, name, slug),
        related_tribe:related_tribe_id(id, name, slug)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Add filters if provided
    if (postType) {
      query = query.eq('post_type', postType);
    }
    
    if (styleId) {
      query = query.eq('related_style_id', styleId);
    }
    
    if (tribeId) {
      query = query.eq('related_tribe_id', tribeId);
    }
    
    // Execute the query
    const { data: posts, error, count } = await query;
    
    if (error) {
      console.error('Error fetching posts from Supabase:', error);
      return NextResponse.json(
        { message: `Error fetching posts: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log(`Found ${posts?.length || 0} posts.`);
    
    // Return the posts with pagination metadata
    return NextResponse.json({
      posts: posts || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0
      }
    });
  } catch (error) {
    console.error('Unexpected error fetching posts:', error);
    return NextResponse.json(
      { message: 'Internal Server Error fetching posts' },
      { status: 500 }
    );
  }
}
