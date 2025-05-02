"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Upload, 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Edit,
  Trash2,
  Download
} from 'lucide-react';

// Mock data for gallery images
const mockGalleryItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Japanese Dragon Sleeve",
    description: "Traditional Japanese dragon design by Master Taki",
    likes: 128,
    comments: 24,
    saved: true,
    date: "2023-10-15"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Geometric Wolf",
    description: "Modern geometric wolf design on forearm",
    likes: 95,
    comments: 12,
    saved: false,
    date: "2023-09-22"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Floral Shoulder Piece",
    description: "Botanical design with peonies and butterflies",
    likes: 156,
    comments: 18,
    saved: true,
    date: "2023-08-05"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1571805341302-f857308690e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Traditional Rose",
    description: "Old school rose tattoo on hand",
    likes: 87,
    comments: 9,
    saved: false,
    date: "2023-07-12"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1611501355759-dda0909820bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Blackwork Mandala",
    description: "Intricate blackwork mandala on back",
    likes: 210,
    comments: 32,
    saved: true,
    date: "2023-06-30"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1560707854-fb9a10ced4e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Watercolor Abstract",
    description: "Colorful watercolor style abstract design",
    likes: 175,
    comments: 21,
    saved: false,
    date: "2023-05-18"
  }
];

// Mock data for saved designs
const mockSavedDesigns = [
  {
    id: 101,
    image: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Polynesian Tribal",
    artist: "Mako Designs",
    saved: true,
    date: "2023-10-10"
  },
  {
    id: 102,
    image: "https://images.unsplash.com/photo-1611501358341-e5c47fa0223f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Minimalist Line Art",
    artist: "Simple Ink Studio",
    saved: true,
    date: "2023-09-15"
  },
  {
    id: 103,
    image: "https://images.unsplash.com/photo-1590246815118-2c8ee3d35980?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Neo-Traditional Fox",
    artist: "Color Theory Tattoos",
    saved: true,
    date: "2023-08-22"
  },
  {
    id: 104,
    image: "https://images.unsplash.com/photo-1612246964233-34b2b7b7d8e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    title: "Dotwork Skull",
    artist: "Precision Ink",
    saved: true,
    date: "2023-07-30"
  }
];

export default function GallerySection() {
  const [activeTab, setActiveTab] = useState("my-tattoos");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Gallery</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload New
        </Button>
      </div>

      <Tabs defaultValue="my-tattoos" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-tattoos">My Tattoos</TabsTrigger>
          <TabsTrigger value="saved-designs">Saved Designs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-tattoos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockGalleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
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
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex space-x-3">
                    <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                      <Heart className={`mr-1 h-4 w-4 ${item.saved ? "fill-primary text-primary" : ""}`} />
                      {item.likes}
                    </button>
                    <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                      <MessageCircle className="mr-1 h-4 w-4" />
                      {item.comments}
                    </button>
                    <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                      <Share2 className="mr-1 h-4 w-4" />
                    </button>
                  </div>
                  <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                    <Bookmark className={`h-4 w-4 ${item.saved ? "fill-primary text-primary" : ""}`} />
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="saved-designs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSavedDesigns.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>By {item.artist}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Heart className="mr-2 h-4 w-4" />
                          Like
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Bookmark className="mr-2 h-4 w-4" />
                          Unsave
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Saved on {item.date}
                  </div>
                  <button className="flex items-center text-sm text-primary">
                    <Bookmark className="h-4 w-4 fill-primary" />
                  </button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add New Card */}
            <Card className="flex flex-col items-center justify-center h-64 border-dashed">
              <Button variant="ghost" className="h-20 w-20 rounded-full">
                <Plus className="h-10 w-10 text-muted-foreground" />
              </Button>
              <p className="mt-4 text-muted-foreground">Browse More Designs</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
