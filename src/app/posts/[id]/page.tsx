"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  User
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';

// Define types for our post data
interface RelatedItem {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url: string | null;
  post_type: 'news' | 'gallery' | 'event' | 'discussion' | 'spotlight';
  related_style: RelatedItem | null;
  related_tribe: RelatedItem | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the post details
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            related_style:related_style_id(id, name, slug),
            related_tribe:related_tribe_id(id, name, slug)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setPost(data as Post);
        
        // Fetch related posts based on style or tribe
        if (data.related_style_id || data.related_tribe_id) {
          let query = supabase
            .from('posts')
            .select(`
              *,
              related_style:related_style_id(id, name, slug),
              related_tribe:related_tribe_id(id, name, slug)
            `)
            .neq('id', id)
            .order('created_at', { ascending: false })
            .limit(3);
          
          if (data.related_style_id) {
            query = query.eq('related_style_id', data.related_style_id);
          } else if (data.related_tribe_id) {
            query = query.eq('related_tribe_id', data.related_tribe_id);
          }
          
          const { data: relatedData, error: relatedError } = await query;
          
          if (!relatedError && relatedData) {
            setRelatedPosts(relatedData as Post[]);
          }
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchPost();
    }
  }, [id]);
  
  // Get badge color based on post type
  const getPostTypeBadgeClass = (type: Post['post_type']) => {
    switch (type) {
      case 'event':
        return 'bg-purple-100 text-purple-800';
      case 'gallery':
        return 'bg-blue-100 text-blue-800';
      case 'spotlight':
        return 'bg-amber-100 text-amber-800';
      case 'news':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/feed">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feed
            </Button>
          </Link>
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <Skeleton className="h-[400px] w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4">Oops!</h2>
        <p className="text-muted-foreground mb-6">{error || 'Post not found'}</p>
        <Link href="/feed">
          <Button>Back to Feed</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Back button */}
      <Link href="/feed">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Button>
      </Link>
      
      {/* Post header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPostTypeBadgeClass(post.post_type)}`}>
            {post.post_type.charAt(0).toUpperCase() + post.post_type.slice(1)}
          </span>
          <span className="text-muted-foreground ml-4">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/images/avatar-placeholder.jpg" alt="User" />
            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium">Admin</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(post.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Post image */}
      {post.image_url && (
        <div className="mb-8">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-auto rounded-lg object-cover max-h-[500px]"
          />
        </div>
      )}
      
      {/* Post content */}
      <div className="prose prose-lg max-w-none mb-8">
        <p>{post.content}</p>
      </div>
      
      {/* Tags */}
      {(post.related_style || post.related_tribe) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Related to:</h3>
          <div className="flex flex-wrap">
            {post.related_style && (
              <Link href={`/styles/${post.related_style.slug}`}>
                <span className="inline-block bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-800 mr-2 mb-2 hover:bg-gray-200 transition-colors">
                  Style: {post.related_style.name}
                </span>
              </Link>
            )}
            {post.related_tribe && (
              <Link href={`/tribes/${post.related_tribe.slug}`}>
                <span className="inline-block bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-800 mr-2 mb-2 hover:bg-gray-200 transition-colors">
                  Tribe: {post.related_tribe.name}
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
      
      {/* Engagement buttons */}
      <div className="flex items-center justify-between border-t border-b py-4 mb-8">
        <div className="flex items-center space-x-6">
          <button className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <Heart className="h-5 w-5 mr-2" />
            <span>{post.likes_count} Likes</span>
          </button>
          <button className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="h-5 w-5 mr-2" />
            <span>{post.comments_count} Comments</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/posts/${relatedPost.id}`}>
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {relatedPost.image_url && (
                    <img 
                      src={relatedPost.image_url} 
                      alt={relatedPost.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.content}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Comments section placeholder */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-muted-foreground mb-4">Comments feature coming soon!</p>
          <Button variant="outline">Sign in to comment</Button>
        </div>
      </div>
    </div>
  );
}
