"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, User, MapPin, DollarSign, MessageSquare, Plus, Search, Filter, ArrowUpDown, Check, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    client: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      email: "john@example.com",
      phone: "+1 (555) 123-4567"
    },
    artist: {
      name: "Akira Tanaka",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    date: "2025-05-07",
    time: "14:00",
    duration: 180, // minutes
    service: "Full Sleeve - Japanese Dragon (Session 1)",
    status: "confirmed",
    deposit: 200,
    totalPrice: 1200,
    notes: "First session of a multi-session piece. Client has requested a traditional Japanese dragon sleeve with cherry blossoms."
  },
  {
    id: 2,
    client: {
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      email: "emma@example.com",
      phone: "+1 (555) 234-5678"
    },
    artist: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    date: "2025-05-05",
    time: "11:30",
    duration: 120, // minutes
    service: "Watercolor Floral - Forearm",
    status: "confirmed",
    deposit: 100,
    totalPrice: 450,
    notes: "Watercolor style flowers on inner forearm. Client has sensitive skin and may need breaks."
  },
  {
    id: 3,
    client: {
      name: "Michael Smith",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789"
    },
    artist: {
      name: "Miguel Rodriguez",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    date: "2025-05-06",
    time: "13:00",
    duration: 90, // minutes
    service: "Neo-Traditional Wolf - Shoulder",
    status: "pending",
    deposit: 0,
    totalPrice: 350,
    notes: "Client requested a consultation first to discuss design details."
  },
  {
    id: 4,
    client: {
      name: "Lisa Wong",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      email: "lisa@example.com",
      phone: "+1 (555) 456-7890"
    },
    artist: {
      name: "Jade Kim",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    date: "2025-05-08",
    time: "10:00",
    duration: 60, // minutes
    service: "Geometric Mandala - Wrist",
    status: "confirmed",
    deposit: 50,
    totalPrice: 200,
    notes: "Small geometric mandala design on inner wrist. First tattoo, client is nervous."
  },
  {
    id: 5,
    client: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      email: "james@example.com",
      phone: "+1 (555) 567-8901"
    },
    artist: {
      name: "David Wilson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    date: "2025-05-09",
    time: "15:30",
    duration: 240, // minutes
    service: "Portrait - Upper Arm",
    status: "confirmed",
    deposit: 150,
    totalPrice: 800,
    notes: "Realistic portrait of client's grandfather. Reference photos provided."
  }
];

// Mock data for artists
const mockArtists = [
  {
    id: 1,
    name: "Akira Tanaka",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    specialties: ["Japanese", "Traditional"]
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    specialties: ["Watercolor", "Fine Line"]
  },
  {
    id: 3,
    name: "Miguel Rodriguez",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    specialties: ["Neo-Traditional", "Blackwork"]
  },
  {
    id: 4,
    name: "Jade Kim",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    specialties: ["Minimalist", "Geometric"]
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    specialties: ["Realism", "Portrait"]
  }
];

export default function AppointmentsSection() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    client: {
      name: "",
      email: "",
      phone: ""
    },
    artist: "",
    date: "",
    time: "",
    duration: 60,
    service: "",
    notes: ""
  });
  
  // Filter appointments based on search query, active tab, and selected date
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      appointment.artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "confirmed" && appointment.status === "confirmed") ||
      (activeTab === "pending" && appointment.status === "pending");
    
    const matchesDate = 
      !selectedDate || 
      appointment.date === format(selectedDate, 'yyyy-MM-dd');
    
    return matchesSearch && matchesTab && matchesDate;
  });

  const handleStatusChange = (id: number, status: string) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status } : appointment
    ));
  };

  const handleAddAppointment = () => {
    // In a real app, you would save to the database here
    const newId = Math.max(...appointments.map(a => a.id)) + 1;
    
    // Find the selected artist
    const selectedArtist = mockArtists.find(artist => artist.name === newAppointment.artist);
    
    if (!selectedArtist) return;
    
    const appointmentToAdd = {
      id: newId,
      client: {
        name: newAppointment.client.name,
        email: newAppointment.client.email,
        phone: newAppointment.client.phone,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newAppointment.client.name)}`
      },
      artist: {
        name: selectedArtist.name,
        avatar: selectedArtist.avatar
      },
      date: newAppointment.date,
      time: newAppointment.time,
      duration: parseInt(newAppointment.duration.toString()),
      service: newAppointment.service,
      status: "pending",
      deposit: 0,
      totalPrice: 0,
      notes: newAppointment.notes
    };
    
    setAppointments([...appointments, appointmentToAdd]);
    setIsAddAppointmentOpen(false);
    setNewAppointment({
      client: {
        name: "",
        email: "",
        phone: ""
      },
      artist: "",
      date: "",
      time: "",
      duration: 60,
      service: "",
      notes: ""
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search appointments..."
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
              {selectedDate && (
                <div className="p-3 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Add a new appointment to your schedule.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input 
                      id="clientName" 
                      value={newAppointment.client.name} 
                      onChange={(e) => setNewAppointment({
                        ...newAppointment, 
                        client: {...newAppointment.client, name: e.target.value}
                      })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artist">Artist</Label>
                    <Select 
                      onValueChange={(value) => setNewAppointment({...newAppointment, artist: value})}
                    >
                      <SelectTrigger id="artist">
                        <SelectValue placeholder="Select artist" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockArtists.map(artist => (
                          <SelectItem key={artist.id} value={artist.name}>
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <Input 
                      id="clientEmail" 
                      type="email" 
                      value={newAppointment.client.email} 
                      onChange={(e) => setNewAppointment({
                        ...newAppointment, 
                        client: {...newAppointment.client, email: e.target.value}
                      })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Client Phone</Label>
                    <Input 
                      id="clientPhone" 
                      value={newAppointment.client.phone} 
                      onChange={(e) => setNewAppointment({
                        ...newAppointment, 
                        client: {...newAppointment.client, phone: e.target.value}
                      })} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={newAppointment.date} 
                      onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={newAppointment.time} 
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select 
                      onValueChange={(value) => setNewAppointment({...newAppointment, duration: parseInt(value)})}
                      defaultValue="60"
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="180">3 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="300">5 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Service/Tattoo Description</Label>
                  <Input 
                    id="service" 
                    value={newAppointment.service} 
                    onChange={(e) => setNewAppointment({...newAppointment, service: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    value={newAppointment.notes} 
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})} 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddAppointmentOpen(false)}>Cancel</Button>
                <Button onClick={handleAddAppointment}>Schedule Appointment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Appointments</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-6">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={appointment.status === "confirmed" ? "default" : "outline"}
                          className={appointment.status === "confirmed" ? "bg-green-500 hover:bg-green-500/80" : ""}
                        >
                          {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                        </Badge>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{appointment.time} ({appointment.duration / 60} hrs)</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {appointment.status === "pending" ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-500 border-green-500 hover:bg-green-500/10"
                              onClick={() => handleStatusChange(appointment.id, "confirmed")}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Confirm
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive border-destructive hover:bg-destructive/10"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={appointment.client.avatar} />
                            <AvatarFallback>{appointment.client.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Client</h3>
                            <p>{appointment.client.name}</p>
                            <div className="text-sm text-muted-foreground mt-1">
                              <p>{appointment.client.email}</p>
                              <p>{appointment.client.phone}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Service</h3>
                          <p>{appointment.service}</p>
                          {appointment.notes && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p className="font-medium">Notes:</p>
                              <p>{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={appointment.artist.avatar} />
                            <AvatarFallback>{appointment.artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Artist</h3>
                            <p>{appointment.artist.name}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Payment</h3>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>Total: ${appointment.totalPrice}</span>
                            </div>
                            {appointment.deposit > 0 && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                                Deposit: ${appointment.deposit}
                              </Badge>
                            )}
                          </div>
                          {appointment.status === "confirmed" && appointment.deposit === 0 && (
                            <Button size="sm" variant="outline" className="mt-2">
                              <DollarSign className="mr-2 h-4 w-4" />
                              Collect Deposit
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex justify-between items-center w-full">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message Client
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit Appointment
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No appointments found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No appointments matching "${searchQuery}" found.` 
                    : selectedDate 
                      ? `No appointments scheduled for ${format(selectedDate, 'MMMM d, yyyy')}.`
                      : "No appointments in this category."}
                </p>
                <Button onClick={() => setIsAddAppointmentOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
