"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ExternalLink, 
  Mail,
  Building,
  Users,
  Award,
  Briefcase
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the Partner/Sponsor type
interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  partnerSince: string;
  type: 'sponsor' | 'partner';
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

// Mock partners data
const PARTNERS_DATA: Partner[] = [
  {
    id: '1',
    name: 'InkMaster Supplies',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'Premium tattoo equipment and supplies for professional artists. Trusted by top studios worldwide.',
    website: 'https://inkmastersupplies.com',
    partnerSince: '2020',
    type: 'sponsor',
    tier: 'platinum'
  },
  {
    id: '2',
    name: 'Eternal Ink',
    logo: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'High-quality, vegan-friendly tattoo inks in a wide spectrum of vibrant colors. Made in the USA.',
    website: 'https://eternalink.com',
    partnerSince: '2021',
    type: 'sponsor',
    tier: 'gold'
  },
  {
    id: '3',
    name: 'TattooConvention.com',
    logo: 'https://images.unsplash.com/photo-1589985270958-a664865d0499?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'The leading platform for tattoo conventions and events worldwide. Connecting artists and enthusiasts.',
    website: 'https://tattooconvention.com',
    partnerSince: '2022',
    type: 'partner',
    tier: 'platinum'
  },
  {
    id: '4',
    name: 'Tattoo Artist Magazine',
    logo: 'https://images.unsplash.com/photo-1572304580287-304f64f6a27f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'The premier publication for tattoo culture, featuring artist interviews, techniques, and industry news.',
    website: 'https://tattooartistmagazine.com',
    partnerSince: '2021',
    type: 'partner',
    tier: 'gold'
  },
  {
    id: '5',
    name: 'NeedleCraft Pro',
    logo: 'https://images.unsplash.com/photo-1626108870272-ebe3b40f82d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'Precision tattoo needles and cartridges engineered for exceptional performance and safety.',
    website: 'https://needlecraftpro.com',
    partnerSince: '2023',
    type: 'sponsor',
    tier: 'silver'
  },
  {
    id: '6',
    name: 'Ink Therapy Aftercare',
    logo: 'https://images.unsplash.com/photo-1598332889867-a8a3a5c1fe6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'All-natural tattoo aftercare products formulated by dermatologists for optimal healing and color retention.',
    website: 'https://inktherapy.com',
    partnerSince: '2022',
    type: 'sponsor',
    tier: 'silver'
  },
  {
    id: '7',
    name: 'Global Tattoo Academy',
    logo: 'https://images.unsplash.com/photo-1607006344380-b6775a0824ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'Online education platform offering courses from world-renowned tattoo artists. Learn techniques, business skills, and more.',
    website: 'https://globaltattooacademy.com',
    partnerSince: '2023',
    type: 'partner',
    tier: 'gold'
  },
  {
    id: '8',
    name: 'Tattoo Studio Solutions',
    logo: 'https://images.unsplash.com/photo-1611501304923-0f11a7542b7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'Business management software specifically designed for tattoo studios. Scheduling, client management, and financial tools.',
    website: 'https://tattoostudiosolutions.com',
    partnerSince: '2021',
    type: 'partner',
    tier: 'silver'
  },
  {
    id: '9',
    name: 'InkWear Apparel',
    logo: 'https://images.unsplash.com/photo-1586102901518-ca0f178acb5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'Tattoo-inspired clothing and accessories designed by and for the tattoo community.',
    website: 'https://inkwear.com',
    partnerSince: '2023',
    type: 'sponsor',
    tier: 'bronze'
  },
  {
    id: '10',
    name: 'Tattoo Heritage Foundation',
    logo: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'Non-profit organization dedicated to preserving tattoo history and supporting tattoo artists in need.',
    website: 'https://tattooheritage.org',
    partnerSince: '2022',
    type: 'partner',
    tier: 'bronze'
  }
];

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter partners based on active tab
  const filteredPartners = activeTab === 'all' 
    ? PARTNERS_DATA 
    : activeTab === 'sponsors' 
      ? PARTNERS_DATA.filter(partner => partner.type === 'sponsor')
      : PARTNERS_DATA.filter(partner => partner.type === 'partner');
  
  // Group partners by tier
  const platinumPartners = filteredPartners.filter(partner => partner.tier === 'platinum');
  const goldPartners = filteredPartners.filter(partner => partner.tier === 'gold');
  const silverPartners = filteredPartners.filter(partner => partner.tier === 'silver');
  const bronzePartners = filteredPartners.filter(partner => partner.tier === 'bronze');
  
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
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Our Partners & Sponsors</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Meet the organizations that support our community and help us provide valuable resources to tattoo artists and enthusiasts worldwide.
        </p>
      </div>
      
      {/* Become a Partner/Sponsor CTA */}
      <div className="mb-12">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl font-bold mb-2">Become a Partner or Sponsor</h2>
                <p className="max-w-xl">
                  Join our growing network of industry leaders. Reach thousands of tattoo artists and enthusiasts while supporting the tattoo community.
                </p>
              </div>
              <div className="flex space-x-4">
                <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="all" className="flex items-center">
            <Building className="mr-2 h-4 w-4" />
            All Partners
          </TabsTrigger>
          <TabsTrigger value="sponsors" className="flex items-center">
            <Award className="mr-2 h-4 w-4" />
            Sponsors
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Partners
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {renderPartnersByTier()}
        </TabsContent>
        <TabsContent value="sponsors" className="mt-0">
          {renderPartnersByTier()}
        </TabsContent>
        <TabsContent value="partners" className="mt-0">
          {renderPartnersByTier()}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderPartnersByTier() {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-16"
      >
        {/* Platinum Partners */}
        {platinumPartners.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-[#E5E4E2] to-[#B9B8B5] p-2 rounded-full mr-3">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Platinum {activeTab === 'sponsors' ? 'Sponsors' : activeTab === 'partners' ? 'Partners' : 'Partners & Sponsors'}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {platinumPartners.map(partner => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        )}
        
        {/* Gold Partners */}
        {goldPartners.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC000] p-2 rounded-full mr-3">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Gold {activeTab === 'sponsors' ? 'Sponsors' : activeTab === 'partners' ? 'Partners' : 'Partners & Sponsors'}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {goldPartners.map(partner => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        )}
        
        {/* Silver Partners */}
        {silverPartners.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-[#C0C0C0] to-[#A9A9A9] p-2 rounded-full mr-3">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Silver {activeTab === 'sponsors' ? 'Sponsors' : activeTab === 'partners' ? 'Partners' : 'Partners & Sponsors'}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {silverPartners.map(partner => (
                <PartnerCard key={partner.id} partner={partner} variant="compact" />
              ))}
            </div>
          </div>
        )}
        
        {/* Bronze Partners */}
        {bronzePartners.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-[#CD7F32] to-[#B87333] p-2 rounded-full mr-3">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Bronze {activeTab === 'sponsors' ? 'Sponsors' : activeTab === 'partners' ? 'Partners' : 'Partners & Sponsors'}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bronzePartners.map(partner => (
                <PartnerCard key={partner.id} partner={partner} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }
}

