"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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

// Mock data for gallery images
const mockGalleryItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Japanese Dragon Sleeve",
    artist: "Akira Tanaka",
    style: "Japanese",
    tags: ["dragon", "sleeve", "color"],
    likes: 128,
    comments: 24,
    featured: true,
    uploadDate: "2023-10-15"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Geometric Wolf",
    artist: "Miguel Rodriguez",
    style: "Neo-Traditional",
    tags: ["wolf", "geometric", "blackwork"],
    likes: 95,
    comments: 12,
    featured: false,
    uploadDate: "2023-09-22"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Floral Shoulder Piece",
    artist: "Sarah Chen",
    style: "Watercolor",
    tags: ["flowers", "shoulder", "color"],
    likes: 156,
    comments: 18,
    featured: true,
    uploadDate: "2023-08-05"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1571805341302-f857308690e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Traditional Rose",
    artist: "Akira Tanaka",
    style: "Traditional",
    tags: ["rose", "hand", "color"],
    likes: 87,
    comments: 9,
    featured: false,
    uploadDate: "2023-07-12"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1611501355759-dda0909820bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Blackwork Mandala",
    artist: "Miguel Rodriguez",
    style: "Blackwork",
    tags: ["mandala", "back", "blackwork"],
    likes: 210,
    comments: 32,
    featured: true,
    uploadDate: "2023-06-30"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1560707854-fb9a10ced4e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Watercolor Abstract",
    artist: "Sarah Chen",
    style: "Watercolor",
    tags: ["abstract", "color", "thigh"],
    likes: 175,
    comments: 21,
    featured: false,
    uploadDate: "2023-05-18"
  }
];

export default function GallerySection() {
  const [gallery, setGallery] = useState(mockGalleryItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [isAddImageOpen, setIsAddImageOpen] = useState(false);
  const [newImage, setNewImage] = useState({
    title: "",
    artist: "",
    style: "",
    tags: ""
  });
  
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

  const handleAddImage = () => {
    // In a real app, you would save to the database here
    const newId = Math.max(...gallery.map(item => item.id)) + 1;
    const imageToAdd = {
      id: newId,
      image: "https://placehold.co/600x400/333/white?text=New+Image",
      title: newImage.title,
      artist: newImage.artist,
      style: newImage.style,
      tags: newImage.tags.split(',').map(tag => tag.trim()),
      likes: 0,
      comments: 0,
      featured: false,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    setGallery([...gallery, imageToAdd]);
    setIsAddImageOpen(false);
    setNewImage({
      title: "",
      artist: "",
      style: "",
      tags: ""
    });
  };

  const handleDeleteImage = (id: number) => {
    setGallery(gallery.filter(item => item.id !== id));
  };

  const handleToggleFeatured = (id: number) => {
    setGallery(gallery.map(item => 
      item.id === id ? { ...item, featured: !item.featured } : item
    ));
  };

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
          <Dialog open={isAddImageOpen} onOpenChange={setIsAddImageOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Image</DialogTitle>
                <DialogDescription>
                  Add a new tattoo image to your studio gallery.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG or WEBP (max. 5MB)
                    </p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={newImage.title} 
                    onChange={(e) => setNewImage({...newImage, title: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="artist">Artist</Label>
                  <Select onValueChange={(value) => setNewImage({...newImage, artist: value})}>
                    <SelectTrigger id="artist">
                      <SelectValue placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Akira Tanaka">Akira Tanaka</SelectItem>
                      <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                      <SelectItem value="Miguel Rodriguez">Miguel Rodriguez</SelectItem>
                      <SelectItem value="Jade Kim">Jade Kim</SelectItem>
                      <SelectItem value="David Wilson">David Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="style">Style</Label>
                  <Select onValueChange={(value) => setNewImage({...newImage, style: value})}>
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Traditional">Traditional</SelectItem>
                      <SelectItem value="Neo-Traditional">Neo-Traditional</SelectItem>
                      <SelectItem value="Blackwork">Blackwork</SelectItem>
                      <SelectItem value="Watercolor">Watercolor</SelectItem>
                      <SelectItem value="Fine Line">Fine Line</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    value={newImage.tags} 
                    onChange={(e) => setNewImage({...newImage, tags: e.target.value})} 
                    placeholder="e.g. dragon, sleeve, color"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddImageOpen(false)}>Cancel</Button>
                <Button onClick={handleAddImage}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Images</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.length > 0 ? (
              filteredGallery.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                    />
                    {item.featured && (
                      <Badge className="absolute top-2 left-2 bg-primary">
                        Featured
                      </Badge>
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
                      <Badge variant="outline">{item.style}</Badge>
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
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
            ) : (
              <div className="col-span-3 text-center py-12">
                <h3 className="text-lg font-medium mb-2">No images found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No images matching "${searchQuery}" found.` 
                    : "No images in this category yet."}
                </p>
                <Button onClick={() => setIsAddImageOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
