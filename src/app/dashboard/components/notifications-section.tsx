"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Calendar, 
  Star, 
  Check, 
  Trash2,
  Settings
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "like",
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    content: "liked your Japanese Dragon Sleeve photo",
    time: "10 minutes ago",
    read: false
  },
  {
    id: 2,
    type: "comment",
    user: {
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    content: "commented on your Geometric Wolf photo: \"Amazing linework! Who was the artist?\"",
    time: "2 hours ago",
    read: false
  },
  {
    id: 3,
    type: "follow",
    user: {
      name: "Lisa Wong",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    content: "started following you",
    time: "Yesterday",
    read: true
  },
  {
    id: 4,
    type: "appointment",
    user: {
      name: "Akira Tanaka",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    content: "confirmed your appointment for Tuesday, May 7th at 2:00 PM",
    time: "Yesterday",
    read: true
  },
  {
    id: 5,
    type: "review",
    user: {
      name: "David Martinez",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    content: "left a 5-star review on your profile",
    time: "2 days ago",
    read: true
  },
  {
    id: 6,
    type: "like",
    user: {
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    content: "liked your Traditional Rose photo",
    time: "3 days ago",
    read: true
  },
  {
    id: 7,
    type: "comment",
    user: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    content: "commented on your Blackwork Mandala photo: \"The detail in this is incredible. How many sessions did it take?\"",
    time: "4 days ago",
    read: true
  },
  {
    id: 8,
    type: "follow",
    user: {
      name: "Neon City Tattoo",
      avatar: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    content: "started following you",
    time: "5 days ago",
    read: true
  }
];

export default function NotificationsSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    appointments: true,
    reviews: true,
    emailNotifications: false,
    pushNotifications: true
  });

  const handleToggleSetting = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "appointment":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case "review":
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={handleClearAll} disabled={notifications.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="like">Likes</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
          <TabsTrigger value="follow">Follows</TabsTrigger>
          <TabsTrigger value="appointment">Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-6">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start p-3 rounded-lg ${notification.read ? 'bg-background' : 'bg-muted'}`}
                    >
                      <div className="flex-shrink-0 mr-4">
                        <Avatar>
                          <AvatarImage src={notification.user.avatar} />
                          <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{notification.user.name}</span>
                              {" "}
                              {notification.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {getNotificationIcon(notification.type)}
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground" 
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {activeTab === "all" 
                      ? "You don't have any notifications yet." 
                      : `You don't have any ${activeTab === "unread" ? "unread" : activeTab} notifications.`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Notification Settings</h3>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Advanced Settings
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <Label htmlFor="likes">Likes</Label>
                    </div>
                    <Switch 
                      id="likes" 
                      checked={notificationSettings.likes} 
                      onCheckedChange={() => handleToggleSetting('likes')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="comments">Comments</Label>
                    </div>
                    <Switch 
                      id="comments" 
                      checked={notificationSettings.comments} 
                      onCheckedChange={() => handleToggleSetting('comments')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserPlus className="h-4 w-4 text-green-500" />
                      <Label htmlFor="follows">New Followers</Label>
                    </div>
                    <Switch 
                      id="follows" 
                      checked={notificationSettings.follows} 
                      onCheckedChange={() => handleToggleSetting('follows')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <Label htmlFor="messages">Messages</Label>
                    </div>
                    <Switch 
                      id="messages" 
                      checked={notificationSettings.messages} 
                      onCheckedChange={() => handleToggleSetting('messages')} 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Delivery Methods</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <Switch 
                      id="emailNotifications" 
                      checked={notificationSettings.emailNotifications} 
                      onCheckedChange={() => handleToggleSetting('emailNotifications')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <Switch 
                      id="pushNotifications" 
                      checked={notificationSettings.pushNotifications} 
                      onCheckedChange={() => handleToggleSetting('pushNotifications')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <Label htmlFor="appointments">Appointment Reminders</Label>
                    </div>
                    <Switch 
                      id="appointments" 
                      checked={notificationSettings.appointments} 
                      onCheckedChange={() => handleToggleSetting('appointments')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Label htmlFor="reviews">Reviews</Label>
                    </div>
                    <Switch 
                      id="reviews" 
                      checked={notificationSettings.reviews} 
                      onCheckedChange={() => handleToggleSetting('reviews')} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
