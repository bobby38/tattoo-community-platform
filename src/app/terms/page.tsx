"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Terms & Conditions</span>
          </div>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to Ink2Tattoo. These Terms & Conditions govern your use of our website and services. 
                By accessing or using our platform, you agree to be bound by these terms.
              </p>
              <p className="mb-4">
                Our platform connects tattoo enthusiasts with artists and studios. We provide a space for sharing 
                tattoo art, finding artists, and engaging with the tattoo community.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
              <p className="mb-4">
                To access certain features of our platform, you may need to create an account. You are responsible 
                for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
              <p className="mb-4">
                You must provide accurate and complete information when creating an account. You may not use false 
                information or impersonate another person or entity.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">3. Content Guidelines</h2>
              <p className="mb-4">
                Users may post content including images, text, and comments. You retain ownership of your content, 
                but grant us a license to use, reproduce, and display it on our platform.
              </p>
              <p className="mb-4">
                You may not post content that is illegal, offensive, harmful, or violates the rights of others. 
                We reserve the right to remove any content that violates these guidelines.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">4. Privacy</h2>
              <p className="mb-4">
                Our Privacy Policy describes how we collect, use, and share your personal information. 
                By using our platform, you consent to our collection and use of your information as described in our Privacy Policy.
              </p>
              <p className="mb-4">
                We take reasonable measures to protect your personal information, but cannot guarantee its absolute security.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
              <p className="mb-4">
                Our platform is provided "as is" without warranties of any kind. We are not responsible for the 
                actions of users or the quality of services provided by tattoo artists or studios listed on our platform.
              </p>
              <p className="mb-4">
                We are not liable for any damages arising from your use of our platform or any content posted on it.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
              <p className="mb-4">
                We may update these Terms & Conditions from time to time. We will notify you of any significant changes 
                by posting a notice on our platform or sending you an email.
              </p>
              <p className="mb-4">
                Your continued use of our platform after any changes indicates your acceptance of the updated terms.
              </p>
              <p className="mt-8 text-sm text-muted-foreground">
                Last updated: May 2, 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
