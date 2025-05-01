# Ink2Tattoo - Tattoo Community Platform

A modern tattoo community platform built with Next.js, Tailwind CSS, and TypeScript. This platform connects tattoo enthusiasts, artists, and studios in a vibrant community focused on tattoo art and alternative culture.

## Features

- **Artist & Studio Directory**: Find talented tattoo artists and studios near you
- **Style Explorer**: Discover different tattoo styles from traditional to modern
- **Community Tribes**: Join style-based communities to connect with like-minded enthusiasts
- **Social Feed**: Stay updated with community activity, news, events, and artist spotlights
- **Events Calendar**: Stay updated on tattoo conventions, workshops, and meetups
- **Tattoo Gallery**: Share your ink and get feedback from the community
- **Tattoo History**: Explore the rich history and cultural significance of tattooing

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Database**: Supabase
- **Authentication**: Supabase Auth (coming soon)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://nwopjuetkrnzcgrcdxvb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53b3BqdWV0a3JuemNncmNkeHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMDkzNDYsImV4cCI6MjA2MTY4NTM0Nn0.8RBs-SMdydrb3WN7B1oXHT9nlLDHGnF5jeDWMAO3n-0
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app`: Next.js App Router pages and layouts
  - `/app/api`: API routes for data fetching
  - `/app/posts`: Post detail pages
  - `/app/feed`: Social feed page
  - `/app/styles`: Style detail pages
  - `/app/tribes`: Tribe detail pages
  - `/app/directory`: Artist and studio directory
- `/components`: Reusable React components
  - `/components/ui`: UI components (buttons, cards, etc.)
  - `/components/sections`: Page sections (hero, features, etc.)
  - `/components/shared`: Shared components used across the application
  - `/components/layout`: Layout components (navbar, footer, etc.)
- `/lib`: Utility functions and helpers
- `/prisma`: Database schema and migrations
- `/public`: Static assets (images, icons, etc.)
- `/scripts`: Database setup and migration scripts

## Data Model

The platform uses the following main data models:

- **Artists**: Tattoo artists with their profiles, styles, and contact information
- **Studios**: Tattoo studios with location and artist information
- **Styles**: Different tattoo styles with descriptions and characteristics
- **Tribes**: Community groups centered around specific tattoo styles or interests
- **Posts**: Social feed content including news, events, galleries, and discussions

## Upcoming Features

- User authentication with Supabase Auth
- User-generated content (posts, comments, likes)
- Artist booking system
- Enhanced search and filtering
- Personalized feed based on user preferences

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
