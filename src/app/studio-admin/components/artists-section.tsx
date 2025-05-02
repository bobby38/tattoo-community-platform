"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Instagram, 
  Globe, 
  Search,
  Calendar,
  Star,
  Clock
} from 'lucide-react';

// Mock data for artists
const mockArtists = [
  {
    id: 1,
    name: "Akira Tanaka",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    role: "Lead Artist",
    specialties: ["Japanese", "Traditional"],
    bio: "With over 15 years of experience, Akira specializes in traditional Japanese tattooing (Irezumi) and American traditional styles.",
    status: "active",
    rating: 4.9,
    reviews: 128,
    appointments: 8,
    contact_info: {
      email: "akira@inkstudio.com",
      phone: "+1 (555) 123-4567",
      instagram: "@akira_tattoos",
      website: "akira-tattoos.com"
    }
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    role: "Senior Artist",
    specialties: ["Watercolor", "Fine Line"],
    bio: "Sarah is known for her delicate fine line work and vibrant watercolor tattoos. Her background in illustration brings a unique artistic perspective to her tattoo designs.",
    status: "active",
    rating: 4.8,
    reviews: 95,
    appointments: 5,
    contact_info: {
      email: "sarah@inkstudio.com",
      phone: "+1 (555) 234-5678",
      instagram: "@sarah_ink_art",
      website: null
    }
  },
  {
    id: 3,
    name: "Miguel Rodriguez",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    role: "Artist",
    specialties: ["Neo-Traditional", "Blackwork"],
    bio: "Miguel blends neo-traditional styles with bold blackwork to create striking, contemporary designs. His work often incorporates elements of his Latin American heritage.",
    status: "active",
    rating: 4.7,
    reviews: 72,
    appointments: 6,
    contact_info: {
      email: "miguel@inkstudio.com",
      phone: "+1 (555) 345-6789",
      instagram: "@miguel_tattoo",
      website: null
    }
  },
  {
    id: 4,
    name: "Jade Kim",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    role: "Junior Artist",
    specialties: ["Minimalist", "Geometric"],
    bio: "Jade specializes in clean, minimalist designs and precise geometric patterns. Her background in graphic design influences her modern approach to tattooing.",
    status: "active",
    rating: 4.5,
    reviews: 42,
    appointments: 3,
    contact_info: {
      email: "jade@inkstudio.com",
      phone: "+1 (555) 456-7890",
      instagram: "@jade_geometric",
      website: null
    }
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    role: "Guest Artist",
    specialties: ["Realism", "Portrait"],
    bio: "David is a traveling guest artist known for his photorealistic portraits and detailed black and grey work. He'll be with us for a limited time.",
    status: "guest",
    rating: 4.9,
    reviews: 156,
    appointments: 10,
    contact_info: {
      email: "david@wilsontattoo.com",
      phone: "+1 (555) 567-8901",
      instagram: "@david_realism",
      website: "davidwilsontattoo.com"
    }
  }
];

