'use client';

import React, { useEffect, useState } from 'react';
import moment from 'moment';

// Define Event interface
interface Event {
  id: number;
  name: string;
  country: string;
  city: string;
  venue: string;
  address: string;
  lat: number;
  lng: number;
  start_date: string;
  end_date: string;
  description: string;
  website: string;
  ticket_price: number | null;
  currency: string;
  featured_artists: string[];
  social: {
    instagram: string | null;
    facebook: string | null;
    twitter: string | null;
  };
  image_url?: string;
}

interface MonthListViewProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const MonthListView: React.FC<MonthListViewProps> = ({ events, onEventClick }) => {
  const [groupedEvents, setGroupedEvents] = useState<Record<string, { name: string; events: Event[] }>>({});
  const [sortedMonths, setSortedMonths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log('MonthListView: Processing events', events);
    setIsLoading(true);
    
    try {
      // Group events by month
      const groups = events.reduce((acc, event) => {
        if (!event.start_date) {
          console.warn('Event missing start_date:', event);
          return acc;
        }
        
        const monthKey = moment(event.start_date).format('YYYY-MM');
        const monthName = moment(event.start_date).format('MMMM YYYY');
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            name: monthName,
            events: []
          };
        }
        
        acc[monthKey].events.push(event);
        return acc;
      }, {} as Record<string, { name: string; events: Event[] }>);
      
      // Sort months chronologically
      const months = Object.keys(groups).sort();
      
      console.log('MonthListView: Grouped events by month', groups);
      console.log('MonthListView: Sorted months', months);
      
      setGroupedEvents(groups);
      setSortedMonths(months);
    } catch (error) {
      console.error('Error processing events:', error);
    } finally {
      setIsLoading(false);
    }
  }, [events]);
  
  // Format date range
  const formatDateRange = (event: Event) => {
    try {
      const startDate = moment(event.start_date).format('MMM D');
      const endDate = moment(event.end_date).format('MMM D, YYYY');
      
      if (event.start_date === event.end_date) {
        return moment(event.start_date).format('MMM D, YYYY');
      }
      
      return `${startDate} - ${endDate}`;
    } catch (error) {
      console.error('Error formatting date range:', error);
      return 'Date not available';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (sortedMonths.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-400">No events found for the selected filters.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {sortedMonths.map(monthKey => (
        <div key={monthKey} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-blue-600 px-6 py-3">
            <h3 className="text-xl font-bold text-white">{groupedEvents[monthKey].name}</h3>
          </div>
          
          <div className="divide-y divide-gray-700">
            {groupedEvents[monthKey].events
              .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
              .map(event => (
                <div 
                  key={event.id} 
                  className="p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onEventClick && onEventClick(event)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">{event.name}</h4>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{formatDateRange(event)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{event.venue}, {event.city}, {event.country}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 md:mt-0">
                      <button 
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick && onEventClick(event);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthListView;
