"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, ServerCrash, Search, Users, Filter, Hash, Clock, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Define the Tribe type based on your Prisma schema
interface Tribe {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Define the Post type (simplified for now)
interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  related_tribe: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

// Define the API response type
interface PostsApiResponse {
  posts: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function TribesPage() {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [selectedTribe, setSelectedTribe] = useState<Tribe | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingTribes, setIsLoadingTribes] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'latest' | 'popular' | null>(null);
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true after component mounts to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Tribes from API
  useEffect(() => {
    if (!mounted) return;
    
    const fetchTribes = async () => {
      setIsLoadingTribes(true);
      setError(null);
      try {
        const response = await fetch('/api/tribes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Tribe[] = await response.json();
        setTribes(data);
      } catch (err: any) {
        console.error("Failed to fetch tribes:", err);
        setError(`Failed to load tribes: ${err.message}`);
      } finally {
        setIsLoadingTribes(false);
      }
    };
    fetchTribes();
  }, [mounted]);

  // Fetch posts for selected tribe
  useEffect(() => {
    if (!mounted) return;
    
    const fetchPosts = async () => {
      setIsLoadingPosts(true);
      setError(null);
      try {
        // Build the query parameters
        const params = new URLSearchParams();
        if (selectedTribe) {
          params.append('tribeId', selectedTribe.id);
        }
        if (activeFilter === 'latest') {
          params.append('sort', 'created_at');
          params.append('order', 'desc');
        } else if (activeFilter === 'popular') {
          params.append('sort', 'likes');
          params.append('order', 'desc');
        }
        if (activeHashtag) {
          params.append('tag', activeHashtag);
        }
        params.append('limit', '20');
        params.append('page', '1');
        
        // Make the API call
        const response = await fetch(`/api/posts?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: PostsApiResponse = await response.json();
        setPosts(data.posts || []);
      } catch (err: any) {
        console.error("Failed to fetch posts:", err);
        setError(`Failed to load posts: ${err.message}`);
        setPosts([]);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    
    fetchPosts();
  }, [selectedTribe, activeFilter, activeHashtag, mounted]);

  const handleTribeSelect = (tribe: Tribe | null) => {
    setSelectedTribe(tribe);
  };

  const handleFilterSelect = (filter: 'latest' | 'popular' | null) => {
    setActiveFilter(filter);
  };

  const handleHashtagSelect = (hashtag: string | null) => {
    setActiveHashtag(hashtag);
  };

  // Filter tribes based on search
  const filteredTribes = tribes.filter(tribe => 
    tribe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sample hashtags (to be replaced with real data later)
  const popularHashtags = ['blackwork', 'traditional', 'japanese', 'minimalist', 'watercolor', 'geometric'];

  // If not mounted yet, return null to prevent hydration errors
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Bar */}
      <div className="bg-black border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/" className="mr-6">
              <Button variant="ghost" className="text-white hover:text-orange-500 p-0">
                <ArrowLeft className="h-5 w-5 mr-2" />
                BACK
              </Button>
            </Link>
            <div className="flex-1 flex justify-center">
              <h1 className="text-xl font-bold tracking-wider">TATTOO TRIBES</h1>
            </div>
            <div className="w-[80px]"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-3">
            {/* Tribes Navigation */}
            <div className="bg-zinc-900 rounded mb-6">
              <div className="bg-zinc-800 py-3 px-4 border-l-4 border-orange-500">
                <h2 className="font-bold text-lg uppercase">TRIBES</h2>
              </div>
              
              {/* Search */}
              <div className="p-4 border-b border-zinc-800">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input 
                    placeholder="SEARCH TRIBES..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-orange-500"
                  />
                </div>
              </div>
              
              {/* Tribes List */}
              <div className="max-h-[40vh] overflow-y-auto">
                {isLoadingTribes ? (
                  <div className="p-4 space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full bg-zinc-800" />
                    ))}
                  </div>
                ) : error ? (
                  <div className="p-4">
                    <div className="text-red-400 text-sm p-4 bg-red-900/30 rounded flex items-center">
                      <ServerCrash className="h-4 w-4 mr-2" /> {error}
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    {/* All Tribes Option */}
                    <button 
                      className={`w-full text-left px-4 py-3 flex items-center justify-between ${
                        !selectedTribe ? 'bg-orange-500 text-black' : 'text-white hover:bg-zinc-800'
                      }`}
                      onClick={() => handleTribeSelect(null)}
                    >
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="font-medium">ALL TRIBES</span>
                      </div>
                      {!selectedTribe && <ChevronRight className="h-4 w-4" />}
                    </button>
                    
                    {/* Individual Tribes */}
                    {filteredTribes.map((tribe) => (
                      <button 
                        key={tribe.id} 
                        className={`w-full text-left px-4 py-3 flex items-center justify-between ${
                          selectedTribe?.id === tribe.id ? 'bg-orange-500 text-black' : 'text-white hover:bg-zinc-800'
                        }`}
                        onClick={() => handleTribeSelect(tribe)}
                      >
                        <span className="font-medium">{tribe.name.toUpperCase()}</span>
                        {selectedTribe?.id === tribe.id && <ChevronRight className="h-4 w-4" />}
                      </button>
                    ))}
                    
                    {filteredTribes.length === 0 && !isLoadingTribes && (
                      <div className="text-sm text-zinc-400 text-center py-6">
                        NO TRIBES FOUND
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Hashtags Section */}
            <div className="bg-zinc-900 rounded">
              <div className="bg-zinc-800 py-3 px-4 border-l-4 border-orange-500">
                <h2 className="font-bold text-lg uppercase">HASHTAGS</h2>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {popularHashtags.map(tag => (
                  <Badge 
                    key={tag}
                    variant="outline" 
                    className={`cursor-pointer py-1.5 px-3 uppercase ${
                      activeHashtag === tag 
                        ? 'bg-orange-500 text-black border-orange-500 hover:bg-orange-600' 
                        : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
                    }`}
                    onClick={() => handleHashtagSelect(activeHashtag === tag ? null : tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Post Feed */}
          <div className="lg:col-span-9">
            {/* Feed Header */}
            <div className="bg-zinc-900 rounded mb-6">
              <div className="bg-zinc-800 py-3 px-4 border-l-4 border-orange-500 flex justify-between items-center">
                <h2 className="font-bold text-lg uppercase">
                  {selectedTribe ? selectedTribe.name : "ALL TRIBES"} FEED
                  {activeHashtag && <span className="ml-2 text-orange-500">#{activeHashtag}</span>}
                </h2>
                
                {/* Filter Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`border-zinc-700 ${activeFilter === 'latest' ? 'bg-orange-500 text-black border-orange-500' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                    onClick={() => handleFilterSelect(activeFilter === 'latest' ? null : 'latest')}
                  >
                    <Clock className="h-4 w-4 mr-2" /> LATEST
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`border-zinc-700 ${activeFilter === 'popular' ? 'bg-orange-500 text-black border-orange-500' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                    onClick={() => handleFilterSelect(activeFilter === 'popular' ? null : 'popular')}
                  >
                    <Filter className="h-4 w-4 mr-2" /> POPULAR
                  </Button>
                </div>
              </div>
              
              {/* Active Filters Display */}
              {(activeFilter || activeHashtag) && (
                <div className="px-4 py-3 flex items-center">
                  <span className="text-sm text-zinc-400 mr-2 uppercase">Active filters:</span>
                  <div className="flex gap-2">
                    {activeFilter && (
                      <Badge variant="secondary" className="bg-zinc-800 uppercase">
                        {activeFilter}
                        <button 
                          className="ml-1 text-zinc-400 hover:text-white" 
                          onClick={() => handleFilterSelect(null)}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {activeHashtag && (
                      <Badge variant="secondary" className="bg-zinc-800 uppercase">
                        #{activeHashtag}
                        <button 
                          className="ml-1 text-zinc-400 hover:text-white" 
                          onClick={() => handleHashtagSelect(null)}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Post Feed */}
            <div className="space-y-6">
              {isLoadingPosts ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                </div>
              ) : error ? (
                <div className="bg-zinc-900 border border-red-700 rounded p-6 text-center">
                  <div className="flex items-center justify-center text-red-500 mb-4">
                    <ServerCrash className="h-8 w-8 mr-2" />
                  </div>
                  <p className="text-red-400">{error}</p>
                  <Button 
                    onClick={() => {
                      // Trigger a refetch by updating one of the dependencies
                      setActiveFilter(activeFilter === 'latest' ? null : 'latest');
                    }}
                    className="mt-4 bg-red-700 hover:bg-red-800 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : posts.length > 0 ? (
                posts.map(post => (
                  <Card key={post.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                    <CardContent className="p-0">
                      {post.image_url && (
                        <img 
                          src={post.image_url} 
                          alt={post.caption || 'Post image'} 
                          className="w-full h-auto max-h-[500px] object-cover"
                        />
                      )}
                      <div className="p-4">
                        <p className="text-white">{post.caption}</p>
                        <p className="text-xs text-zinc-400 mt-2 uppercase">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="bg-zinc-900 border border-dashed border-zinc-700 rounded p-12 text-center">
                  <div className="inline-block bg-orange-500 text-black px-4 py-2 mb-4 uppercase font-bold">
                    No Posts Found
                  </div>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    {selectedTribe 
                      ? `Be the first to post in the ${selectedTribe.name} tribe!` 
                      : activeHashtag 
                        ? `No posts found with #${activeHashtag}.` 
                        : 'No posts found with the current filters.'}
                  </p>
                  <Button className="mt-6 bg-orange-500 text-black hover:bg-orange-600 uppercase">
                    Create Post
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
