"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut,
  BarChart3,
  Palette,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StudioProfileSection from './components/studio-profile-section';
import ArtistsSection from './components/artists-section';
import AppointmentsSection from './components/appointments-section';
import GallerySection from './components/gallery-section';
import AnalyticsSection from './components/analytics-section';

export default function StudioAdminPage() {
  const [activeTab, setActiveTab] = useState("studio");
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <section className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Studio Dashboard</h1>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">Studio Admin</span>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Back to Site
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" />
                      <AvatarFallback>IS</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">Ink Studio</h2>
                    <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                    <div className="flex gap-2 mt-2">
                      <Badge>Verified</Badge>
                      <Badge variant="outline">Premium</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div>
                      <p className="text-xl font-bold">8</p>
                      <p className="text-xs text-muted-foreground">Artists</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">4.9</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <nav className="space-y-1">
                    <button 
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "studio" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("studio")}
                    >
                      <Store className="mr-2 h-4 w-4" />
                      Studio Profile
                    </button>
                    <button 
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "artists" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("artists")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Artists
                    </button>
                    <button 
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "appointments" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("appointments")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Appointments
                      <Badge className="ml-auto" variant="secondary">5</Badge>
                    </button>
                    <button 
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "gallery" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("gallery")}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Gallery
                    </button>
                    <button 
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "analytics" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("analytics")}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </button>
                    <Separator className="my-2" />
                    <button 
                      className="w-full flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                      <Badge className="ml-auto" variant="secondary">12</Badge>
                    </button>
                    <button 
                      className="w-full flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                      <Badge className="ml-auto" variant="secondary">3</Badge>
                    </button>
                    <button 
                      className="w-full flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {activeTab === "studio" && <StudioProfileSection />}
                {activeTab === "artists" && <ArtistsSection />}
                {activeTab === "appointments" && <AppointmentsSection />}
                {activeTab === "gallery" && <GallerySection />}
                {activeTab === "analytics" && <AnalyticsSection />}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
