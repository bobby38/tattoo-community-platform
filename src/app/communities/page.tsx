"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Search, 
  Users, 
  ExternalLink,
  Filter,
  Instagram,
  Facebook,
  MessageCircle,
  Globe
} from 'lucide-react';
import { FaReddit, FaDiscord } from 'react-icons/fa';

// Define Community interface
interface Community {
  id: number;
  name: string;
  platform: string;
  url: string;
  member_count: number;
  focus_theme: string;
  activity_level: string;
  notable_features: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Client-only component to avoid hydration issues
const CommunitiesContent = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [activeActivityLevel, setActiveActivityLevel] = useState<string | null>(null);
  
  // Fetch communities data
  useEffect(() => {
    async function fetchCommunities() {
      try {
        setIsLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (activePlatform) params.append('platform', activePlatform);
        if (activeActivityLevel) params.append('activity_level', activeActivityLevel);
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await fetch(`/api/communities?${params.toString()}`);
        const data = await response.json();
        
        if (data.communities) {
          setCommunities(data.communities);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCommunities();
  }, [activePlatform, activeActivityLevel, searchTerm]);
  
  // Get unique platforms and activity levels for filters
  const platforms = Array.from(new Set(communities.map(community => community.platform))).sort();
  const activityLevels = Array.from(new Set(communities.map(community => community.activity_level))).sort();
  
  // Format member count for display
  const formatMemberCount = (count: number) => {
    if (count === 0) return 'N/A';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M+ members`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K+ members`;
    return `${count} members`;
  };
  
  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'reddit':
        return <FaReddit className="h-5 w-5 text-orange-500" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-500" />;
      case 'discord':
        return <FaDiscord className="h-5 w-5 text-indigo-500" />;
      default:
        return <Globe className="h-5 w-5 text-gray-500" />;
    }
  };
  
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
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Tattoo Communities</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Connect with fellow tattoo enthusiasts, artists, and collectors across various platforms. Join discussions, share your work, and stay updated on the latest trends.
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search communities..." 
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        {/* Platform Filter */}
        <div>
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Filter by Platform</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activePlatform === null ? "default" : "outline"} 
              onClick={() => setActivePlatform(null)}
              className="mb-2"
            >
              All Platforms
            </Button>
            
            {platforms.map(platform => (
              <Button 
                key={platform} 
                variant={activePlatform === platform ? "default" : "outline"}
                onClick={() => setActivePlatform(platform)}
                className="mb-2 flex items-center gap-2"
              >
                {getPlatformIcon(platform)}
                {platform}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Activity Level Filter */}
        <div>
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Filter by Activity Level</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeActivityLevel === null ? "default" : "outline"} 
              onClick={() => setActiveActivityLevel(null)}
              className="mb-2"
            >
              All Activity Levels
            </Button>
            
            {activityLevels.map(level => (
              <Button 
                key={level} 
                variant={activeActivityLevel === level ? "default" : "outline"}
                onClick={() => setActiveActivityLevel(level)}
                className="mb-2"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Communities List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {communities.length > 0 ? (
            communities.map((community) => (
              <motion.div key={community.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getPlatformIcon(community.platform)}
                        </div>
                        <h3 className="text-xl font-bold truncate">{community.name}</h3>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {community.activity_level}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {community.focus_theme}
                    </p>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{formatMemberCount(community.member_count)}</span>
                    </div>
                    
                    {community.notable_features && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-1">Notable Features:</h4>
                        <p className="text-xs text-muted-foreground">{community.notable_features}</p>
                      </div>
                    )}
                    
                    <div className="mt-auto pt-4 border-t">
                      <a 
                        href={community.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Visit Community
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No communities found</h3>
              <p className="text-muted-foreground">
                Try changing your search terms or filters.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Main component that uses client-side only rendering
export default function CommunitiesPage() {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      ) : (
        <CommunitiesContent />
      )}
    </div>
  );
}
