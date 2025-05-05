'use client';

import React from 'react';

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

interface BasicMonthViewProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

// Simple function to format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Simple function to get month name
const getMonthName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long'
  });
};

const BasicMonthView: React.FC<BasicMonthViewProps> = ({ events, onEventClick }) => {
  // Group events by month (simple approach)
  const eventsByMonth: Record<string, Event[]> = {};
  
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );
  
  // Group events by month
  sortedEvents.forEach(event => {
    const monthKey = getMonthName(event.start_date);
    if (!eventsByMonth[monthKey]) {
      eventsByMonth[monthKey] = [];
    }
    eventsByMonth[monthKey].push(event);
  });
  
  // Get sorted month keys
  const monthKeys = Object.keys(eventsByMonth).sort((a, b) => {
    const dateA = new Date(eventsByMonth[a][0].start_date);
    const dateB = new Date(eventsByMonth[b][0].start_date);
    return dateA.getTime() - dateB.getTime();
  });
  
  if (monthKeys.length === 0) {
    return <div className="p-4 text-center">No events found</div>;
  }
  
  return (
    <div>
      {monthKeys.map(month => (
        <div key={month} className="mb-8">
          <h2 className="text-xl font-bold mb-4 bg-blue-600 p-3 rounded-md">{month}</h2>
          <div className="space-y-4">
            {eventsByMonth[month].map(event => (
              <div 
                key={event.id} 
                className="bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-gray-700"
                onClick={() => onEventClick && onEventClick(event)}
              >
                <h3 className="text-lg font-semibold">{event.name}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {formatDate(event.start_date)}
                  {event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
                </p>
                <p className="text-sm text-gray-400">{event.venue}, {event.city}, {event.country}</p>
                <button 
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick && onEventClick(event);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BasicMonthView;
