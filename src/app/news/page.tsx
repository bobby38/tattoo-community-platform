"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  Newspaper, 
  Globe,
  Filter,
  Clock,
  ExternalLink,
  Rss,
  BookOpen,
  Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define NewsSource interface
interface NewsSource {
  id: number;
  name: string;
  url: string;
  rss_url: string | null;
  content_focus: string;
  update_frequency: string;
  notable_features: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Client-only component to avoid hydration issues
const NewsContent = () => {
  const [newsSources, setNewsSources] = useState<NewsSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFrequency, setActiveFrequency] = useState<string | null>(null);
  
  // Fetch news sources data
  useEffect(() => {
    async function fetchNewsSources() {
      try {
        setIsLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (activeFrequency) params.append('frequency', activeFrequency);
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await fetch(`/api/news?${params.toString()}`);
        const data = await response.json();
        
        if (data.news_sources) {
          setNewsSources(data.news_sources);
        }
      } catch (error) {
        console.error('Error fetching news sources:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchNewsSources();
  }, [activeFrequency, searchTerm]);
  
  // Get unique frequencies for filters
  const frequencies = Array.from(new Set(newsSources.map(source => source.update_frequency))).sort();
  
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
  
  // Get icon based on source name (simplified approach)
  const getSourceIcon = (name: string) => {
    if (name.toLowerCase().includes('podcast')) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M17.5 12.5a5.5 5.5 0 1 0-11 0"/><path d="M15.5 15.5a3.5 3.5 0 1 0-7 0"/><path d="M14 18a2 2 0 1 0-4 0"/><path d="M12 22v-4"/></svg>;
    } else if (name.toLowerCase().includes('blog')) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>;
    } else if (name.toLowerCase().includes('magazine')) {
      return <Newspaper className="h-8 w-8 text-primary" />;
    } else {
      return <Globe className="h-8 w-8 text-primary" />;
    }
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
        
        <h1 className="text-4xl font-bold mb-4">Tattoo News Sources</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Stay up-to-date with the latest tattoo industry news, trends, and insights from these trusted sources. From magazines to podcasts, these platforms cover everything happening in the tattoo world.
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search news sources..." 
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        {/* Frequency Filter */}
        <div>
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Filter by Update Frequency</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeFrequency === null ? "default" : "outline"} 
              onClick={() => setActiveFrequency(null)}
              className="mb-2"
            >
              All Frequencies
            </Button>
            
            {frequencies.map(frequency => (
              <Button 
                key={frequency} 
                variant={activeFrequency === frequency ? "default" : "outline"}
                onClick={() => setActiveFrequency(frequency)}
                className="mb-2"
              >
                {frequency}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* News Sources List */}
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
          {newsSources.length > 0 ? (
            newsSources.map((source) => (
              <motion.div key={source.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="mr-4">
                        {getSourceIcon(source.name)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold line-clamp-2">{source.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {source.update_frequency}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-1 flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Content Focus:
                      </h4>
                      <p className="text-sm text-muted-foreground">{source.content_focus}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-1 flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Notable Features:
                      </h4>
                      <p className="text-sm text-muted-foreground">{source.notable_features}</p>
                    </div>
                    
                    {source.rss_url && (
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Rss className="h-4 w-4 mr-1 shrink-0" />
                        <a 
                          href={source.rss_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          RSS Feed Available
                        </a>
                      </div>
                    )}
                    
                    <div className="mt-auto pt-4 border-t">
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Visit Source
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <Newspaper className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No news sources found</h3>
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
export default function NewsPage() {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      ) : (
        <NewsContent />
      )}
    </div>
  );
}
