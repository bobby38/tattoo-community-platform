"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // FAQ data
  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      faqs: [
        {
          question: 'What is the minimum age to get a tattoo?',
          answer: 'The minimum age for getting a tattoo varies by location. In most states in the US, you must be 18 years or older. Some states allow minors to get tattoos with parental consent, but this varies by jurisdiction. Always check your local laws before booking an appointment.'
        },
        {
          question: 'How do I choose the right tattoo artist?',
          answer: 'Research is key. Look at artists\' portfolios to ensure their style matches what you want. Read reviews, check their social media, and visit their studio to assess cleanliness and professionalism. Don\'t hesitate to schedule consultations with multiple artists before making your decision.'
        },
        {
          question: 'How much do tattoos cost?',
          answer: 'Tattoo pricing varies widely based on size, complexity, location on the body, the artist\'s experience, and geographic location. Many artists charge by the hour (typically $100-300/hour), while smaller pieces might have a minimum fee (often $50-150). Always discuss pricing before your appointment.'
        },
        {
          question: 'Should I tip my tattoo artist?',
          answer: 'Yes, tipping is customary in the tattoo industry. A standard tip is 15-20% of the total cost, similar to other service industries. If you\'re particularly pleased with the work or had a great experience, you might consider tipping more.'
        }
      ]
    },
    {
      id: 'before',
      title: 'Before Getting a Tattoo',
      faqs: [
        {
          question: 'How should I prepare for my tattoo appointment?',
          answer: 'Get a good night\'s sleep, eat a meal before your appointment, stay hydrated, and avoid alcohol for at least 24 hours before. Wear comfortable, loose clothing that provides easy access to the area being tattooed. Bring snacks and entertainment for longer sessions.'
        },
        {
          question: 'What should I avoid before getting a tattoo?',
          answer: 'Avoid alcohol for at least 24 hours before your appointment, as it thins your blood and can cause excessive bleeding. Avoid sunburn on the area to be tattooed. Don\'t take aspirin or blood thinners (if medically safe to pause them). Avoid heavy workouts immediately before your session.'
        },
        {
          question: 'Can I get a tattoo if I have a medical condition?',
          answer: 'Many medical conditions require special consideration before getting a tattoo. Conditions like diabetes, hemophilia, heart problems, and compromised immune systems may increase risks. Always consult with your doctor first, and be upfront with your tattoo artist about any medical conditions.'
        },
        {
          question: 'Will my tattoo artist draw my design for me?',
          answer: 'Yes, most tattoo artists will create a custom design based on your ideas and input. This is typically included in the price of your tattoo. The artist will usually show you the design before your appointment or on the day of, and adjustments can be made before the tattooing begins.'
        }
      ]
    },
    {
      id: 'during',
      title: 'During the Tattoo Process',
      faqs: [
        {
          question: 'How painful is getting a tattoo?',
          answer: 'Pain levels vary greatly depending on the individual\'s pain tolerance, the location on the body, and the style of tattoo. Areas with thin skin over bone (ribs, ankles, spine) tend to be more painful. Most people describe the sensation as a constant scratching or burning feeling. Numbing creams are available but may affect ink absorption.'
        },
        {
          question: 'How long does a tattoo session take?',
          answer: 'Session length depends on the size and complexity of the design. Small, simple tattoos might take 30 minutes to an hour, while larger or more detailed pieces could require multiple sessions of several hours each. Your artist should be able to give you a time estimate during consultation.'
        },
        {
          question: 'Can I take breaks during a tattoo session?',
          answer: 'Yes, you can take breaks during your session, especially for longer tattoos. Just communicate with your artist when you need a moment. However, frequent or long breaks can disrupt the artist\'s flow and potentially affect the outcome, so try to minimize them when possible.'
        },
        {
          question: 'Can I bring friends to my tattoo appointment?',
          answer: 'This depends on the studio\'s policy. Many artists allow one support person, but large groups can be distracting and take up limited space in the studio. Always ask ahead of time. During COVID-19 restrictions, many studios have limited or prohibited guests entirely.'
        }
      ]
    },
    {
      id: 'aftercare',
      title: 'Aftercare & Healing',
      faqs: [
        {
          question: 'How do I take care of my new tattoo?',
          answer: 'Follow your artist\'s specific aftercare instructions. Generally, you\'ll need to keep the tattoo clean with mild, fragrance-free soap, apply appropriate aftercare products, avoid soaking in water, keep it out of direct sunlight, and avoid picking or scratching as it heals. See our detailed aftercare guide for more information.'
        },
        {
          question: 'How long does it take for a tattoo to heal?',
          answer: 'The surface healing takes about 2-4 weeks, during which time you\'ll see peeling and flaking. However, complete healing of all layers of skin can take up to 6 months. During this time, the appearance of your tattoo will continue to slightly change and settle.'
        },
        {
          question: 'Is it normal for my tattoo to peel and flake?',
          answer: 'Yes, peeling and flaking are normal parts of the healing process, typically occurring around days 5-10. This is your body shedding the damaged skin cells. It\'s crucial not to pick or scratch at the peeling skin, as this can remove ink and cause patchy healing.'
        },
        {
          question: 'When can I expose my tattoo to the sun or go swimming?',
          answer: 'Avoid direct sunlight on your new tattoo for at least 2-4 weeks, and use SPF 30+ sunscreen on healed tattoos whenever they\'re exposed to the sun. Avoid swimming, baths, hot tubs, and saunas for at least 2-3 weeks, as chlorine, salt, and bacteria can damage healing tattoos.'
        }
      ]
    },
    {
      id: 'longterm',
      title: 'Long-Term Tattoo Care',
      faqs: [
        {
          question: 'How do I keep my tattoo looking vibrant for years?',
          answer: 'Protect your tattoo from sun exposure with SPF 30+ sunscreen, keep your skin moisturized, maintain a healthy lifestyle, and avoid rapid weight fluctuations. Touch-ups every few years can help maintain vibrancy, especially for colorful tattoos.'
        },
        {
          question: 'Do tattoos fade over time?',
          answer: 'Yes, all tattoos fade gradually over time due to sun exposure, skin cell turnover, and the natural aging process. Certain colors (like yellow, orange, and red) tend to fade faster than others. Tattoos on areas with frequent sun exposure or friction will fade more quickly.'
        },
        {
          question: 'Can I get a tattoo touched up if it fades?',
          answer: 'Absolutely. Many people get their tattoos touched up every few years to maintain vibrancy. Some artists offer free touch-ups within a certain timeframe after the initial tattoo, while others charge for this service. The process is typically shorter and less expensive than the original tattoo.'
        },
        {
          question: 'Will pregnancy or weight changes affect my tattoo?',
          answer: 'Significant body changes like pregnancy, weight gain, or weight loss can distort or stretch tattoos. Areas most affected include the abdomen, breasts, and thighs. Consider placement carefully if you\'re planning major life changes, and be prepared for possible touch-ups afterward.'
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery 
    ? faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : faqCategories;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Tattoo studio"
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
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Everything you need to know about tattoos, from preparation to aftercare
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
            <span className="text-foreground">FAQ</span>
          </div>
        </div>
      </div>
      
      {/* Search Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for questions..."
                className="pl-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            {searchQuery && filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-4">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any FAQs matching your search. Try different keywords or browse our categories below.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            ) : (
              filteredFAQs.map((category) => (
                <motion.div key={category.id} variants={itemVariants} className="mb-12">
                  <h2 className="text-3xl font-bold mb-6">{category.title}</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`} className="border rounded-lg px-6">
                        <AccordionTrigger className="text-lg font-medium py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-6 text-muted-foreground">
                          <p>{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))
            )}
            
            {/* Still Have Questions */}
            <motion.div variants={itemVariants} className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Reach out to our community or contact us directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="tattoo">
                  <Link href="/contact" className="flex items-center">
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline">
                  <Link href="/community" className="flex items-center">
                    Join Community
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Related Resources */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1607461194891-3b208b8f47ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Tattoo aftercare" 
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Aftercare Guide</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to properly care for your new tattoo to ensure optimal healing and longevity.
                </p>
                <Link href="/care" className="text-primary hover:underline flex items-center">
                  Read Guide <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Tattoo history" 
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Tattoo History</h3>
                <p className="text-muted-foreground mb-4">
                  Explore the rich cultural history and evolution of tattooing across different civilizations.
                </p>
                <Link href="/history" className="text-primary hover:underline flex items-center">
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Tattoo styles" 
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Tattoo Styles</h3>
                <p className="text-muted-foreground mb-4">
                  Discover different tattoo styles and find the perfect aesthetic for your next piece.
                </p>
                <Link href="/styles" className="text-primary hover:underline flex items-center">
                  Browse Styles <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
