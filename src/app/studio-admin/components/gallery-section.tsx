"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UploadDialog } from './upload-dialog';
import { 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  MessageCircle,
  Download
} from 'lucide-react';

// Define the GalleryItem type
interface GalleryItem {
  id: string;
  image: string;
  title: string;
  artist: string;
  style: string;
  tags: string[];
  likes: number;
  comments: number;
  featured: boolean;
  uploadDate: string;
}

// Helper function to ensure image URLs use the custom domain
const getProperImageUrl = (url: string) => {
  if (!url) return '/placeholder-image.jpg';
  
  // If it's already using the custom domain or is a local URL, return as is
  if (url.includes('imagetat.getrezult.com') || url.startsWith('/')) {
    return url;
  }
  
  // If it's using the old R2 domain, convert it to the custom domain
  if (url.includes('r2.dev')) {
    const urlParts = url.split('/');
    // The path is everything after the domain part (which is at index 2)
    const pathAndFilename = urlParts.slice(3).join('/');
    
    // Use the custom domain
    return `https://imagetat.getrezult.com/${pathAndFilename}`;
  }
  
  // Handle local paths
  if (url.startsWith('/uploads/')) {
    // Extract the path and filename
    const pathParts = url.split('/uploads/');
    if (pathParts.length > 1) {
      const pathAndFilename = pathParts[1].replace(/^\/+/, ''); // Remove leading slashes
      return `https://imagetat.getrezult.com/${pathAndFilename}`;
    }
  }
  
  // Otherwise, return the URL as is
  return url;
};

// Image component with error handling
const GalleryImage = ({ src, alt }: { src: string; alt: string }) => {
  const [error, setError] = useState(false);
  const imgSrc = error ? '/placeholder-image.jpg' : getProperImageUrl(src);
  
  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      onError={() => setError(true)}
      className="w-full h-48 object-cover rounded-t-lg"
    />
  );
};

export default function GallerySection() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [isAddImageOpen, setIsAddImageOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key to force re-fetch

  // Fetch gallery items from the database
  const fetchGalleryItems = useCallback(async () => {
    console.log('🔍 [Gallery] Fetching gallery items...');
    setIsLoading(true);
    
    try {
      // Add a cache-busting parameter to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/gallery?t=${timestamp}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('❌ [Gallery] API error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch gallery items');
      }
      
      const data = await response.json();
      console.log('✅ [Gallery] Fetched gallery items:', data.length);
      
      // Map the API response to the expected gallery item format
      const processedItems = data.map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled',
        artist: item.artist || 'Unknown Artist',
        style: item.style || 'Other',
        tags: Array.isArray(item.tags) ? item.tags : [],
        image: item.imageUrl, // Use imageUrl from the API response
        featured: false,
        uploadDate: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '',
        likes: 0,
        comments: 0
      }));
      
      console.log('✅ [Gallery] Processed gallery items:', processedItems.length);
      setGallery(processedItems);
    } catch (error) {
      console.error('❌ [Gallery] Error fetching gallery items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load gallery items on component mount and when refreshKey changes
  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems, refreshKey]);

  // Refresh gallery function to be called after successful upload
  const refreshGallery = useCallback(() => {
    console.log('🔄 [Gallery] Refreshing gallery...');
    setRefreshKey(prevKey => prevKey + 1); // Increment refresh key to trigger re-fetch
  }, []);

  // Handle new upload
  const handleAddImage = (imageData: {
    title: string;
    artist: string;
    style: string;
    tags: string[];
    image: string;
  }) => {
    // Refresh the gallery
    refreshGallery();
  };

  const handleDeleteImage = (id: number | string) => {
    // Delete the image from the database
    const deleteImage = async () => {
      try {
        const response = await fetch(`/api/gallery?id=${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete gallery item');
        }
        
        // Remove from local state
        setGallery(gallery.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting gallery item:', error);
      }
    };
    
    deleteImage();
  };

  const handleToggleFeatured = (id: string) => {
    setGallery(gallery.map(item => 
      item.id === id ? { ...item, featured: !item.featured } : item
    ));
  };

  // Filter gallery items based on search query, active tab, and selected style
  const filteredGallery = gallery.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "featured" && item.featured);
    
    const matchesStyle = 
      selectedStyle === "all" || 
      item.style === selectedStyle;
    
    return matchesSearch && matchesTab && matchesStyle;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search gallery..."
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
              <SelectItem value="Traditional">Traditional</SelectItem>
              <SelectItem value="Neo-Traditional">Neo-Traditional</SelectItem>
              <SelectItem value="Blackwork">Blackwork</SelectItem>
              <SelectItem value="Watercolor">Watercolor</SelectItem>
              <SelectItem value="Fine Line">Fine Line</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddImageOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          
          {/* Replace the old Dialog with our new UploadDialog component */}
          <UploadDialog 
            open={isAddImageOpen}
            onOpenChange={setIsAddImageOpen}
            onUpload={handleAddImage}
            onUploadComplete={refreshGallery}
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Images</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-4 w-3/4 bg-muted animate-pulse mb-2"></div>
                    <div className="h-3 w-1/2 bg-muted animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : filteredGallery.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No gallery items found. Try adjusting your filters or add a new image.</p>
              </div>
            ) : (
              filteredGallery.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative">
                    <GalleryImage src={item.image} alt={item.title} />
                    {item.featured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500">Featured</Badge>
                    )}
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>by {item.artist}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(item.id)}>
                            {item.featured ? (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Remove from Featured
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Add to Featured
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteImage(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline">{item.style || 'No Style'}</Badge>
                      {item.tags && Array.isArray(item.tags) ? item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      )) : null}
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex space-x-3">
                        <div className="flex items-center">
                          <Heart className="mr-1 h-4 w-4" />
                          {item.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          {item.comments}
                        </div>
                      </div>
                      <div>
                        {item.uploadDate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
