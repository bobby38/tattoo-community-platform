"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Calendar, 
  Image as ImageIcon, 
  MessageCircle, 
  Heart, 
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Style {
  id: string;
  name: string;
  slug: string;
}

interface Tribe {
  id: string;
  name: string;
  slug: string;
}

export default function FeedPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [styles, setStyles] = useState<Style[]>([]);
  const [tribes, setTribes] = useState<Tribe[]>([]);
  
  // Filter states
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || '');
  const [selectedStyle, setSelectedStyle] = useState<string>(searchParams.get('styleId') || '');
  const [selectedTribe, setSelectedTribe] = useState<string>(searchParams.get('tribeId') || '');
  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
  
  // Fetch posts with filters
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        
        // Build the URL with query parameters
        let url = `/api/posts?page=${currentPage}&limit=9`;
        
        if (selectedType) {
          url += `&type=${selectedType}`;
        }
        
        if (selectedStyle) {
          url += `&styleId=${selectedStyle}`;
        }
        
        if (selectedTribe) {
          url += `&tribeId=${selectedTribe}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error fetching posts: ${response.status}`);
        }
        
        const data: PostsResponse = await response.json();
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage, selectedType, selectedStyle, selectedTribe]);
  
  // Fetch styles and tribes for filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Fetch styles
        const { data: stylesData, error: stylesError } = await supabase
          .from('styles')
          .select('id, name, slug')
          .order('name');
        
        if (stylesError) throw stylesError;
        setStyles(stylesData || []);
        
        // Fetch tribes
        const { data: tribesData, error: tribesError } = await supabase
          .from('tribes')
          .select('id, name, slug')
          .order('name');
        
        if (tribesError) throw tribesError;
        setTribes(tribesData || []);
      } catch (err) {
        console.error('Failed to fetch filters:', err);
      }
    };
    
    fetchFilters();
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
  
  // Handle filter changes
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  const handleStyleChange = (value: string) => {
    setSelectedStyle(value);
    setSelectedTribe(''); // Reset tribe when style changes
    setCurrentPage(1);
  };
  
  const handleTribeChange = (value: string) => {
    setSelectedTribe(value);
    setSelectedStyle(''); // Reset style when tribe changes
    setCurrentPage(1);
  };
  
  const handleClearFilters = () => {
    setSelectedType('');
    setSelectedStyle('');
    setSelectedTribe('');
    setCurrentPage(1);
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isLoading && posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Community Feed</h1>
        
        {/* Filters skeleton */}
        <div className="flex flex-wrap gap-4 mb-8 animate-pulse">
          <div className="h-10 w-40 bg-gray-200 rounded"></div>
          <div className="h-10 w-40 bg-gray-200 rounded"></div>
          <div className="h-10 w-40 bg-gray-200 rounded"></div>
        </div>
        
        {/* Posts skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Community Feed</h1>
      
      {/* Filters */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-semibold">Filter Posts</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Post Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="discussion">Discussion</SelectItem>
                <SelectItem value="spotlight">Spotlight</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-auto">
            <Select value={selectedStyle} onValueChange={handleStyleChange} disabled={!!selectedTribe}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Styles</SelectItem>
                {styles.map((style) => (
                  <SelectItem key={style.id} value={style.id}>{style.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-auto">
            <Select value={selectedTribe} onValueChange={handleTribeChange} disabled={!!selectedStyle}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Tribe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tribes</SelectItem>
                {tribes.map((tribe) => (
                  <SelectItem key={tribe.id} value={tribe.id}>{tribe.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" onClick={handleClearFilters} className="ml-auto">
            Clear Filters
          </Button>
        </div>
      </div>
      
      {/* No posts found */}
      {posts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
          <p className="text-muted-foreground mb-6">Try changing your filters or check back later.</p>
          <Button onClick={handleClearFilters}>Clear Filters</Button>
        </div>
      )}
      
      {/* Posts grid */}
      {posts.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Link href={`/posts/${post.id}`}>
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
                          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800 mr-2 mb-2">
                            {post.related_style.name}
                          </span>
                        )}
                        {post.related_tribe && (
                          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800 mr-2 mb-2">
                            {post.related_tribe.name}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      {post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="px-6 py-4 border-t flex justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-muted-foreground">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{post.likes_count}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{post.comments_count}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-1">
            {[...Array(pagination.pages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show limited page numbers for better UI
              if (
                pageNumber === 1 || 
                pageNumber === pagination.pages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={isLoading}
                    className="w-10 h-10"
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (
                (pageNumber === currentPage - 2 && currentPage > 3) || 
                (pageNumber === currentPage + 2 && currentPage < pagination.pages - 2)
              ) {
                return <span key={pageNumber} className="px-2">...</span>;
              }
              return null;
            })}
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.pages || isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
