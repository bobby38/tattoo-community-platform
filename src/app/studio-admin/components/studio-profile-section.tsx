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
import { 
  Edit, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter,
  Upload,
  Plus,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function StudioProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [studio, setStudio] = useState({
    name: "Ink Studio",
    description: "A premier tattoo studio specializing in Japanese, traditional, and fine line tattoo styles. Our team of experienced artists is dedicated to creating custom, high-quality tattoos in a clean, welcoming environment.",
    address: "123 Ink Street, San Francisco, CA 94103",
    phone: "+1 (555) 123-4567",
    email: "info@inkstudio.com",
    website: "www.inkstudio.com",
    hours: {
      monday: "10:00 AM - 8:00 PM",
      tuesday: "10:00 AM - 8:00 PM",
      wednesday: "10:00 AM - 8:00 PM",
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 9:00 PM",
      saturday: "11:00 AM - 9:00 PM",
      sunday: "Closed"
    },
    contact_info: {
      instagram: "@ink_studio",
      facebook: "inkstudioofficial",
      twitter: "@ink_studio"
    },
    styles: ["Japanese", "Traditional", "Neo-Traditional", "Blackwork", "Fine Line", "Watercolor"],
    amenities: ["Free Consultation", "WiFi", "Parking", "Wheelchair Accessible", "Private Rooms"]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudio(prev => ({ ...prev, [name]: value }));
  };

  const handleHoursChange = (day: string, value: string) => {
    setStudio(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: value
      }
    }));
  };

  const handleContactInfoChange = (platform: string, value: string) => {
    setStudio(prev => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [platform]: value
      }
    }));
  };

  const handleStyleAdd = (style: string) => {
    if (!studio.styles.includes(style)) {
      setStudio(prev => ({
        ...prev,
        styles: [...prev.styles, style]
      }));
    }
  };

  const handleStyleRemove = (style: string) => {
    setStudio(prev => ({
      ...prev,
      styles: prev.styles.filter(s => s !== style)
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    if (studio.amenities.includes(amenity)) {
      setStudio(prev => ({
        ...prev,
        amenities: prev.amenities.filter(a => a !== amenity)
      }));
    } else {
      setStudio(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
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
        <h2 className="text-2xl font-bold">Studio Profile</h2>
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

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your studio's basic details and profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Studio Logo */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" />
                <AvatarFallback>IS</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="font-medium">Studio Logo</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a high-quality logo for your studio. Recommended size: 400x400px.
                </p>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
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

            {/* Studio Name and Description */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Studio Name</Label>
                {isEditing ? (
                  <Input 
                    id="name" 
                    name="name" 
                    value={studio.name} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <p>{studio.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={studio.description} 
                    onChange={handleInputChange} 
                    rows={4}
                  />
                ) : (
                  <p>{studio.description}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Location and Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input 
                    id="address" 
                    name="address" 
                    value={studio.address} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{studio.address}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={studio.phone} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{studio.phone}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={studio.email} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{studio.email}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                {isEditing ? (
                  <Input 
                    id="website" 
                    name="website" 
                    value={studio.website} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{studio.website}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="border-t pt-6">
              <Button onClick={handleSave}>Save Basic Information</Button>
            </CardFooter>
          )}
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>
              Set your regular operating hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(studio.hours).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={day} className="capitalize">{day}</Label>
                  {isEditing ? (
                    <Input 
                      id={day} 
                      value={hours} 
                      onChange={(e) => handleHoursChange(day, e.target.value)} 
                      className="col-span-2"
                    />
                  ) : (
                    <div className="flex items-center col-span-2">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{hours}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="border-t pt-6">
              <Button onClick={handleSave}>Save Business Hours</Button>
            </CardFooter>
          )}
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>
              Connect your social media accounts to your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="flex items-center">
                  <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                  <Label htmlFor="instagram">Instagram</Label>
                </div>
                {isEditing ? (
                  <Input 
                    id="instagram" 
                    value={studio.contact_info.instagram} 
                    onChange={(e) => handleContactInfoChange('instagram', e.target.value)} 
                    className="col-span-2"
                  />
                ) : (
                  <p className="col-span-2">{studio.contact_info.instagram}</p>
                )}
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="flex items-center">
                  <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                  <Label htmlFor="facebook">Facebook</Label>
                </div>
                {isEditing ? (
                  <Input 
                    id="facebook" 
                    value={studio.contact_info.facebook} 
                    onChange={(e) => handleContactInfoChange('facebook', e.target.value)} 
                    className="col-span-2"
                  />
                ) : (
                  <p className="col-span-2">{studio.contact_info.facebook}</p>
                )}
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="flex items-center">
                  <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                  <Label htmlFor="twitter">Twitter</Label>
                </div>
                {isEditing ? (
                  <Input 
                    id="twitter" 
                    value={studio.contact_info.twitter} 
                    onChange={(e) => handleContactInfoChange('twitter', e.target.value)} 
                    className="col-span-2"
                  />
                ) : (
                  <p className="col-span-2">{studio.contact_info.twitter}</p>
                )}
              </div>
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="border-t pt-6">
              <Button onClick={handleSave}>Save Social Media</Button>
            </CardFooter>
          )}
        </Card>

        {/* Tattoo Styles */}
        <Card>
          <CardHeader>
            <CardTitle>Tattoo Styles</CardTitle>
            <CardDescription>
              Select the tattoo styles your studio specializes in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {studio.styles.map((style) => (
                  <Badge key={style} variant="secondary" className="flex items-center gap-1">
                    {style}
                    {isEditing && (
                      <button 
                        onClick={() => handleStyleRemove(style)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex gap-2 mt-4">
                  <Select onValueChange={handleStyleAdd}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Add style" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Japanese", "Traditional", "Neo-Traditional", "Blackwork", "Fine Line", "Watercolor", "Realism", "Tribal", "Geometric", "Minimalist", "Portrait", "Dotwork", "Script", "Illustrative"].filter(style => !studio.styles.includes(style)).map((style) => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="border-t pt-6">
              <Button onClick={handleSave}>Save Tattoo Styles</Button>
            </CardFooter>
          )}
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>
              Highlight the amenities and services your studio offers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Free Consultation", "WiFi", "Parking", "Wheelchair Accessible", "Private Rooms", "Custom Design", "Walk-Ins Welcome", "Credit Cards", "Aftercare Products", "Piercing Services"].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`amenity-${amenity}`} 
                      checked={studio.amenities.includes(amenity)} 
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {studio.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="border-t pt-6">
              <Button onClick={handleSave}>Save Amenities</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
