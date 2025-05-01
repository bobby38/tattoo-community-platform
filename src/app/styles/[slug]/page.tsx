"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  User,
  Instagram,
  Globe,
  Mail,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';

// Define types
interface Style {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  history: string;
  characteristics: string;
  popularity: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  post_type: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface ContactInfo {
  instagram?: string;
  website?: string;
  email?: string;
  phone?: string;
}

interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar_url: string;
  location: string;
  contact_info: ContactInfo | null;
}

export default function StyleDetailPage() {
  const { slug } = useParams();
  const [style, setStyle] = useState<Style | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStyleData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch style details
        const { data: styleData, error: styleError } = await supabase
          .from('styles')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (styleError) throw styleError;
        setStyle(styleData as Style);
        
        if (styleData) {
          // Fetch related posts
          const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select(`
              id, title, content, image_url, post_type, 
              likes_count, comments_count, created_at
            `)
            .eq('related_style_id', styleData.id)
            .order('created_at', { ascending: false })
            .limit(3);
          
          if (postsError) throw postsError;
          setRelatedPosts(postsData as Post[]);
          
          // Fetch artists specializing in this style
          const { data: artistsData, error: artistsError } = await supabase
            .from('artists_styles')
            .select(`
              artists (
                id, name, slug, bio, avatar_url, location, contact_info
              )
            `)
            .eq('style_id', styleData.id)
            .limit(6);
          
          if (artistsError) throw artistsError;
          
          // Extract artists from the join table results and properly cast the type
          const artists = artistsData?.map(item => item.artists) || [];
          setRelatedArtists(artists as unknown as Artist[]);
        }
      } catch (err) {
        console.error('Error fetching style data:', err);
        setError('Failed to load style information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchStyleData();
    }
  }, [slug]);
  
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
  
  // Get badge color based on post type
  const getPostTypeBadgeClass = (type: string) => {
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
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/styles">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Styles
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
  if (error || !style) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Oops!</h2>
        <p className="text-muted-foreground mb-6">{error || 'Style not found'}</p>
        <Link href="/styles">
          <Button>Back to Styles</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back button */}
      <Link href="/styles">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Styles
        </Button>
      </Link>
      
      {/* Style header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">{style.name}</h1>
          <p className="text-muted-foreground mb-6">{style.description}</p>
          
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="prose max-w-none">
              <p>{style.description}</p>
            </TabsContent>
            
            <TabsContent value="history" className="prose max-w-none">
              <p>{style.history}</p>
            </TabsContent>
            
            <TabsContent value="characteristics" className="prose max-w-none">
              <p>{style.characteristics}</p>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <img 
            src={style.image_url} 
            alt={style.name}
            className="w-full h-auto rounded-lg object-cover max-h-[500px]"
          />
        </div>
      </div>
      
      {/* Related artists */}
      {relatedArtists.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Artists Specializing in {style.name}</h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {relatedArtists.map((artist) => (
              <motion.div key={artist.id} variants={itemVariants}>
                <Link href={`/directory/artists/${artist.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="p-6 flex items-center">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={artist.avatar_url} alt={artist.name} />
                        <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="text-xl font-bold">{artist.name}</h3>
                        <p className="text-sm text-muted-foreground">{artist.location}</p>
                        
                        <div className="flex mt-2 space-x-2">
                          {artist.contact_info?.instagram && (
                            <a 
                              href={`https://instagram.com/${artist.contact_info.instagram}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Instagram className="h-4 w-4" />
                            </a>
                          )}
                          
                          {artist.contact_info?.website && (
                            <a 
                              href={artist.contact_info.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-6 text-center">
            <Link href="/directory/artists">
              <Button variant="outline">
                View All Artists
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Latest {style.name} Posts</h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {relatedPosts.map((post) => (
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
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
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
          
          <div className="mt-6 text-center">
            <Link href={`/feed?styleId=${style.id}`}>
              <Button variant="outline">
                View All {style.name} Posts
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
