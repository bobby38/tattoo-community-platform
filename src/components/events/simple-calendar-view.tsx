'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

// Define the Event interface
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

// Define the CalendarEvent interface
interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: any;
}

interface SimpleCalendarViewProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const SimpleCalendarView: React.FC<SimpleCalendarViewProps> = ({ events, onEventClick }) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [mounted, setMounted] = useState(false);

  // Convert events to calendar events format
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const formattedEvents = events.map(event => ({
        id: event.id,
        title: event.name,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        allDay: true,
        resource: event
      }));
      
      setCalendarEvents(formattedEvents);
      setMounted(true);
    }
  }, [events]);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Event styling
  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#2563eb',
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: '0',
      display: 'block',
      padding: '2px 5px'
    }
  });

  return (
    <div className="h-full">
      {mounted && (
        <Calendar
          localizer={momentLocalizer(moment)}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={(event) => {
            if (onEventClick && event.resource) {
              onEventClick(event.resource);
            }
          }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          defaultDate={new Date('2025-05-05')}
        />
      )}
    </div>
  );
};

export default SimpleCalendarView;
