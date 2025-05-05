'use client';

import React, { useState } from 'react';
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

interface StaticCalendarViewProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const StaticCalendarView: React.FC<StaticCalendarViewProps> = ({ events, onEventClick }) => {
  // Start with May 2025
  const [currentMonth, setCurrentMonth] = useState(moment('2025-05-01'));
  
  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const startOfMonth = moment(currentMonth).startOf('month');
    const endOfMonth = moment(currentMonth).endOf('month');
    const startDay = startOfMonth.day(); // 0 = Sunday, 1 = Monday, etc.
    const daysInMonth = endOfMonth.date();
    
    const days = [];
    
    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, events: [] });
    }
    
    // Add days of the month with their events
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(startOfMonth).date(day);
      const dayEvents = events.filter(event => {
        const eventStart = moment(event.start_date);
        const eventEnd = moment(event.end_date);
        return date.isSameOrAfter(eventStart, 'day') && date.isSameOrBefore(eventEnd, 'day');
      });
      
      days.push({ day, date: date.format('YYYY-MM-DD'), events: dayEvents });
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  // Go to previous month
  const previousMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'month'));
  };
  
  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'month'));
  };
  
  // Go to current month (May 2025)
  const currentMonthHandler = () => {
    setCurrentMonth(moment('2025-05-01'));
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={previousMonth}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md"
        >
          Previous
        </button>
        
        <h2 className="text-xl font-semibold">
          {currentMonth.format('MMMM YYYY')}
        </h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={currentMonthHandler}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md"
          >
            Today
          </button>
          <button 
            onClick={nextMonth}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium py-2 bg-gray-800 rounded-t-md">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {calendarDays.map((dayData, index) => (
          <div 
            key={index} 
            className={`min-h-[100px] p-1 border border-gray-800 ${dayData.day ? 'bg-gray-800' : 'bg-gray-900'}`}
          >
            {dayData.day && (
              <>
                <div className="text-right text-sm mb-1">{dayData.day}</div>
                <div className="space-y-1">
                  {dayData.events.map(event => (
                    <div 
                      key={`${event.id}-${dayData.date}`}
                      className="text-xs p-1 bg-blue-600 text-white rounded cursor-pointer truncate"
                      onClick={() => onEventClick && onEventClick(event)}
                    >
                      {event.name}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaticCalendarView;
