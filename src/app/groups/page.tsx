"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  Share,
  Image as ImageIcon,
  Users,
  Search,
  Filter,
  PlusCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/lib/supabase';

// Define the ContactInfo type according to the updated structure
interface ContactInfo {
  instagram?: string;
  website?: string;
  email?: string;
  phone?: string;
}

// Define the Member type with nested contact_info
interface Member {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar_url: string;
  location: string;
  contact_info: ContactInfo | null;
  role: string;
}

// Define the Tribe/Group type
interface Group {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  cover_image_url: string;
  founded: string;
  location: string;
  member_count: number;
  focus_areas: string[];
  members: Member[];
}

// Define the Post type
interface Post {
  id: string;
  user_id: string;
  author: {
    name: string;
    avatar_url: string;
  };
  title: string;
  content: string;
  image_url: string | null;
  group_id: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

// Mock groups data
const GROUPS_DATA: Group[] = [
  {
    id: '1',
    name: 'Blackwork Collective',
    slug: 'blackwork-collective',
    description: 'A community of artists dedicated to the art of blackwork tattooing, exploring patterns, dotwork, and solid black designs.',
    image_url: 'https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    founded: '2018',
    location: 'Berlin, Germany',
    member_count: 42,
    focus_areas: ['Blackwork', 'Dotwork', 'Geometric', 'Tribal'],
    members: [
      {
        id: 'm1',
        name: 'Marcus Black',
        slug: 'marcus-black',
        bio: 'Pioneering blackwork artist pushing the boundaries of negative space and pattern work.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'London, UK',
        contact_info: {
          instagram: 'marcus_blackwork',
          website: 'https://marcusblack.ink'
        },
        role: 'Founder'
      },
      {
        id: 'm2',
        name: 'Lena Schmidt',
        slug: 'lena-schmidt',
        bio: 'Specializing in intricate dotwork and geometric blackwork designs.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Berlin, Germany',
        contact_info: {
          instagram: 'lena_dots',
          email: 'lena@blackworkcollective.com'
        },
        role: 'Lead Artist'
      }
    ]
  },
  {
    id: '2',
    name: 'Neo-Traditional Guild',
    slug: 'neo-traditional-guild',
    description: 'A group of artists dedicated to pushing the boundaries of traditional tattooing with bold colors and innovative designs.',
    image_url: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    founded: '2015',
    location: 'Portland, OR',
    member_count: 37,
    focus_areas: ['Neo-Traditional', 'American Traditional', 'Japanese Influence'],
    members: [
      {
        id: 'm3',
        name: 'Alexandra Davis',
        slug: 'alexandra-davis',
        bio: 'Renowned for her colorful neo-traditional designs with a feminine touch.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Portland, OR',
        contact_info: {
          instagram: 'alex_neotrad',
          website: 'https://alexandradavis.art'
        },
        role: 'Founder'
      }
    ]
  },
  {
    id: '3',
    name: 'Irezumi Masters',
    slug: 'irezumi-masters',
    description: 'A collective of artists dedicated to preserving and evolving the traditional Japanese tattoo art form of Irezumi.',
    image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    founded: '2010',
    location: 'Tokyo, Japan',
    member_count: 28,
    focus_areas: ['Japanese Irezumi', 'Tebori', 'Traditional Japanese'],
    members: [
      {
        id: 'm4',
        name: 'Takeshi Yamada',
        slug: 'takeshi-yamada',
        bio: 'Master of traditional Japanese tattooing with 25 years of experience.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Tokyo, Japan',
        contact_info: {
          instagram: 'takeshi_irezumi',
          website: 'https://takeshi-tattoo.jp',
          email: 'contact@takeshi-tattoo.jp',
          phone: '+81-3-1234-5678'
        },
        role: 'Founder'
      }
    ]
  }
];

// Mock posts data
const POSTS_DATA: Record<string, Post[]> = {
  '1': [
    {
      id: 'p1',
      user_id: 'm1',
      author: {
        name: 'Marcus Black',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      },
      title: '',
      content: 'Just finished this blackwork sleeve today. Inspired by ancient geometric patterns and sacred geometry. What do you think?',
      image_url: 'https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      group_id: '1',
      likes_count: 42,
      comments_count: 8,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    },
    {
      id: 'p2',
      user_id: 'm2',
      author: {
        name: 'Lena Schmidt',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      },
      title: '',
      content: 'Excited to announce our upcoming blackwork workshop in Berlin! Limited spots available, sign up through the link in bio.',
      image_url: null,
      group_id: '1',
      likes_count: 28,
      comments_count: 5,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    }
  ],
  '2': [
    {
      id: 'p3',
      user_id: 'm3',
      author: {
        name: 'Alexandra Davis',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      },
      title: '',
      content: 'Check out this neo-traditional piece I completed yesterday. A modern take on the classic rose design with vibrant colors and bold lines.',
      image_url: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      group_id: '2',
      likes_count: 36,
      comments_count: 12,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    }
  ],
  '3': [
    {
      id: 'p4',
      user_id: 'm4',
      author: {
        name: 'Takeshi Yamada',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      },
      title: '',
      content: 'Sharing some progress shots of this traditional Irezumi back piece. The dragon and cherry blossoms represent strength and the ephemeral nature of life.',
      image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      group_id: '3',
      likes_count: 51,
      comments_count: 9,
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    }
  ]
};

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupPosts, setGroupPosts] = useState<Post[]>([]);
  
  // Filter groups based on search query
  const filteredGroups = searchQuery 
    ? GROUPS_DATA.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.focus_areas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : GROUPS_DATA;
  
  // Handle group selection
  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    setGroupPosts(POSTS_DATA[group.id] || []);
  };
  
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
    <div className="container mx-auto px-4 py-12">
      {/* Modernized Heading Section */}
      <div className="bg-muted/50 p-6 rounded-lg mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4 text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-3">Tattoo Groups</h1>
        <p className="text-muted-foreground max-w-2xl mb-0"> {/* Reduced bottom margin */}
          Join and participate in community groups focused on different tattoo styles and interests. Share your work, ask questions, and connect with like-minded artists and enthusiasts.
        </p>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar - Groups list */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Groups</h2>
                <Button size="sm" className="flex items-center">
                  <PlusCircle className="mr-1 h-4 w-4" />
                  New Group
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              
              {/* Groups list */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredGroups.map((group) => (
                  <div 
                    key={group.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedGroup?.id === group.id 
                        ? 'bg-primary/10 border-l-4 border-primary' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleGroupSelect(group)}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                        <img 
                          src={group.image_url} 
                          alt={group.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-medium">{group.name}</h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{group.member_count} members</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content - Group feed or group selection prompt */}
        <div className="lg:col-span-2">
          {selectedGroup ? (
            <div className="space-y-6">
              {/* Group header */}
              <Card className="overflow-hidden">
                <div className="h-48 relative">
                  <img 
                    src={selectedGroup.cover_image_url} 
                    alt={selectedGroup.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white mr-4">
                          <img 
                            src={selectedGroup.image_url} 
                            alt={selectedGroup.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-white">{selectedGroup.name}</h2>
                          <div className="flex items-center text-white/80">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{selectedGroup.member_count} members</span>
                            <span className="mx-2">•</span>
                            <span>Founded {selectedGroup.founded}</span>
                          </div>
                        </div>
                        
                        <Button>Join Group</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <Tabs defaultValue="posts">
                    <TabsList className="mb-6">
                      <TabsTrigger value="posts">Posts</TabsTrigger>
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="members">Members</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="posts" className="space-y-6">
                      {/* Create post card */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Input
                                placeholder="Share something with the group..."
                                className="bg-gray-100"
                              />
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Photo
                            </Button>
                            <Button size="sm">Post</Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Posts */}
                      {groupPosts.length > 0 ? (
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-6"
                        >
                          {groupPosts.map((post) => (
                            <motion.div key={post.id} variants={itemVariants}>
                              <Card>
                                <CardContent className="p-6">
                                  <div className="flex items-center mb-4">
                                    <Avatar className="h-10 w-10 mr-3">
                                      <AvatarImage src={post.author.avatar_url} alt={post.author.name} />
                                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    
                                    <div>
                                      <p className="font-medium">{post.author.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {post.title && <h3 className="text-xl font-bold mb-2">{post.title}</h3>}
                                  
                                  <p className="mb-4">{post.content}</p>
                                  
                                  {post.image_url && (
                                    <div className="mb-4 rounded-lg overflow-hidden">
                                      <img 
                                        src={post.image_url} 
                                        alt="Post image"
                                        className="w-full object-cover"
                                      />
                                    </div>
                                  )}
                                </CardContent>
                                
                                <CardFooter className="px-6 py-4 border-t flex justify-between">
                                  <div className="flex space-x-4">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                                      <Heart className="h-4 w-4 mr-2" />
                                      {post.likes_count}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                                      <MessageCircle className="h-4 w-4 mr-2" />
                                      {post.comments_count}
                                    </Button>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <Share className="h-4 w-4 mr-2" />
                                    Share
                                  </Button>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <div className="text-center py-12">
                          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                          <p className="text-muted-foreground mb-4">Be the first to share something with this group!</p>
                          <Button>Create Post</Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="about">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-4">About this Group</h3>
                          <p className="mb-6">{selectedGroup.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2">Focus Areas</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedGroup.focus_areas.map((area) => (
                                  <span key={area} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Location</h4>
                              <p className="text-muted-foreground">{selectedGroup.location}</p>
                              
                              <h4 className="font-semibold mt-4 mb-2">Founded</h4>
                              <p className="text-muted-foreground">{selectedGroup.founded}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="members">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-4">Members ({selectedGroup.member_count})</h3>
                          
                          <div className="space-y-4">
                            {selectedGroup.members.map((member) => (
                              <div key={member.id} className="flex items-center">
                                <Avatar className="h-12 w-12 mr-4">
                                  <AvatarImage src={member.avatar_url} alt={member.name} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <h4 className="font-medium">{member.name}</h4>
                                    <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                      {member.role}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{member.location}</p>
                                </div>
                                
                                <Button variant="outline" size="sm">View Profile</Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-50 rounded-lg p-8 text-center">
              <div>
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Select a Group</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Choose a group from the list to view posts, discussions, and connect with other tattoo enthusiasts.
                </p>
                <Button>Browse All Groups</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