export default function ArtistsSection() {
  const [artists, setArtists] = useState(mockArtists);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddArtistOpen, setIsAddArtistOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({
    name: "",
    role: "",
    specialties: [] as string[],
    bio: "",
    contact_info: {
      email: "",
      phone: "",
      instagram: "",
      website: ""
    }
  });
  
  // Filter artists based on search query and active tab
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         artist.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         artist.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && artist.status === "active";
    if (activeTab === "guest") return matchesSearch && artist.status === "guest";
    
    return matchesSearch;
  });

  const handleAddArtist = () => {
    // In a real app, you would save to the database here
    const newId = Math.max(...artists.map(a => a.id)) + 1;
    const artistToAdd = {
      ...newArtist,
      id: newId,
      avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(newArtist.name),
      status: "active",
      rating: 0,
      reviews: 0,
      appointments: 0
    };
    
    setArtists([...artists, artistToAdd]);
    setIsAddArtistOpen(false);
    setNewArtist({
      name: "",
      role: "",
      specialties: [] as string[],
      bio: "",
      contact_info: {
        email: "",
        phone: "",
        instagram: "",
        website: ""
      }
    });
  };

  const handleDeleteArtist = (id: number) => {
    setArtists(artists.filter(artist => artist.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Artists</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search artists..."
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddArtistOpen} onOpenChange={setIsAddArtistOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Artist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Artist</DialogTitle>
                <DialogDescription>
                  Add a new artist to your studio team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={newArtist.name} 
                      onChange={(e) => setNewArtist({...newArtist, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      onValueChange={(value) => setNewArtist({...newArtist, role: value})}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lead Artist">Lead Artist</SelectItem>
                        <SelectItem value="Senior Artist">Senior Artist</SelectItem>
                        <SelectItem value="Artist">Artist</SelectItem>
                        <SelectItem value="Junior Artist">Junior Artist</SelectItem>
                        <SelectItem value="Apprentice">Apprentice</SelectItem>
                        <SelectItem value="Guest Artist">Guest Artist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    rows={3} 
                    value={newArtist.bio} 
                    onChange={(e) => setNewArtist({...newArtist, bio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specialties</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Japanese", "Traditional", "Neo-Traditional", "Blackwork", "Fine Line", "Watercolor", "Realism", "Portrait", "Geometric", "Minimalist"].map((style) => (
                      <Badge 
                        key={style} 
                        variant={newArtist.specialties.includes(style) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          if (newArtist.specialties.includes(style)) {
                            setNewArtist({
                              ...newArtist, 
                              specialties: newArtist.specialties.filter(s => s !== style)
                            });
                          } else {
                            setNewArtist({
                              ...newArtist, 
                              specialties: [...newArtist.specialties, style]
                            });
                          }
                        }}
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={newArtist.contact_info.email} 
                      onChange={(e) => setNewArtist({
                        ...newArtist, 
                        contact_info: {...newArtist.contact_info, email: e.target.value}
                      })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={newArtist.contact_info.phone} 
                      onChange={(e) => setNewArtist({
                        ...newArtist, 
                        contact_info: {...newArtist.contact_info, phone: e.target.value}
                      })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input 
                      id="instagram" 
                      value={newArtist.contact_info.instagram} 
                      onChange={(e) => setNewArtist({
                        ...newArtist, 
                        contact_info: {...newArtist.contact_info, instagram: e.target.value}
                      })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      value={newArtist.contact_info.website || ""} 
                      onChange={(e) => setNewArtist({
                        ...newArtist, 
                        contact_info: {...newArtist.contact_info, website: e.target.value}
                      })} 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddArtistOpen(false)}>Cancel</Button>
                <Button onClick={handleAddArtist}>Add Artist</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Artists</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="guest">Guest Artists</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArtists.length > 0 ? (
              filteredArtists.map((artist) => (
                <Card key={artist.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={artist.avatar} />
                          <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{artist.name}</CardTitle>
                          <CardDescription>{artist.role}</CardDescription>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{artist.rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">({artist.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteArtist(artist.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm">{artist.bio}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {artist.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                        {artist.status === "guest" && (
                          <Badge variant="outline" className="border-primary text-primary">
                            Guest Artist
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{artist.contact_info.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{artist.contact_info.phone}</span>
                        </div>
                        {artist.contact_info.instagram && (
                          <div className="flex items-center">
                            <Instagram className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{artist.contact_info.instagram}</span>
                          </div>
                        )}
                        {artist.contact_info.website && (
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="truncate">{artist.contact_info.website}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{artist.appointments} upcoming appointments</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Clock className="mr-2 h-4 w-4" />
                        Schedule
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <h3 className="text-lg font-medium mb-2">No artists found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No artists matching "${searchQuery}" found.` 
                    : "No artists in this category yet."}
                </p>
                <Button onClick={() => setIsAddArtistOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Artist
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
