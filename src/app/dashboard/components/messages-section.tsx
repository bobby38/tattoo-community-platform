"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Send, 
  Image as ImageIcon, 
  Smile, 
  Paperclip,
  MoreHorizontal,
  Phone,
  Video
} from 'lucide-react';

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    name: "Akira Tanaka",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    lastMessage: "I can schedule you for next Tuesday at 2pm if that works?",
    time: "10:32 AM",
    unread: 2,
    online: true,
    isArtist: true,
    studio: "Ink Master Studio"
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    lastMessage: "Your sleeve design is coming along nicely! I've added some more details to the dragon.",
    time: "Yesterday",
    unread: 0,
    online: false,
    isArtist: true,
    studio: "Dragon Ink Tattoo"
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    lastMessage: "That new piece looks amazing! Who did the work?",
    time: "Yesterday",
    unread: 0,
    online: true,
    isArtist: false
  },
  {
    id: 4,
    name: "Lisa Wong",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    lastMessage: "I'm thinking of getting a new tattoo next month. Any artist recommendations?",
    time: "Tuesday",
    unread: 1,
    online: false,
    isArtist: false
  },
  {
    id: 5,
    name: "David Martinez",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    lastMessage: "Check out this flash sheet I just finished!",
    time: "Monday",
    unread: 0,
    online: true,
    isArtist: true,
    studio: "Neon City Tattoo"
  }
];

// Mock messages for the active conversation
const mockMessages = [
  {
    id: 1,
    sender: "Akira Tanaka",
    senderAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    content: "Hi John, thanks for reaching out about the Japanese sleeve design.",
    time: "10:15 AM",
    isMe: false
  },
  {
    id: 2,
    sender: "Me",
    content: "Hey Akira! I'm really excited about getting started on this project. I've been wanting a traditional Japanese dragon sleeve for years.",
    time: "10:18 AM",
    isMe: true
  },
  {
    id: 3,
    sender: "Akira Tanaka",
    senderAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    content: "That's great! I specialize in traditional Irezumi style. Would you like to schedule a consultation to discuss the design in detail?",
    time: "10:20 AM",
    isMe: false
  },
  {
    id: 4,
    sender: "Me",
    content: "Absolutely! When are you available in the next couple of weeks?",
    time: "10:25 AM",
    isMe: true
  },
  {
    id: 5,
    sender: "Akira Tanaka",
    senderAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    content: "I have some openings next week. Let me check my schedule...",
    time: "10:28 AM",
    isMe: false
  },
  {
    id: 6,
    sender: "Akira Tanaka",
    senderAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    content: "I can schedule you for next Tuesday at 2pm if that works?",
    time: "10:32 AM",
    isMe: false
  }
];

export default function MessagesSection() {
  const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  const filteredConversations = searchInput 
    ? mockConversations.filter(conv => 
        conv.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        (conv.studio && conv.studio.toLowerCase().includes(searchInput.toLowerCase()))
      )
    : mockConversations;

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    
    // In a real app, you would send the message to the API here
    console.log("Sending message:", messageInput);
    
    // Clear the input
    setMessageInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-240px)] min-h-[500px] flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      <Card className="flex flex-col h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Conversation List */}
          <div className="border-r">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
            <Separator />
            <div className="overflow-y-auto h-[calc(100%-73px)]">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-muted transition-colors ${activeConversation.id === conversation.id ? 'bg-muted' : ''}`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-medium truncate">{conversation.name}</h4>
                        <span className="text-xs text-muted-foreground">{conversation.time}</span>
                      </div>
                      {conversation.isArtist && (
                        <p className="text-xs text-primary">{conversation.studio || "Tattoo Artist"}</p>
                      )}
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <span className="flex-shrink-0 h-5 w-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No conversations found
                </div>
              )}
            </div>
          </div>
          
          {/* Message Area */}
          <div className="md:col-span-2 flex flex-col h-full">
            {/* Conversation Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeConversation.avatar} />
                  <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{activeConversation.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation.online ? 'Online' : 'Offline'} • 
                    {activeConversation.isArtist ? ` ${activeConversation.studio || "Tattoo Artist"}` : ' Member'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.isMe ? 'flex-row-reverse' : ''}`}>
                    {!message.isMe && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={message.senderAvatar} />
                        <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div 
                        className={`rounded-lg p-3 ${
                          message.isMe 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
