"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './header';
import Footer from './footer';
import useStore from '@/store/useStore';
import { mockStyles, mockTribes, mockArtists, mockStudios, mockPosts, mockEvents, mockUsers } from '@/lib/mockData';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { 
    setStyles, 
    setTribes, 
    setArtists, 
    setStudios, 
    setPosts, 
    setEvents,
    setUser
  } = useStore();

  // Load mock data on initial render
  useEffect(() => {
    setStyles(mockStyles);
    setTribes(mockTribes);
    setArtists(mockArtists);
    setStudios(mockStudios);
    setPosts(mockPosts);
    setEvents(mockEvents);
    
    // For demo purposes, set a mock user
    setUser(mockUsers[0]);
  }, [setStyles, setTribes, setArtists, setStudios, setPosts, setEvents, setUser]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${pathname === '/' ? '' : 'pt-20'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
