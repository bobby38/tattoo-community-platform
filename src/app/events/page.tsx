"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Filter,
  Search
} from 'lucide-react';
import { format } from 'date-fns';

// Mock events data
const EVENTS_DATA = [
  {
    id: '1',
    title: 'San Francisco Tattoo Expo 2025',
    description: 'The annual SF Tattoo Expo brings together top artists from around the world for a weekend of tattoo art, workshops, and competitions.',
    imageUrl: 'https://images.unsplash.com/photo-1607461194891-3b208b8f47ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    startDate: new Date(2025, 5, 15).toISOString(), // June 15, 2025
    endDate: new Date(2025, 5, 17).toISOString(), // June 17, 2025
    location: 'Moscone Center, San Francisco, CA',
    organizer: 'SF Tattoo Association',
    attendees: 1250,
    category: 'Convention'
  },
  {
    id: '2',
    title: 'Japanese Irezumi Workshop',
    description: 'Learn the traditional techniques and cultural significance of Japanese Irezumi tattooing in this hands-on workshop led by master artist Takeshi Yamada.',
    imageUrl: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    startDate: new Date(2025, 6, 8).toISOString(), // July 8, 2025
    endDate: new Date(2025, 6, 9).toISOString(), // July 9, 2025
    location: 'Tokyo Tattoo Academy, Online',
    organizer: 'Japanese Tattoo Preservation Society',
    attendees: 75,
    category: 'Workshop'
  },
  {
    id: '3',
    title: 'Blackwork Tribe Meetup',
    description: 'Connect with fellow blackwork enthusiasts to share ideas, techniques, and inspiration. Open to artists and collectors alike.',
    imageUrl: 'https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    startDate: new Date(2025, 7, 22).toISOString(), // August 22, 2025
    endDate: new Date(2025, 7, 22).toISOString(), // August 22, 2025
    location: 'Dark Arts Gallery, Portland, OR',
    organizer: 'Blackwork Enthusiasts Tribe',
    attendees: 45,
    category: 'Meetup'
  },
  {
    id: '4',
    title: 'Tattoo History Lecture Series',
    description: 'A four-part lecture series exploring the global history of tattooing from ancient civilizations to modern practices.',
    imageUrl: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    startDate: new Date(2025, 8, 5).toISOString(), // September 5, 2025
    endDate: new Date(2025, 8, 26).toISOString(), // September 26, 2025
    location: 'Museum of Anthropology, Virtual Event',
    organizer: 'Tattoo Cultural Heritage Foundation',
    attendees: 320,
    category: 'Educational'
  },
  {
    id: '5',
    title: 'Geometric Tattoo Design Contest',
    description: 'Submit your best geometric tattoo designs for a chance to win prizes and recognition from industry leaders.',
    imageUrl: 'https://images.unsplash.com/photo-1597217270402-b5a73eba9d24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    startDate: new Date(2025, 9, 10).toISOString(), // October 10, 2025
    endDate: new Date(2025, 9, 30).toISOString(), // October 30, 2025
    location: 'Online Submission',
    organizer: 'Geometric Art Collective',
    attendees: 180,
    category: 'Contest'
  },
  {
    id: '6',
    title: 'Tattoo Artist Showcase Night',
    description: 'An evening showcasing the work of emerging tattoo artists, with live demonstrations, portfolio reviews, and networking opportunities.',
    imageUrl: 'https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    startDate: new Date(2025, 10, 15).toISOString(), // November 15, 2025
    endDate: new Date(2025, 10, 15).toISOString(), // November 15, 2025
    location: 'Ink Gallery, New York, NY',
    organizer: 'NYC Tattoo Guild',
    attendees: 95,
    category: 'Showcase'
  }
];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Get unique categories for filter
  const categories = Array.from(new Set(EVENTS_DATA.map(event => event.category)));
  
  // Filter events
  const filteredEvents = activeFilter 
    ? EVENTS_DATA.filter(event => event.category === activeFilter)
    : EVENTS_DATA;
  
  // Sort events by date (soonest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
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
        
        <h1 className="text-4xl font-bold mb-4">Tattoo Events</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Discover upcoming tattoo conventions, workshops, meetups, and more. Connect with the community and expand your tattoo knowledge.
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-semibold">Filter by Category</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeFilter === null ? "default" : "outline"} 
            onClick={() => setActiveFilter(null)}
            className="mb-2"
          >
            All Events
          </Button>
          
          {categories.map(category => (
            <Button 
              key={category} 
              variant={activeFilter === category ? "default" : "outline"}
              onClick={() => setActiveFilter(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Events List */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedEvents.map((event) => (
          <motion.div key={event.id} variants={itemVariants}>
            <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {format(new Date(event.startDate), 'MMM d, yyyy')}
                        {event.startDate !== event.endDate && 
                          ` - ${format(new Date(event.endDate), 'MMM d, yyyy')}`
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.attendees} attendees</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  </CardContent>
                  
                  <CardFooter className="px-6 py-4 border-t flex justify-between">
                    <div className="text-sm font-medium">
                      By {event.organizer}
                    </div>
                    <Button size="sm">View Details</Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
