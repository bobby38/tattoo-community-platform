'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MapPin, Map, ListFilter, ExternalLink, Clock, Calendar } from 'lucide-react';
import { getProperImageUrl } from '@/lib/image-url';
import { getHybridImageUrl } from '@/lib/hybrid-image';
import { CITY_CENTERS } from '@/lib/map-data';

// Dynamically import the map component with no SSR
const MapView = dynamic(() => import('@/components/map/map-view'), { 
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-800 rounded-lg flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
  </div>
});

// Define interfaces
export interface Event {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  city: string;
  country: string;
  venue: string;
  address: string;
  lat: number;
  lng: number;
  image_url: string;
  website_url: string;
  ticket_url: string;
  organizer: string;
  artists: Artist[];
  created_at: string;
  updated_at: string;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  avatar_url: string;
}

export interface LocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'studio' | 'artist' | 'event';
  address: string;
  city: string;
  country: string;
  imageUrl?: string;
  slug?: string;
}

// Function to convert events to location data for the map
function convertEventsToLocationData(events: Event[]): LocationData[] {
  return events.map(event => ({
    id: event.id,
    name: event.name,
    lat: event.lat,
    lng: event.lng,
    type: 'event',
    address: event.address || event.venue,
    city: event.city,
    country: event.country,
    imageUrl: event.image_url,
  }));
}

// Function to format date range
function formatDateRange(event: Event): string {
  try {
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    const startDay = startDate.getDate();
    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const startYear = startDate.getFullYear();
    
    // If same day event
    if (startDate.toDateString() === endDate.toDateString()) {
      return `${startDay} ${startMonth} ${startYear}`;
    }
    
    const endDay = endDate.getDate();
    const endMonth = endDate.toLocaleString('default', { month: 'short' });
    const endYear = endDate.getFullYear();
    
    // If same month and year
    if (startMonth === endMonth && startYear === endYear) {
      return `${startDay}-${endDay} ${startMonth} ${startYear}`;
    }
    
    // If same year but different month
    if (startYear === endYear) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    }
    
    // Different years
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return 'Date TBD';
  }
}

