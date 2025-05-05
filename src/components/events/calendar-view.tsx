'use client';

// Import the default react-big-calendar CSS first, then our custom calendar CSS
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

import React from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  website: string;
  ticket_price: number | null;
  currency: string;
  featured_artists: string[];
  description: string;
  social: {
    instagram: string | null;
    facebook: string | null;
    twitter: string | null;
  };
  image_url?: string;
}

// Define CalendarEvent interface
interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Event;
}

// Define custom toolbar props
interface CustomToolbarProps {
  label: string;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY' | Date) => void;
  onView: (view: View) => void;
  view: View;
  views: View[];
}

// Define CalendarView props
interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: Event) => void;
}

// Create a custom toolbar component
const CustomToolbar = (props: CustomToolbarProps) => {
  return (
    <div className="flex items-center justify-between mb-4 p-2">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => props.onNavigate('PREV')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => props.onNavigate('TODAY')}
        >
          Today
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => props.onNavigate('NEXT')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <span className="text-lg font-semibold">{props.label}</span>
      
      <div className="flex items-center space-x-2">
        {props.views.map(view => (
          <Button
            key={view}
            variant={props.view === view ? "default" : "outline"}
            size="sm"
            onClick={() => props.onView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Create the CalendarView component
const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventClick }) => {
  // Simple event styling
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
  
  // Initialize the localizer
  const localizer = momentLocalizer(moment);
  
  return (
    <div className="h-full calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={(event) => {
          console.log('Calendar event selected:', event);
          if (onEventClick && event.resource) {
            onEventClick(event.resource);
          }
        }}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        defaultView="month"
        defaultDate={new Date('2025-05-05')}
        components={{
          toolbar: CustomToolbar as any
        }}
      />
    </div>
  );
};

export default CalendarView;
