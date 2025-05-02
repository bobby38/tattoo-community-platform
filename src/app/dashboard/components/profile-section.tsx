"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, Instagram, Globe, Phone, Mail, MapPin } from 'lucide-react';

export default function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    username: "johndoe",
    bio: "Tattoo enthusiast with a passion for Japanese and traditional American styles. Collecting art since 2018.",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    website: "johndoe.com",
    instagram: "@johndoe_ink"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you would save to the database here
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <Button 
          variant={isEditing ? "default" : "outline"} 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and public profile information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="font-medium">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">
                Upload a new profile picture. Recommended size: 400x400px.
              </p>
              {isEditing && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Upload New
                  </Button>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input 
                  id="name" 
                  name="name" 
                  value={profile.name} 
                  onChange={handleInputChange} 
                />
              ) : (
                <p>{profile.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <Input 
                  id="username" 
                  name="username" 
                  value={profile.username} 
                  onChange={handleInputChange} 
                />
              ) : (
                <p>@{profile.username}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={profile.bio} 
                  onChange={handleInputChange} 
                  rows={3}
                />
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input 
                  id="location" 
                  name="location" 
                  value={profile.location} 
                  onChange={handleInputChange} 
                />
              ) : (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{profile.location}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <h3 className="font-medium">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={profile.email} 
                  onChange={handleInputChange} 
                />
              ) : (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{profile.email}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={profile.phone} 
                  onChange={handleInputChange} 
                />
              ) : (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{profile.phone}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Social Media */}
          <h3 className="font-medium">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              {isEditing ? (
                <Input 
                  id="website" 
                  name="website" 
                  value={profile.website} 
                  onChange={handleInputChange} 
                />
              ) : (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{profile.website}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              {isEditing ? (
                <Input 
                  id="instagram" 
                  name="instagram" 
                  value={profile.instagram} 
                  onChange={handleInputChange} 
                />
              ) : (
                <div className="flex items-center">
                  <Instagram className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{profile.instagram}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2 border-t pt-6">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
