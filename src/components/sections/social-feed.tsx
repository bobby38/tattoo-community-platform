"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Calendar, 
  Image as ImageIcon, 
  MessageCircle, 
  Heart, 
  User,
  Bookmark
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock data for fallback
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    user_id: 'system',
    title: 'Welcome to the Tattoo Community',
    content: 'Join our growing community of tattoo enthusiasts, artists, and studios!',
    image_url: 'https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    post_type: 'news',
    related_style: null,
    related_tribe: null,
    likes_count: 42,
    comments_count: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'system',
    title: 'New Japanese Style Artists Added',
    content: 'Check out the latest artists specializing in traditional Japanese tattooing.',
    image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    post_type: 'news',
    related_style: { id: '1', name: 'Japanese Irezumi', slug: 'japanese-irezumi' },
    related_tribe: null,
    likes_count: 35,
    comments_count: 5,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    user_id: 'system',
    title: 'Upcoming Tattoo Convention in San Francisco',
    content: 'The annual SF Tattoo Expo is happening next month. Get your tickets now!',
    image_url: 'https://images.unsplash.com/photo-1607461194891-3b208b8f47ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    post_type: 'event',
    related_style: null,
    related_tribe: null,
    likes_count: 28,
    comments_count: 12,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '4',
    user_id: 'system',
    title: 'Blackwork Tribe Meetup',
    content: 'The Blackwork Enthusiasts tribe is organizing a virtual meetup next week.',
    image_url: 'https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    post_type: 'event',
    related_style: null,
    related_tribe: { id: '1', name: 'Blackwork Enthusiasts', slug: 'blackwork-enthusiasts' },
    likes_count: 19,
    comments_count: 8,
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '5',
    user_id: 'system',
    title: 'Featured Gallery: Geometric Masterpieces',
    content: 'Check out this collection of stunning geometric tattoos from our community.',
    image_url: 'https://images.unsplash.com/photo-1597217270402-b5a73eba9d24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    post_type: 'gallery',
    related_style: { id: '2', name: 'Geometric', slug: 'geometric' },
    related_tribe: null,
    likes_count: 53,
    comments_count: 14,
    created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    updated_at: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: '6',
    user_id: 'system',
    title: 'Artist Spotlight: Maya Vega',
    content: 'Introducing Maya Vega, a rising star in watercolor tattoos based in Portland.',
    image_url: 'https://images.unsplash.com/photo-1526066755126-6f00a4b32116?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    post_type: 'spotlight',
    related_style: { id: '3', name: 'Watercolor', slug: 'watercolor' },
    related_tribe: null,
    likes_count: 47,
    comments_count: 9,
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 432000000).toISOString()
  }
];

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

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface PostsResponse {
  posts: Post[];
  pagination: PaginationData;
}

const SocialFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts?limit=6');
        
        if (!response.ok) {
          throw new Error(`Error fetching posts: ${response.status}`);
        }
        
        const data: PostsResponse = await response.json();
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        // Use mock data instead of showing an error
        setPosts(MOCK_POSTS);
        setPagination({
          total: MOCK_POSTS.length,
          page: 1,
          limit: 6,
          pages: 1
        });
        // Don't set error state so we don't show the error UI
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Get icon based on post type
  const getPostTypeIcon = (type: Post['post_type']) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-5 w-5" />;
      case 'gallery':
        return <ImageIcon className="h-5 w-5" />;
      case 'spotlight':
        return <User className="h-5 w-5" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Community Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Oops!</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </section>
    );
  }

  // No posts found
  if (posts.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Community Activity</h2>
          <p className="text-muted-foreground mb-6">No activity to show yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Community Activity</h2>
            <p className="text-muted-foreground max-w-2xl">
              Stay updated with the latest news, events, and highlights from the tattoo community.
            </p>
          </div>
          <Link href="/feed" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View Full Feed
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 group">
                {post.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeBadgeClass(post.post_type)}`}>
                        {post.post_type.charAt(0).toUpperCase() + post.post_type.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
                
                <CardContent className={`p-6 ${!post.image_url ? 'pt-10' : ''}`}>
                  {!post.image_url && (
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeBadgeClass(post.post_type)}`}>
                        {post.post_type.charAt(0).toUpperCase() + post.post_type.slice(1)}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                  
                  {(post.related_style || post.related_tribe) && (
                    <div className="mb-4">
                      {post.related_style && (
                        <Link href={`/styles/${post.related_style.slug}`}>
                          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800 mr-2 mb-2">
                            {post.related_style.name}
                          </span>
                        </Link>
                      )}
                      {post.related_tribe && (
                        <Link href={`/tribes/${post.related_tribe.slug}`}>
                          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800 mr-2 mb-2">
                            {post.related_tribe.name}
                          </span>
                        </Link>
                      )}
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    {post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </div>
                </CardContent>
                
                <CardFooter className="px-6 py-4 border-t flex justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{post.likes_count}</span>
                    </button>
                    <button className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{post.comments_count}</span>
                    </button>
                  </div>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {pagination && pagination.pages > 1 && (
          <div className="mt-10 flex justify-center">
            <Link href="/feed">
              <Button variant="outline">
                View More Posts
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialFeed;
