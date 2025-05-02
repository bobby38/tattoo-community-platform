"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Image as ImageIcon, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut,
  Edit,
  Upload,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProfileSection from './components/profile-section';
import GallerySection from './components/gallery-section';
import MessagesSection from './components/messages-section';
import NotificationsSection from './components/notifications-section';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
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
              <h1 className="text-3xl font-bold">User Dashboard</h1>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">Dashboard</span>
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
                <CardHeader className="pb-4">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">John Doe</h2>
                    <p className="text-sm text-muted-foreground">@johndoe</p>
                    <div className="flex gap-2 mt-2">
                      <Badge>Collector</Badge>
                      <Badge variant="outline">Member</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div>
                      <p className="text-xl font-bold">42</p>
                      <p className="text-xs text-muted-foreground">Posts</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">156</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">89</p>
                      <p className="text-xs text-muted-foreground">Following</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <nav className="space-y-1">
                    <button 
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "profile" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </button>
                    <button 
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "gallery" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("gallery")}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Gallery
                    </button>
                    <button 
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "messages" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("messages")}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                      <Badge className="ml-auto" variant="secondary">3</Badge>
                    </button>
                    <button 
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${activeTab === "notifications" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                      <Badge className="ml-auto" variant="secondary">12</Badge>
                    </button>
                    <Separator className="my-2" />
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
                {activeTab === "profile" && <ProfileSection />}
                {activeTab === "gallery" && <GallerySection />}
                {activeTab === "messages" && <MessagesSection />}
                {activeTab === "notifications" && <NotificationsSection />}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
