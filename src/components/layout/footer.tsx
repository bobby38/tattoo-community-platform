"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="mr-1">Ink2</span>
                <span className="text-primary">Tattoo</span>
              </span>
            </Link>
            <p className="text-muted-foreground">
              Connecting tattoo enthusiasts, artists, and studios in a vibrant community focused on tattoo art and alternative culture.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Instagram size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Facebook size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Twitter size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Youtube size={18} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-muted-foreground hover:text-primary transition-colors">
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/styles" className="text-muted-foreground hover:text-primary transition-colors">
                  Styles
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/history" className="text-muted-foreground hover:text-primary transition-colors">
                  Tattoo History
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-muted-foreground hover:text-primary transition-colors">
                  Aftercare
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest tattoo news and events.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button className="rounded-l-none">
                <Mail size={16} className="mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Ink2Tattoo. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
