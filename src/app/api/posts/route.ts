import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const sort = url.searchParams.get('sort') || 'created_at';
    const order = url.searchParams.get('order') || 'desc';
    const offset = (page - 1) * limit;

    // Fetch posts without trying to join related tables
    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: data || [], pagination: { total: count || 0, page, limit, pages: count ? Math.ceil(count / limit) : 0 } });
  } catch (e: any) {
    console.error('Unexpected error fetching posts:', e);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
