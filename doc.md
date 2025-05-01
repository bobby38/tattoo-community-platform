**Overview**  
A tattoo portal brings together fans, studios, artists and curious newcomers. It’s your one-stop spot to browse styles, find a local shop, share your ink, learn care tips and dive into the art’s past and present—all in one lively, image-driven hub.

---

## 1. Site & App Structure

1. **Home**  
   - Full-bleed hero image (or subtle loop animation)  
   - Quick links: Directory, Gallery, Events, Styles, Community  
   - “Inked of the Week” spotlight  
   - Latest blog or news highlights  

2. **Directory**  
   - **Studios** & **Artists** lists with filters (location, style, price)  
   - Map toggle with colored pins by tribe/style  
   - Quick “Book Now” or “View Portfolio” buttons  

3. **Community Gallery**  
   - User uploads: photo, caption, style/body-part tags  
   - Star ratings + comments  
   - Live “Ink Drops” ticker for new posts  

4. **Events & Calendar**  
   - Month-by-month calendar view  
   - Event pages with details, ticket links, “Add to Calendar”  

5. **Style Explorer & Trends**  
   - Hover-animated style cards (Watercolor, Tribal, Blackwork…)  
   - Mini trend charts showing what’s rising in saves/shares  

6. **History & Icons**  
   - Scroll-triggered timeline with key milestones  
   - Flip-cards for figures like Zombie Boy, Sailor Jerry  

7. **Care & Removal**  
   - Healing timeline widget based on your tattoo date  
   - Removal cost calculator by size/color  
   - Product recommendations  

8. **Blog & Resources**  
   - How-tos, interviews, gear reviews, glossary entries  

9. **Onboarding & Profile**  
   - Signup/Login (email or social)  
   - Taste quiz: pick favorite styles → auto-join tribes (Polynesian, Maori…)  
   - “My Profile” shows your top 3 styles, joined tribes, badges, saved favorites  

10. **Tribe Hubs**  
    - Community pages per tribe with featured artists, posts, events  
    - Discussion threads and Q&A sessions  

11. **Admin Dashboard**  
    - Approve uploads, reviews, event listings  
    - View analytics: top styles, active users, new signups  

---

## 2. Key Features

- **Smart Search & Filters**  
  - Auto-suggest for studios, artists, tags  
  - Filter results by style, tribe, location radius, rating  

- **Interactive Map**  
  - Pins color-coded by tribe/style  
  - Pop-out cards on hover/tap with key info + “Book”  

- **Ratings & Badges**  
  - Star reviews with optional “verified” ticks  
  - User levels: “Inked Explorer,” “Tribal Insider,” “Review Master”  

- **Animated Micro-interactions**  
  - Hover GIFs, before/after sliders, confetti bursts on badge unlock  

- **Personalized Feed**  
  - Shows new posts/events in your tribes or top styles  
  - Optional global feed  

