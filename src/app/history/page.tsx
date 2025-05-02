"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Globe, BookOpen } from 'lucide-react';

export default function HistoryPage() {
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Ancient tattoo tools"
          className="absolute inset-0 w-full h-full object-cover object-center -z-10"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80 -z-10"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              The Rich History of <span className="text-primary">Tattoo Art</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Exploring the cultural significance and evolution of tattooing across civilizations and centuries
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Breadcrumb */}
      <div className="bg-muted py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Tattoo History</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Timeline Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Timeline</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#ancient" className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Ancient Origins (3000 BCE)</span>
                      </a>
                    </li>
                    <li>
                      <a href="#traditional" className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                        <Globe className="mr-2 h-4 w-4" />
                        <span>Traditional Practices</span>
                      </a>
                    </li>
                    <li>
                      <a href="#modern" className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Modern Revival</span>
                      </a>
                    </li>
                    <li>
                      <a href="#contemporary" className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Contemporary Art</span>
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <motion.div variants={itemVariants} id="ancient" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">Ancient Origins</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p>
                    The practice of tattooing dates back thousands of years, with evidence of tattoos found on mummified remains from as early as 3000 BCE. The oldest discovered tattooed human skin was found on Ötzi the Iceman, dating to between 3370 and 3100 BCE.
                  </p>
                  <p>
                    Ancient cultures across the globe, from Egypt to China, Japan, and Polynesia, practiced tattooing for various purposes including religious ceremonies, rites of passage, symbols of status, and as talismans for protection.
                  </p>
                </div>
                <div className="mt-6 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Ancient tattoo artifacts" 
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} id="traditional" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">Traditional Practices</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p>
                    Traditional tattooing methods varied widely across cultures. Hand-tapping techniques were common in Polynesian and Japanese traditions, while hand-poking methods were used in many indigenous cultures.
                  </p>
                  <p>
                    These traditional methods often involved natural pigments and tools made from bone, wood, and other natural materials. The designs and patterns were deeply symbolic, representing tribal affiliations, personal achievements, and spiritual beliefs.
                  </p>
                </div>
                <div className="mt-6 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Traditional tattooing tools" 
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} id="modern" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">Modern Revival</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p>
                    The modern era of tattooing began in the late 19th century with the invention of the electric tattoo machine by Samuel O'Reilly in 1891, based on Thomas Edison's electric pen.
                  </p>
                  <p>
                    This technological advancement revolutionized the art form, making tattooing faster, less painful, and more accessible. The 20th century saw tattooing evolve from a practice associated primarily with sailors, criminals, and the counterculture to a mainstream form of self-expression.
                  </p>
                </div>
                <div className="mt-6 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1607461194891-3b208b8f47ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Modern tattoo studio" 
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} id="contemporary" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-6">Contemporary Art</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p>
                    Today, tattooing is recognized as a legitimate art form with diverse styles and techniques. From traditional American and Japanese styles to watercolor, geometric, and hyperrealistic approaches, contemporary tattoo artists push the boundaries of what's possible on skin.
                  </p>
                  <p>
                    The cultural perception of tattoos has dramatically shifted, with tattoos now celebrated in fine art galleries, museums, and popular culture. The future of tattooing continues to evolve with innovations in ink formulation, techniques, and even temporary and digital tattoo technologies.
                  </p>
                </div>
                <div className="mt-6 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1597217270402-b5a73eba9d24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Contemporary tattoo art" 
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Explore Tattoo Styles</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Discover the diverse range of tattoo styles that have evolved throughout history and find the perfect style for your next piece.
          </p>
          <Button size="lg" variant="tattoo">
            <Link href="/styles" className="flex items-center">
              Browse Styles
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
