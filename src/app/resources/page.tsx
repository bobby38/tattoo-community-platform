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
  BookOpen, 
  Globe,
  Filter,
  Clock,
  DollarSign,
  ExternalLink,
  School,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define Resource interface
interface Resource {
  id: number;
  name: string;
  provider: string;
  format: string;
  topic: string;
  cost: string;
  duration: string;
  availability: string;
  features: string;
  region: string;
  url: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Client-only component to avoid hydration issues
const ResourcesContent = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFormat, setActiveFormat] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  
  // Fetch resources data
  useEffect(() => {
    async function fetchResources() {
      try {
        setIsLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (activeFormat) params.append('format', activeFormat);
        if (activeRegion) params.append('region', activeRegion);
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await fetch(`/api/resources?${params.toString()}`);
        const data = await response.json();
        
        if (data.resources) {
          setResources(data.resources);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchResources();
  }, [activeFormat, activeRegion, searchTerm]);
  
  // Get unique formats and regions for filters
  const formats = Array.from(new Set(resources.map(resource => resource.format))).sort();
  const regions = Array.from(new Set(resources.map(resource => resource.region))).sort();
  
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
  
  // Format cost for display
  const formatCost = (cost: string) => {
    if (cost.toLowerCase().includes('free')) return 'Free';
    return cost;
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
        
        <h1 className="text-4xl font-bold mb-4">Tattoo Educational Resources</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Discover courses, workshops, and educational materials to enhance your tattoo skills or learn more about the art form. Resources range from beginner to advanced levels.
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        {/* Format Filter */}
        <div>
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Filter by Format</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeFormat === null ? "default" : "outline"} 
              onClick={() => setActiveFormat(null)}
              className="mb-2"
            >
              All Formats
            </Button>
            
            {formats.map(format => (
              <Button 
                key={format} 
                variant={activeFormat === format ? "default" : "outline"}
                onClick={() => setActiveFormat(format)}
                className="mb-2"
              >
                {format}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Region Filter */}
        <div>
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Filter by Region</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeRegion === null ? "default" : "outline"} 
              onClick={() => setActiveRegion(null)}
              className="mb-2"
            >
              All Regions
            </Button>
            
            {regions.map(region => (
              <Button 
                key={region} 
                variant={activeRegion === region ? "default" : "outline"}
                onClick={() => setActiveRegion(region)}
                className="mb-2"
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Resources List */}
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
          {resources.length > 0 ? (
            resources.map((resource) => (
              <motion.div key={resource.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold line-clamp-2">{resource.name}</h3>
                      <Badge variant="outline" className="ml-2 shrink-0">
                        {resource.format}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <School className="h-4 w-4 mr-1 shrink-0" />
                      <span className="truncate">{resource.provider}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <BookOpen className="h-4 w-4 mr-1 shrink-0" />
                      <span className="truncate">{resource.topic}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <DollarSign className="h-4 w-4 mr-1 shrink-0" />
                      <span>{formatCost(resource.cost)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Clock className="h-4 w-4 mr-1 shrink-0" />
                      <span>{resource.duration}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-1 shrink-0" />
                      <span>{resource.availability}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Globe className="h-4 w-4 mr-1 shrink-0" />
                      <span>{resource.region}</span>
                    </div>
                    
                    <div className="mt-4 mb-4">
                      <h4 className="text-sm font-semibold mb-1">Features:</h4>
                      <p className="text-xs text-muted-foreground line-clamp-3">{resource.features}</p>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Visit Resource
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No resources found</h3>
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
export default function ResourcesPage() {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      ) : (
        <ResourcesContent />
      )}
    </div>
  );
}