- **Social Sharing**  
  - One-click share to Instagram, TikTok, Facebook  
  - Hashtag campaigns (#MyTattooStory)  

- **SEO & Metadata**  
  - Schema for events, reviews, locations  
  - Open Graph tags for rich link previews  

---

## 3. Data Model

### `users`  
| Column        | Type        | Notes                      |
|---------------|-------------|----------------------------|
| id            | INT (PK)    |                            |
| name          | VARCHAR(100)|                            |
| email         | VARCHAR(150)| UNIQUE                     |
| password_hash | VARCHAR(255)|                            |
| role          | ENUM        | user / admin               |
| created_at    | DATETIME    |                            |

### `studios`  
| Column     | Type          | Notes              |
|------------|---------------|--------------------|
| id         | INT (PK)      |                    |
| name       | VARCHAR(150)  |                    |
| address    | VARCHAR(255)  |                    |
| city       | VARCHAR(100)  |                    |
| lat, lng   | DECIMAL       | for map            |
| website    | VARCHAR(255)  |                    |

### `artists`  
| Column      | Type         | Notes               |
|-------------|--------------|---------------------|
| id          | INT (PK)     |                     |
| studio_id   | INT (FK)     | → `studios.id`      |
| name        | VARCHAR(100) |                     |
| bio         | TEXT         |                     |
| instagram   | VARCHAR(100) |                     |

### `styles`  
| Column | Type         | Notes                  |
|--------|--------------|------------------------|
| id     | INT (PK)     |                        |
| name   | VARCHAR(50)  | e.g. “Watercolor”      |
| slug   | VARCHAR(50)  |                        |

### `tribes`  
| Column      | Type         | Notes                      |
|-------------|--------------|----------------------------|
| id          | INT (PK)     |                            |
| name        | VARCHAR(100) | e.g. “Polynesian”          |
| slug        | VARCHAR(100) |                            |
| icon_url    | VARCHAR(255) |                            |

### `posts` (user tattoos)  
| Column      | Type         | Notes                       |
|-------------|--------------|-----------------------------|
| id          | INT (PK)     |                             |
| user_id     | INT (FK)     | → `users.id`                |
| artist_id   | INT (FK)     | → `artists.id` (nullable)   |
| image_url   | VARCHAR(255) |                             |
| caption     | TEXT         |                             |

### `reviews`  
| Column      | Type         | Notes                       |
|-------------|--------------|-----------------------------|
| id          | INT (PK)     |                             |
| user_id     | INT (FK)     | → `users.id`                |
| target_type | ENUM         | studio / artist / post      |
| target_id   | INT          | FK to matching table        |
| rating      | TINYINT      | 1–5                         |
| comment     | TEXT         |                             |

### `events`  
| Column      | Type         | Notes                      |
|-------------|--------------|----------------------------|
| id          | INT (PK)     |                            |
| title       | VARCHAR(150) |                            |
| description | TEXT         |                            |
| venue       | VARCHAR(255) |                            |
| date_from   | DATE         |                            |
| date_to     | DATE         |                            |

### `sponsors`  
| Column    | Type         | Notes                      |
|-----------|--------------|----------------------------|
| id        | INT (PK)     |                            |
| name      | VARCHAR(100) |                            |
| logo_url  | VARCHAR(255) |                            |
| website   | VARCHAR(255) |                            |

### Join tables  

| Table             | Columns                              |
|-------------------|--------------------------------------|
| `artist_styles`   | artist_id → `artists.id`<br>style_id → `styles.id` |
| `tribe_styles`    | tribe_id → `tribes.id`<br>style_id → `styles.id`   |
| `user_styles`     | user_id → `users.id`<br>style_id → `styles.id`<br>score 1–10 |
| `user_tribes`     | user_id → `users.id`<br>tribe_id → `tribes.id`      |
| `post_tags`       | post_id → `posts.id`<br>tag_id → `tags.id`          |
| `studio_tags`     | studio_id → `studios.id`<br>tag_id → `tags.id`      |
| `event_sponsors`  | event_id → `events.id`<br>sponsor_id → `sponsors.id`|

---

## 4. Search & Recommendations

- **Full-text** across names, captions  
- **Filters** by style, tribe, location (radius), rating  
- **Recommendation engine** shows artists/studios matching a user’s top styles and tribes  

---

## 5. Technical Stack

- **Front-end**: React or Vue with server-side rendering (Next.js/Nuxt)  
- **Back-end**: Node.js/Express or Laravel, REST or GraphQL API  
- **CMS**: Headless CMS (Strapi) or WordPress with custom types  
- **Search**: Algolia or ElasticSearch  
- **Maps**: Google Maps or Mapbox  
- **Auth**: OAuth + JWT sessions  
- **Media**: Cloudinary or Imgix  
- **Calendar**: FullCalendar.js or events plugin  
- **Analytics**: Google Analytics + Hotjar  

---

## 6. Content & Partnerships

- **Artist Onboarding Kit**: profile guide, photo specs  
- **Studio Sponsorships**: featured listings, banner slots  
- **Event Feeds**: API or manual event entry  
- **Educational Partners**: tattoo schools for how-to guides  
- **Affiliate Links**: aftercare products, gear  

---

## 7. Engagement & Growth

- **Weekly Email**: “Inked of the Week,” tribe news, new styles  
- **Social Challenges**: #MyTattooStory with prizes  
- **Live Chats**: Monthly Q&A with pro artists  
- **Mobile App (Phase 2)**: Offline map, push reminders for events  

---

This gives you a single, integrated plan—pages, features, data model, tech choices and starter details—so you can spin up an MVP that looks great, feels alive and connects fans, artists and studios in one place.


Here are three example JSON objects—one each for a studio, an artist and a user—showing the kinds of fields you might store. They’re loaded with fun, value-driven info like styles, inspiration sources, gear, reviews and more.

```json
// Studio (Improved Example)
{
  "id": 101,
  "name": "Inked Legends Studio",
  "address": "123 Ink St, Singapore",
  "city": "Singapore",
  "lat": 1.3521,
  "lng": 103.8198,
  "profile_image_url": "https://cdn.example.com/studio_profile.jpg",
  "gallery_image_urls": [
    "https://cdn.example.com/studio_gallery1.jpg",
    "https://cdn.example.com/studio_gallery2.jpg"
  ],
  "styles": ["Neo-traditional", "Blackwork", "Watercolor"],
  "tribes": ["Celtic", "Polynesian"],
  "specialties": ["Large scale blackwork", "Cover-ups"],
  "ink_brands": ["Eternal Ink", "Intenze"],
  "equipment": ["Cheyenne Hawk Pen", "FK Irons Flux"],
  "amenities": ["Free Wi-Fi", "Coffee Bar", "Art Library"],
  "artist_ids": [201, 202],
  "opening_hours": {
    "monday": "10:00-18:00",
    "tuesday": "10:00-18:00",
    "wednesday": "Closed",
    "thursday": "10:00-18:00",
    "friday": "10:00-20:00",
    "saturday": "11:00-19:00",
    "sunday": "Closed"
  },
  "contact_info": {
    "phone": "+65 1234 5678",
    "email": "info@inkedlegends.sg",
    "website": "https://inkedlegends.sg"
  },
  "accepting_walk_ins": false,
  "ratings": {
    "average": 4.8,
    "count": 120
  },
  "reviews": [
    { "user_id": 501, "rating": 5, "comment": "Amazing vibes and super clean work!" },
    { "user_id": 502, "rating": 4, "comment": "Great designs but a bit pricey." }
  ]
}
```

```json
// Artist (Improved Example)
{
  "id": 201,
  "studio_id": 101,
  "name": "Luna Inkheart",
  "avatar_url": "https://cdn.example.com/luna_avatar.jpg",
  "bio": "Luna weaves lunar motifs with watercolor flair—moon phases meet pastel blossoms.",
  "styles": ["Watercolor", "Fine Line", "Dotwork"],
  "tribes": ["Japanese Irezumi"],
  "years_experience": 5,
  "inspiration_sources": ["Van Gogh", "Hokusai", "Nature"],
  "equipment": {
    "machine": "Cheyenne Hawk",
    "power_supply": "Critical",
    "needles": ["T1", "R3", "M1"]
  },
  "favorite_inks": ["Eternal Ink - Pastel Pink", "Intenze - Deep Blue"],
  "portfolio": [
    "https://cdn.example.com/luna_portfolio1.jpg",
    "https://cdn.example.com/luna_portfolio2.jpg"
  ],
  "hourly_rate_range": "$180-220/hr",
  "booking_info": "Booking via website: inkedlegends.sg/luna",
  "is_guest_artist": false,
  "ratings": {
    "average": 4.9,
    "count": 75
  },
  "reviews": [
    { "user_id": 503, "rating": 5, "comment": "Luna captured my vision perfectly!" }
  ]
}
```

```json
// User (Improved Example)
{
  "id": 501,
  "username": "InkExplorer",
  "name": "Alex Tan",
  "email": "alex@example.com",
  "avatar_url": "https://cdn.example.com/alex_avatar.jpg",
  "location": "Singapore",
  "taste_profile": {
    "favorite_styles": ["Blackwork", "Traditional", "Watercolor"],
    "favorite_tribes": ["Celtic", "Maori"]
  },
  "liked_posts": [301, 302],
  "bookmarked_studios": [101],
  "following_artists": [201],
  "tattoo_collection": [
    {
      "description": "Celtic knot armband",
      "style": "Blackwork",
      "artist_id": 202,
      "studio_id": 101,
      "date": "2023-05-15",
      "image_url": "https://cdn.example.com/alex_tattoo1.jpg"
    }
  ],
  "reviews_written": [
    { "target_type": "studio", "target_id": 101, "rating": 5, "comment": "Loved the atmosphere!" }
  ],
  "privacy_settings": {
    "profile_visibility": "public",
    "show_location": true,
    "show_collection": true
  }
}
```

**How you’d use these:**
- **Studios** get geodata for maps, style lists for filters, branded gear info for trust, plus user reviews.  
- **Artists** carry bio, portfolio links, gear specs and inspiration sources so fans can connect on shared influences.  
- **Users** build a taste profile (style scores, tribes), track likes/bookmarks/follows, and write reviews—fueling personalization and community.