// Partner Card Component
function PartnerCard({ partner, variant = 'full' }: { partner: Partner, variant?: 'full' | 'compact' }) {
  return (
    <motion.div variants={variant === 'full' ? undefined : undefined}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
        {variant === 'full' ? (
          <div className="md:flex">
            <div className="md:w-1/3 h-48 md:h-auto relative">
              <div className="w-full h-full flex items-center justify-center p-6 bg-white">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  partner.type === 'sponsor' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {partner.type === 'sponsor' ? 'Sponsor' : 'Partner'}
                </span>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Partner since {partner.partnerSince}</span>
                </div>
                
                <p className="text-muted-foreground mb-6">{partner.description}</p>
                
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  Visit Website
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </CardContent>
            </div>
          </div>
        ) : (
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-md mr-4">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              <div>
                <h3 className="font-bold">{partner.name}</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Since {partner.partnerSince}</span>
                  <span className="mx-2">•</span>
                  <span className={`${
                    partner.type === 'sponsor' 
                      ? 'text-primary' 
                      : 'text-secondary'
                  }`}>
                    {partner.type === 'sponsor' ? 'Sponsor' : 'Partner'}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{partner.description}</p>
            
            <a 
              href={partner.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm flex items-center text-primary hover:underline"
            >
              Visit Website
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
