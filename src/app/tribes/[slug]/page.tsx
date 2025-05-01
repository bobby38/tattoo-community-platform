"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  User,
  Users,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase';

// Define types
interface Tribe {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  member_count: number;
  created_at: string;
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

interface Member {
  id: string;
  name: string;
  slug: string;
  avatar_url: string;
  location: string;
  contact_info: ContactInfo | null;
}

export default function TribeDetailPage() {
  const { slug } = useParams();
  const [tribe, setTribe] = useState<Tribe | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTribeData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch tribe details
        const { data: tribeData, error: tribeError } = await supabase
          .from('tribes')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (tribeError) throw tribeError;
        setTribe(tribeData as Tribe);
        
        if (tribeData) {
          // Fetch related posts
          const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select(`
              id, title, content, image_url, post_type, 
              likes_count, comments_count, created_at
            `)
            .eq('related_tribe_id', tribeData.id)
            .order('created_at', { ascending: false })
            .limit(3);
          
          if (postsError) throw postsError;
          setRelatedPosts(postsData as Post[]);
          
          // Fetch tribe members
          const { data: membersData, error: membersError } = await supabase
            .from('tribe_members')
            .select(`
              artists (
                id, name, slug, avatar_url, location, contact_info
              )
            `)
            .eq('tribe_id', tribeData.id)
            .limit(6);
          
          if (membersError) throw membersError;
          
          // Extract members from the join table results and properly cast the type
          const members = membersData?.map(item => item.artists) || [];
          setMembers(members as unknown as Member[]);
        }
      } catch (err) {
        console.error('Error fetching tribe data:', err);
        setError('Failed to load tribe information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchTribeData();
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
          <Link href="/tribes">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tribes
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
  if (error || !tribe) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Oops!</h2>
        <p className="text-muted-foreground mb-6">{error || 'Tribe not found'}</p>
        <Link href="/tribes">
          <Button>Back to Tribes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back button */}
      <Link href="/tribes">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tribes
        </Button>
      </Link>
      
      {/* Tribe header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="flex items-center mb-4">
            <h1 className="text-4xl font-bold mr-3">{tribe.name}</h1>
            <Badge className="bg-primary text-white">
              <Users className="h-3 w-3 mr-1" />
              {tribe.member_count} members
            </Badge>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created {formatDistanceToNow(new Date(tribe.created_at), { addSuffix: true })}</span>
          </div>
          
          <div className="prose max-w-none mb-6">
            <p>{tribe.description}</p>
          </div>
          
          <Button>Join Tribe</Button>
        </div>
        
        <div>
          <img 
            src={tribe.image_url} 
            alt={tribe.name}
            className="w-full h-auto rounded-lg object-cover max-h-[500px]"
          />
        </div>
      </div>
      
      {/* Tribe members */}
      {members.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Members</h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {members.map((member) => (
              <motion.div key={member.id} variants={itemVariants}>
                <Link href={`/directory/artists/${member.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="p-6 flex items-center">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={member.avatar_url} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.location}</p>
                        
                        <div className="flex mt-2 space-x-2">
                          {member.contact_info?.instagram && (
                            <a 
                              href={`https://instagram.com/${member.contact_info.instagram}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <span className="text-xs">@{member.contact_info.instagram}</span>
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
            <Link href={`/directory/artists?tribe=${tribe.id}`}>
              <Button variant="outline">
                View All Members
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Latest Tribe Posts</h2>
          
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
            <Link href={`/feed?tribeId=${tribe.id}`}>
              <Button variant="outline">
                View All Tribe Posts
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
