"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { TattooStyle } from '@/types';

const FeaturedStyles = () => {
  const [styles, setStyles] = useState<TattooStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/styles');
        
        if (!response.ok) {
          throw new Error(`Error fetching styles: ${response.status}`);
        }
        
        const data = await response.json();
        setStyles(data);
      } catch (err) {
        console.error('Failed to fetch styles:', err);
        setError('Failed to load tattoo styles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStyles();
  }, []);
  
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

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Explore Tattoo Styles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Oops!</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Explore Tattoo Styles</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover the rich diversity of tattoo artistry through these distinctive styles, each with its own history and aesthetic.
            </p>
          </div>
          <Link href="/styles" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All Styles
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {styles.slice(0, 6).map((style) => (
            <motion.div key={style.id} variants={itemVariants}>
              <Link href={`/styles/${style.slug}`}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {style.imageUrl ? (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${style.imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500 text-lg">{style.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className={`text-xl font-bold ${style.imageUrl ? 'text-white' : 'text-gray-800'} mb-1`}>
                        {style.name}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground line-clamp-2">
                      {style.description || `Explore the ${style.name} tattoo style and find artists specializing in this aesthetic.`}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-primary">Explore Style</span>
                      <ChevronRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedStyles;
