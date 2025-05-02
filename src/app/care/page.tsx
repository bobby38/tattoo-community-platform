"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  Droplet, 
  Sun, 
  ShoppingBag, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function AftercarePage() {
  const [daysSinceTattoo, setDaysSinceTattoo] = useState(1);
  
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

  // Get healing stage based on days
  const getHealingStage = () => {
    if (daysSinceTattoo <= 3) return "initial";
    if (daysSinceTattoo <= 7) return "week1";
    if (daysSinceTattoo <= 14) return "week2";
    if (daysSinceTattoo <= 30) return "month1";
    return "healed";
  };

  const healingStage = getHealingStage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1607461194891-3b208b8f47ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Tattoo aftercare"
          className="absolute inset-0 w-full h-full object-cover object-center -z-10"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80 -z-10"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Tattoo <span className="text-primary">Aftercare</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Your comprehensive guide to caring for your new tattoo and ensuring optimal healing
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Breadcrumb */}
      <div className="bg-muted py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Aftercare</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Healing Timeline</h3>
                  
                  <div className="mb-6">
                    <label htmlFor="days-slider" className="block text-sm font-medium mb-2">
                      Days since getting your tattoo: {daysSinceTattoo}
                    </label>
                    <input
                      id="days-slider"
                      type="range"
                      min="1"
                      max="60"
                      value={daysSinceTattoo}
                      onChange={(e) => setDaysSinceTattoo(parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Day 1</span>
                      <span>Week 1</span>
                      <span>Week 2</span>
                      <span>Month 1</span>
                      <span>Month 2</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`p-3 rounded-md ${healingStage === "initial" ? "bg-primary/10 border border-primary" : "bg-muted"}`}>
                      <h4 className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Days 1-3: Initial Healing
                      </h4>
                    </div>
                    <div className={`p-3 rounded-md ${healingStage === "week1" ? "bg-primary/10 border border-primary" : "bg-muted"}`}>
                      <h4 className="font-medium flex items-center">
                        <Droplet className="h-4 w-4 mr-2" />
                        Days 4-7: Weeping Stage
                      </h4>
                    </div>
                    <div className={`p-3 rounded-md ${healingStage === "week2" ? "bg-primary/10 border border-primary" : "bg-muted"}`}>
                      <h4 className="font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Days 8-14: Peeling & Itching
                      </h4>
                    </div>
                    <div className={`p-3 rounded-md ${healingStage === "month1" ? "bg-primary/10 border border-primary" : "bg-muted"}`}>
                      <h4 className="font-medium flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Days 15-30: Recovery
                      </h4>
                    </div>
                    <div className={`p-3 rounded-md ${healingStage === "healed" ? "bg-primary/10 border border-primary" : "bg-muted"}`}>
                      <h4 className="font-medium flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        30+ Days: Fully Healed
                      </h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold mb-6">Essential Aftercare Guide</h2>
                
                <Tabs defaultValue="instructions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                    <TabsTrigger value="products">Recommended Products</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="instructions" className="mt-6">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <h3>Days 1-3: Initial Healing</h3>
                      <ul>
                        <li>Leave the bandage on for 2-4 hours after getting tattooed.</li>
                        <li>Gently wash the tattoo with lukewarm water and fragrance-free, antibacterial soap.</li>
                        <li>Pat dry with a clean paper towel – never rub.</li>
                        <li>Apply a thin layer of tattoo-specific aftercare ointment.</li>
                        <li>Repeat washing and moisturizing 2-3 times daily.</li>
                      </ul>
                      
                      <h3>Days 4-7: Weeping Stage</h3>
                      <ul>
                        <li>Continue washing 2-3 times daily with mild soap.</li>
                        <li>Your tattoo may ooze plasma and ink – this is normal.</li>
                        <li>Switch from ointment to a fragrance-free lotion.</li>
                        <li>Keep the tattoo clean and avoid soaking in water.</li>
                        <li>Wear loose clothing to avoid friction.</li>
                      </ul>
                      
                      <h3>Days 8-14: Peeling & Itching</h3>
                      <ul>
                        <li>Your tattoo will begin to peel – do not pick or scratch!</li>
                        <li>Continue moisturizing regularly to reduce itching.</li>
                        <li>Avoid direct sunlight on the tattoo.</li>
                        <li>Still no swimming, baths, or saunas.</li>
                      </ul>
                      
                      <h3>Days 15-30: Recovery</h3>
                      <ul>
                        <li>Peeling should be complete, but the tattoo may still appear dull.</li>
                        <li>Continue moisturizing daily.</li>
                        <li>Begin using sunscreen (SPF 50+) when exposing the tattoo to sunlight.</li>
                        <li>You can resume swimming and bathing normally.</li>
                      </ul>
                      
                      <h3>30+ Days: Fully Healed</h3>
                      <ul>
                        <li>Your tattoo should be fully healed on the surface.</li>
                        <li>Continue to protect from sun damage with sunscreen.</li>
                        <li>Moisturize regularly to keep the tattoo vibrant.</li>
                        <li>Remember that deeper layers may still be healing for up to 6 months.</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="products" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-3">Cleansers</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Dr. Bronner's Pure-Castile Soap</p>
                                <p className="text-sm text-muted-foreground">Gentle, unscented soap perfect for new tattoos</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">H2Ocean Blue Green Foam Soap</p>
                                <p className="text-sm text-muted-foreground">Specially formulated for tattoo aftercare</p>
                              </div>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-3">Ointments (Days 1-3)</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Aquaphor Healing Ointment</p>
                                <p className="text-sm text-muted-foreground">Provides a protective barrier while healing</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Hustle Butter Deluxe</p>
                                <p className="text-sm text-muted-foreground">Vegan, all-natural tattoo care product</p>
                              </div>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-3">Lotions (After Day 3)</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Lubriderm Unscented Lotion</p>
                                <p className="text-sm text-muted-foreground">Fragrance-free, non-irritating moisturizer</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">After Inked Tattoo Moisturizer</p>
                                <p className="text-sm text-muted-foreground">Specially formulated for tattoo aftercare</p>
                              </div>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-3">Sun Protection</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Neutrogena Ultra Sheer SPF 50+</p>
                                <p className="text-sm text-muted-foreground">Lightweight, non-greasy sun protection</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">CannaSmack Ink Guard SPF 30</p>
                                <p className="text-sm text-muted-foreground">Tattoo-specific sunscreen with hemp seed oil</p>
                              </div>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="faq" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">How long does it take for a tattoo to heal completely?</h3>
                        <p className="text-muted-foreground">
                          While the surface of your skin will heal within 2-4 weeks, complete healing of all layers of skin can take up to 6 months. During this time, it's important to continue moisturizing and protecting your tattoo from sun exposure.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Can I swim with a new tattoo?</h3>
                        <p className="text-muted-foreground">
                          You should avoid submerging your tattoo in water (pools, hot tubs, baths, ocean) for at least 2-3 weeks. Chlorine, salt, and bacteria can damage a healing tattoo and potentially cause infection.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Is it normal for my tattoo to peel?</h3>
                        <p className="text-muted-foreground">
                          Yes, peeling is a normal part of the healing process. Your tattoo will likely begin peeling between days 5-10. It's crucial not to pick or scratch at the peeling skin, as this can remove ink and cause patchy healing.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-2">How often should I moisturize my tattoo?</h3>
                        <p className="text-muted-foreground">
                          During the first 2-3 weeks, moisturize your tattoo 2-3 times daily with a thin layer of product. After that, once daily is sufficient. Always apply moisturizer to clean, dry skin.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-2">When should I be concerned about infection?</h3>
                        <p className="text-muted-foreground">
                          Signs of infection include increased redness, swelling, warmth, pus, excessive pain, or red streaks extending from the tattoo. If you experience any of these symptoms, especially with fever, seek medical attention immediately.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
              
              <motion.div variants={itemVariants} className="bg-muted p-6 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Important Reminder</h3>
                    <p className="text-muted-foreground">
                      These guidelines are general recommendations. Always follow the specific aftercare instructions provided by your tattoo artist, as they may vary based on the style, size, and location of your tattoo.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Professional Advice?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Connect with experienced tattoo artists who can provide personalized aftercare guidance for your specific tattoo.
          </p>
          <Button size="lg" variant="tattoo">
            <Link href="/directory" className="flex items-center">
              Find Artists
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
