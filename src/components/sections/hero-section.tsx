"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1598371839696-5c5bb00a5f4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80)',
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Animated Ink Splatter Effect */}
      <div className="absolute inset-0 z-10 opacity-40">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/30"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 2, 1.5],
            opacity: [0, 0.3, 0] 
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-2/3 right-1/3 w-40 h-40 rounded-full bg-primary/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 1],
            opacity: [0, 0.2, 0] 
          }}
          transition={{ 
            duration: 5,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-primary/25"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 2, 1],
            opacity: [0, 0.25, 0] 
          }}
          transition={{ 
            duration: 6,
            delay: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Discover the Art of 
            <span className="text-primary block mt-2">Tattoo Culture</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Connect with artists, explore styles, and join a community of tattoo enthusiasts from around the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="tattoo" className="text-lg px-8">
              <Link href="/directory" className="flex items-center">
                Find Artists
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:text-white hover:bg-white/20">
              <Link href="/styles" className="flex items-center">
                Explore Styles
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut"
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-white rounded-full mt-2"
              animate={{ 
                y: [0, 15, 0],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
