import { FC } from 'react';

export interface Event {
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

export interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

declare const CalendarView: FC<CalendarViewProps>;

export default CalendarView;