// Client-side only component
function EventsClient() {
  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [mounted, setMounted] = useState(false);

  // Set mounted state on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && Array.isArray(data.events)) {
          const eventsData = data.events.map((event: any) => ({
            ...event,
            // Ensure lat/lng are numbers
            lat: typeof event.lat === 'string' ? parseFloat(event.lat) : event.lat,
            lng: typeof event.lng === 'string' ? parseFloat(event.lng) : event.lng
          }));
          
          setEvents(eventsData);
          const locationData = convertEventsToLocationData(eventsData);
          setLocations(locationData);
        } else {
          console.error('Unexpected data format:', data);
          setEvents([]);
          setLocations([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (mounted) {
      fetchEvents();
    }
  }, [mounted]);

  // Derived values
  const filteredEvents = selectedCountry
    ? events.filter(event => event.country === selectedCountry)
    : events;
  
  const countries = Array.isArray(events) 
    ? Array.from(new Set(events.map(event => event.country))).sort()
    : [];
  
  // Group events by month
  const eventsByMonth: Record<string, Event[]> = {};
  
  if (Array.isArray(filteredEvents)) {
    filteredEvents.forEach(event => {
      try {
        const date = new Date(event.start_date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        
        if (!eventsByMonth[monthYear]) {
          eventsByMonth[monthYear] = [];
        }
        
        eventsByMonth[monthYear].push(event);
      } catch (error) {
        console.error('Error processing event date:', error);
      }
    });
  }
  
  // Sort events within each month by start date
  if (Object.keys(eventsByMonth).length > 0) {
    Object.keys(eventsByMonth).forEach(month => {
      eventsByMonth[month].sort((a, b) => 
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );
    });
  }
  
  // Sort months chronologically
  const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
    try {
      const dateA = new Date(eventsByMonth[a][0].start_date);
      const dateB = new Date(eventsByMonth[b][0].start_date);
      return dateA.getTime() - dateB.getTime();
    } catch (error) {
      return 0;
    }
  });
  
  // If not mounted yet, show nothing to prevent hydration mismatch
  if (!mounted) {
    return null;
  }
  
  // Render event card
  const renderEventCard = (event: Event) => (
    <div 
      key={event.id}
      className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col"
    >
      <div className="relative h-48 bg-gray-800">
        {/* Placeholder */}
        <div className="w-full h-full flex items-center justify-center bg-gray-800 absolute">
          <div className="text-gray-600 text-center p-4">
            <div className="text-3xl mb-2">🔥</div>
            <div>{event.name}</div>
          </div>
        </div>
        
        {/* Image */}
        <img 
          src={getHybridImageUrl(event.image_url, 'event', event.id)}
          alt={event.name}
          className="w-full h-full object-cover absolute z-10"
          onError={(e) => {
            const target =e.target as HTMLImageElement;
            target.onerror = null;
            target.style.display = 'none'; // Hide the image on error
          }}
        />
        <div className="absolute top-2 left-2 z-20">
          <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs">
            {event.country}
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-white">{event.name}</h3>
        
        <div className="flex items-center mb-2 text-gray-300 text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDateRange(event)}
        </div>
        
        <div className="flex items-center mb-3 text-gray-300 text-sm">
          <MapPin className="h-4 w-4 mr-2" />
          {event.city}, {event.country}
        </div>
        
        {event.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
        )}
        
        <div className="mt-auto pt-4 flex gap-2">
          <Link
            href={`/events/${event.id}`}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm transition-colors flex-grow text-center"
          >
            View Details
          </Link>
          
          {event.website_url && (
            <a
              href={event.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm transition-colors flex items-center"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          
          <button
            onClick={() => {
              setViewMode('map');
              setSelectedEvent(event);
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm transition-colors flex items-center"
          >
            <MapPin className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto pt-24 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tattoo Events</h1>
        <p className="text-gray-400">
          Discover upcoming tattoo conventions, workshops, meetups, and more. Connect with the community and expand your tattoo knowledge.
        </p>
      </div>
      
      {/* View Toggle */}
      <div className="flex mb-6 bg-gray-800 rounded-md p-1 w-fit">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-md flex items-center gap-1 ${
            viewMode === 'list' 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ListFilter className="h-4 w-4" />
          List View
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded-md flex items-center gap-1 ${
            viewMode === 'map' 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Map className="h-4 w-4" />
          Map View
        </button>
      </div>
      
      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <ListFilter className="h-5 w-5 mr-2 text-orange-500" />
          <h2 className="font-bold text-lg">Filter by Country</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCountry(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCountry === null
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Countries
          </button>
          
          {countries.map(country => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCountry === country
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* List View */}
          {viewMode === 'list' && (
            <div>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : events.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <h3 className="text-xl mb-2">No events found</h3>
                  <p className="text-gray-400">Try changing your filters or check back later.</p>
                </div>
              ) : (
                <div>
                  {sortedMonths.map(month => (
                    <div key={month} className="mb-12">
                      <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">{month}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {eventsByMonth[month].map(event => renderEventCard(event))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Map View */}
          {viewMode === 'map' && (
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Left column with map and event details */}
                <div className="lg:w-2/3 space-y-4">
                  {/* Map Container */}
                  <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden h-[500px]">
                    {locations.length > 0 ? (
                      <MapView 
                        locations={locations} 
                        selectedCity={selectedCountry || undefined} 
                        selectedLocation={selectedEvent ? locations.find(loc => loc.id === selectedEvent.id) || null : null}
                        onMarkerClick={(location: LocationData) => {
                          const event = events.find(e => e.id === location.id);
                          if (event) setSelectedEvent(event);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mb-4 mx-auto">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <p className="text-gray-400">No locations to display on the map</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Selected event details below map */}
                  {selectedEvent && (
                    <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="hidden sm:block relative w-20 h-20 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={getHybridImageUrl(selectedEvent.image_url, 'event', selectedEvent.id)}
                            alt={selectedEvent.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold mb-2">{selectedEvent.name}</h3>
                          <div className="flex items-center mb-2 text-gray-300 text-sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDateRange(selectedEvent)}
                          </div>
                          <div className="flex items-center mb-3 text-gray-300 text-sm">
                            <MapPin className="h-4 w-4 mr-2" />
                            {selectedEvent.city}, {selectedEvent.country}
                          </div>
                          {selectedEvent.description && (
                            <p className="text-gray-400 text-sm mb-4">{selectedEvent.description}</p>
                          )}
                          <div className="flex gap-2">
                            {selectedEvent.website_url && (
                              <a
                                href={selectedEvent.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                              >
                                Visit Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right column with events list */}
                <div className="lg:w-1/3">
                  {/* Events List */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">All Events</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Click on an event to see details
                    </p>
                    
                    {/* List container with fixed height and scrolling */}
                    <div className="h-[600px] overflow-y-auto pr-2 space-y-2">
                      {events.map((event) => (
                        <div 
                          key={event.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedEvent && selectedEvent.id === event.id
                              ? 'bg-gray-700'
                              : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                              {event.image_url ? (
                                <img 
                                  src={getHybridImageUrl(event.image_url, 'event', event.id)}
                                  alt={event.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  🔥
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="font-medium text-sm truncate">{event.name}</h4>
                              <p className="text-xs text-gray-400 truncate">{formatDateRange(event)}</p>
                              <p className="text-xs text-gray-400 truncate">{event.city}, {event.country}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Main component - pure client-side rendering
export default function EventsPage() {
  return <EventsClient />;
}
