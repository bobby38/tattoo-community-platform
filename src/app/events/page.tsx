'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

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
    address: event.address,
    city: event.city,
    country: event.country,
    imageUrl: event.image_url,
  }));
}

// Function to format date range
function formatDateRange(event: Event): string {
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
}

// Main component
export default function EventsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state to force client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Fetch events data
  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        const data = await response.json();
        
        if (data.events) {
          // Filter events from today (May 5, 2025) onward
          const today = new Date(2025, 4, 5); // May 5, 2025
          const futureEvents = data.events.filter((event: Event) => {
            const eventDate = new Date(event.start_date);
            return eventDate >= today;
          });
          
          setEvents(futureEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEvents();
  }, []);
  
  // Filter events by country
  const filteredEvents = selectedCountry
    ? events.filter(event => event.country === selectedCountry)
    : events;
  
  // Get unique countries for the filter
  const countries = Array.from(new Set(events.map(event => event.country))).sort();
  
  // Convert events to location data for the map
  const locations = convertEventsToLocationData(filteredEvents);
  
  // Group events by month for the list view
  const eventsByMonth: Record<string, Event[]> = {};
  
  filteredEvents.forEach(event => {
    const date = new Date(event.start_date);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    
    if (!eventsByMonth[monthYear]) {
      eventsByMonth[monthYear] = [];
    }
    
    eventsByMonth[monthYear].push(event);
  });
  
  // Sort events within each month by start date
  Object.keys(eventsByMonth).forEach(month => {
    eventsByMonth[month].sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
  });
  
  // Sort months chronologically
  const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
    const dateA = new Date(eventsByMonth[a][0].start_date);
    const dateB = new Date(eventsByMonth[b][0].start_date);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Render artists for an event
  const renderArtists = (artists: Artist[]) => {
    if (!artists || artists.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {artists.map(artist => (
          <Link 
            key={artist.id} 
            href={`/artists/${artist.slug}`}
            className="inline-flex items-center px-2 py-1 bg-gray-700 rounded-full text-xs hover:bg-gray-600 transition-colors"
          >
            {artist.avatar_url && (
              <img 
                src={artist.avatar_url} 
                alt={artist.name} 
                className="w-4 h-4 rounded-full mr-1 object-cover"
              />
            )}
            {artist.name}
          </Link>
        ))}
      </div>
    );
  };
  
  // Render event card
  const renderEventCard = (event: Event) => (
    <div 
      key={event.id}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative">
        <img 
          src={event.image_url || '/images/events/event-placeholder.jpg'} 
          alt={event.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs">
            {formatDateRange(event)}
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
            {event.country}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-white">{event.name}</h3>
        
        <div className="flex items-start mb-2">
          <div className="text-gray-300 text-sm flex-1">
            <div className="mb-1">
              <span className="font-medium">{event.venue}</span>
            </div>
            <div>
              {event.city}, {event.country}
            </div>
          </div>
        </div>
        
        {renderArtists(event.artists)}
        
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setSelectedEvent(event)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            View Details
          </button>
          
          {event.ticket_url && (
            <a
              href={event.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Tickets
            </a>
          )}
        </div>
      </div>
    </div>
  );
  
  // Don't render anything on the server to avoid hydration issues
  if (!isMounted) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tattoo Events</h1>
          <p className="text-gray-400">
            Discover upcoming tattoo conventions, exhibitions, and gatherings around the world
          </p>
        </div>
        
        {/* Filters and View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Country Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCountry(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCountry === null
                  ? 'bg-blue-600 text-white'
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
          
          {/* View Toggle */}
          <div className="flex rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Map View
            </button>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-8">
                {sortedMonths.length > 0 ? (
                  sortedMonths.map(month => (
                    <div key={month}>
                      <h2 className="text-2xl font-bold mb-4 text-blue-400">{month}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {eventsByMonth[month].map(event => renderEventCard(event))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-400">No events found</p>
                    {selectedCountry && (
                      <button
                        onClick={() => setSelectedCountry(null)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Show All Countries
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Map View */}
            {viewMode === 'map' && (
              <div className="bg-gray-800 rounded-lg overflow-hidden h-[600px]">
                <MapView 
                  locations={locations} 
                  selectedLocation={selectedEvent ? locations.find(loc => loc.id === selectedEvent.id) || null : null}
                  onMarkerClick={(location: LocationData) => {
                    const event = events.find(e => e.id === location.id);
                    if (event) setSelectedEvent(event);
                  }}
                />
              </div>
            )}
          </>
        )}
        
        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img 
                  src={selectedEvent.image_url || '/images/event-placeholder.jpg'} 
                  alt={selectedEvent.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedEvent.name}</h2>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    {formatDateRange(selectedEvent)}
                  </div>
                  <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    {selectedEvent.city}, {selectedEvent.country}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Location</h3>
                  <p className="text-gray-300">{selectedEvent.venue}</p>
                  <p className="text-gray-300">{selectedEvent.address}</p>
                </div>
                
                {selectedEvent.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-gray-300 whitespace-pre-line">{selectedEvent.description}</p>
                  </div>
                )}
                
                {selectedEvent.artists && selectedEvent.artists.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Featured Artists</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {selectedEvent.artists.map(artist => (
                        <Link 
                          key={artist.id} 
                          href={`/artists/${artist.slug}`}
                          className="flex flex-col items-center bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <img 
                            src={artist.avatar_url || '/images/avatar-placeholder.jpg'} 
                            alt={artist.name} 
                            className="w-16 h-16 rounded-full object-cover mb-2"
                          />
                          <span className="text-sm text-center">{artist.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-3">
                  {selectedEvent.website_url && (
                    <a
                      href={selectedEvent.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Official Website
                    </a>
                  )}
                  
                  {selectedEvent.ticket_url && (
                    <a
                      href={selectedEvent.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Buy Tickets
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
