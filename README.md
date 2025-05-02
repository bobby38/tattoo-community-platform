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
3. Set up environment variables in a `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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
  - `/public/icons/tribes`: SVG icons for different tattoo tribes
  - `/public/images`: Background images and other visual assets
- `/scripts`: Database setup and migration scripts

## Data Model

The platform uses the following main data models:

- **Artists**: Tattoo artists with their profiles, styles, and contact information
- **Studios**: Tattoo studios with location and artist information
- **Styles**: Different tattoo styles with descriptions and characteristics
- **Tribes**: Community groups centered around specific tattoo styles or interests
- **Posts**: Social feed content including news, events, galleries, and discussions

## Recent Improvements

- **Enhanced Hero Section**: Updated with a striking Japanese dragon tattoo sleeve background
- **Tribe Icons**: Added SVG icons for different tattoo tribes (blackwork, japanese, polynesian)
- **Improved API Error Handling**: Better fallback to mock data when API calls fail
- **Fixed Hydration Issues**: Added suppressHydrationWarning to form elements with password manager interactions

## Implementation Task List

### High Priority
- [ ] **Authentication System**
  - [ ] User registration and login pages
  - [ ] Password reset functionality
  - [ ] Social login options (Google, Facebook)
  - [ ] User profile settings page

- [ ] **Content Pages**
  - [ ] Tattoo History page with timeline and cultural information
  - [ ] Aftercare guide with healing timeline and product recommendations
  - [ ] FAQ page with common questions and answers
  - [ ] Terms & Conditions and Privacy Policy pages

- [ ] **User Dashboard**
  - [ ] User profile management
  - [ ] Saved/favorited artists and studios
  - [ ] Appointment history and upcoming bookings
  - [ ] Personal gallery of tattoos

### Medium Priority
- [ ] **Studio Admin Dashboard**
  - [ ] Artist management for studio owners
  - [ ] Booking calendar and appointment management
  - [ ] Portfolio management tools
  - [ ] Analytics and reporting

- [ ] **Search and Discovery**
  - [ ] Advanced search functionality with filters
  - [ ] Location-based search with map integration
  - [ ] Style-based recommendations

### Future Enhancements
- [ ] **Booking System**
  - [ ] Online appointment scheduling
  - [ ] Deposit payment processing
  - [ ] Consultation request forms

- [ ] **Community Features**
  - [ ] Comments and discussions on posts
  - [ ] Private messaging between users and artists
  - [ ] Event creation and RSVP functionality

## Upcoming Features

- User authentication with Supabase Auth
- User-generated content (posts, comments, likes)
- Artist booking system
- Enhanced search and filtering
- Personalized feed based on user preferences
- Responsive design improvements for mobile devices

## Known Issues

- Some API endpoints may return 500 errors due to database schema mismatches
- Missing assets for some tribe icons may cause 404 errors
- Hydration warnings may appear in the console (these don't affect functionality)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
