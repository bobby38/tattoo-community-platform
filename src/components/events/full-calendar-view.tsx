'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import '@/styles/full-calendar.css';

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

interface FullCalendarViewProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const FullCalendarView: React.FC<FullCalendarViewProps> = ({ events, onEventClick }) => {
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
    console.log('FullCalendarView: Component mounted');
    console.log('Events to display:', events);
  }, [events]);
  
  // Convert events to FullCalendar format
  const calendarEvents = events.map(event => {
    console.log(`Processing event: ${event.name}, dates: ${event.start_date} to ${event.end_date}`);
    return {
      id: String(event.id),
      title: event.name,
      start: event.start_date,
      end: event.end_date,
      allDay: true,
      extendedProps: { originalEvent: event }
    };
  });

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="full-calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialDate="2025-05-05"
        events={calendarEvents}
        eventClick={(info) => {
          console.log('Event clicked:', info.event);
          if (onEventClick && info.event.extendedProps.originalEvent) {
            onEventClick(info.event.extendedProps.originalEvent);
          }
        }}
        height="600px"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        firstDay={0}
        dayMaxEvents={true}
        fixedWeekCount={false}
        showNonCurrentDates={true}
        displayEventTime={false}
      />
    </div>
  );
};

export default FullCalendarView;
