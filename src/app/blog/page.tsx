"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock blog posts
const BLOG_POSTS = [
  {
    id: '1',
    title: 'The History of Traditional Japanese Tattooing',
    excerpt: 'Explore the rich cultural heritage and techniques behind traditional Japanese tattoo art, from its ancient origins to modern interpretations.',
    coverImage: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    date: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
    author: 'Tattoo Historian',
    readTime: '8 min read'
  },
  {
    id: '2',
    title: 'Caring for Your New Tattoo: Essential Aftercare Tips',
    excerpt: 'A comprehensive guide to tattoo aftercare, ensuring your new ink heals properly and stays vibrant for years to come.',
    coverImage: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    date: new Date(Date.now() - 14 * 86400000).toISOString(), // 14 days ago
    author: 'Tattoo Care Specialist',
    readTime: '5 min read'
  },
  {
    id: '3',
    title: 'The Rise of Geometric Tattoo Designs',
    excerpt: 'How geometric patterns and sacred geometry have influenced modern tattoo art, creating a new wave of minimalist and meaningful designs.',
    coverImage: 'https://images.unsplash.com/photo-1597217270402-b5a73eba9d24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    date: new Date(Date.now() - 21 * 86400000).toISOString(), // 21 days ago
    author: 'Geometric Art Expert',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'Finding the Right Artist for Your Tattoo',
    excerpt: 'Tips for researching, interviewing, and selecting the perfect tattoo artist for your unique style and vision.',
    coverImage: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    date: new Date(Date.now() - 28 * 86400000).toISOString(), // 28 days ago
    author: 'Tattoo Consultant',
    readTime: '7 min read'
  },
  {
    id: '5',
    title: 'The Psychology of Tattoos: Why We Ink',
    excerpt: 'Exploring the psychological motivations behind tattoos, from self-expression and commemoration to rites of passage and cultural identity.',
    coverImage: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    date: new Date(Date.now() - 35 * 86400000).toISOString(), // 35 days ago
    author: 'Tattoo Psychologist',
    readTime: '10 min read'
  },
  {
    id: '6',
    title: 'Tattoo Trends to Watch in 2025',
    excerpt: 'From innovative techniques to emerging styles, these are the tattoo trends that will define the art form in the coming year.',
    coverImage: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    date: new Date(Date.now() - 42 * 86400000).toISOString(), // 42 days ago
    author: 'Trend Forecaster',
    readTime: '9 min read'
  }
];

export default function BlogPage() {
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Tattoo Blog</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Insights, guides, and stories from the world of tattoo art and culture. Stay informed and inspired.
        </p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {BLOG_POSTS.map((post) => (
          <motion.div key={post.id} variants={itemVariants}>
            <Link href={`/blog/${post.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="text-sm font-medium">
                    By {post.author}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
