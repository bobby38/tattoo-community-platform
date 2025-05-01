import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with the correct values
const supabaseUrl = 'https://nwopjuetkrnzcgrcdxvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53b3BqdWV0a3JuemNncmNkeHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMDkzNDYsImV4cCI6MjA2MTY4NTM0Nn0.8RBs-SMdydrb3WN7B1oXHT9nlLDHGnF5jeDWMAO3n-0';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
