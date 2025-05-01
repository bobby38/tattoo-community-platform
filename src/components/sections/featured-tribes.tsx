"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users } from 'lucide-react';
import { Tribe } from '@/types';

const FeaturedTribes = () => {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTribes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tribes');
        
        if (!response.ok) {
          throw new Error(`Error fetching tribes: ${response.status}`);
        }
        
        const data = await response.json();
        setTribes(data);
      } catch (err) {
        console.error('Failed to fetch tribes:', err);
        setError('Failed to load tattoo tribes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTribes();
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
          <h2 className="text-3xl font-bold mb-2">Join Tattoo Tribes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
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

  // No tribes found
  if (tribes.length === 0) {
    return null; // Don't render the section if no tribes
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Join Tattoo Tribes</h2>
            <p className="text-muted-foreground max-w-2xl">
              Connect with like-minded tattoo enthusiasts in communities centered around specific styles and cultural traditions.
            </p>
          </div>
          <Link href="/tribes" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All Tribes
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
          {tribes.map((tribe) => (
            <motion.div key={tribe.id} variants={itemVariants}>
              <Link href={`/tribes/${tribe.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {tribe.icon_url ? (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <img 
                            src={tribe.icon_url} 
                            alt={tribe.name} 
                            className="w-8 h-8"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold">{tribe.name}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {tribe.description || `Join the ${tribe.name} tribe to connect with artists and enthusiasts who share your passion.`}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-primary">Join Tribe</span>
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

export default FeaturedTribes;
