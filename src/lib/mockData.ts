import { TattooStyle, Tribe, Artist, Studio, User, Review, RatingInfo, Post, Event } from '@/types';

export const mockStyles: TattooStyle[] = [
  {
    id: '1',
    name: 'Traditional',
    slug: 'traditional',
    description: 'Bold lines, vibrant colors, and iconic imagery like roses, anchors, and eagles.',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/03/13/30/people-2576336_1280.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Neo-Traditional',
    slug: 'neo-traditional',
    description: 'An evolution of traditional style with a broader color palette and more detailed designs.',
    imageUrl: 'https://cdn.pixabay.com/photo/2019/06/08/11/30/people-4259948_1280.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Realism',
    slug: 'realism',
    description: 'Photorealistic images that look like photographs on skin.',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/11/14/13/06/tattoo-2948258_1280.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Watercolor',
    slug: 'watercolor',
    description: 'Vibrant, fluid designs that mimic watercolor painting techniques.',
    imageUrl: 'https://cdn.pixabay.com/photo/2019/06/12/15/07/cat-4269479_1280.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Blackwork',
    slug: 'blackwork',
    description: 'Bold designs using only black ink, often featuring geometric patterns.',
    imageUrl: 'https://cdn.pixabay.com/photo/2016/03/27/17/42/man-1283235_1280.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Japanese',
    slug: 'japanese',
    description: 'Traditional Japanese motifs like koi fish, dragons, and cherry blossoms.',
    imageUrl: 'https://cdn.pixabay.com/photo/2020/03/28/16/05/japanese-4977442_1280.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockTribes: Tribe[] = [
  {
    id: '1',
    name: 'Traditional Enthusiasts',
    slug: 'traditional-enthusiasts',
    description: 'For lovers of bold lines and timeless designs that never go out of style.',
    icon_url: '/images/tribes/traditional-enthusiasts.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Polynesian Collective',
    slug: 'polynesian-collective',
    description: 'Celebrating the rich heritage of Polynesian tattoo traditions and patterns.',
    icon_url: '/images/tribes/polynesian-collective.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Minimalist Ink',
    slug: 'minimalist-ink',
    description: 'Less is more - simple, clean designs with powerful impact.',
    icon_url: '/images/tribes/minimalist-ink.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Color Explosion',
    slug: 'color-explosion',
    description: 'Vibrant, colorful tattoos that make a bold statement.',
    icon_url: '/images/tribes/color-explosion.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockStudios: Studio[] = [
  {
    id: 1,
    name: 'Ink Masters Studio',
    address: '123 Main Street',
    city: 'New York',
    lat: 40.7128,
    lng: -74.0060,
    contact_info: { phone: '555-1234', website: 'https://inkmasters.example.com' },
    profile_image_url: 'https://cdn.pixabay.com/photo/2019/05/04/14/33/tattoo-4178296_1280.jpg',
    styles: ['Traditional', 'Neo-Traditional', 'Watercolor', 'Blackwork', 'Realism', 'Japanese'],
    artist_ids: [1, 2],
    ratings: { average: 4.8, count: 150 },
    reviews: [
      { user_id: 101, rating: 5, comment: 'Clean shop, amazing artists!' },
      { user_id: 102, rating: 4, comment: 'Great work, booking was a bit slow.' }
    ],
  },
  {
    id: 2,
    name: 'Electric Needle',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    lat: 34.0522,
    lng: -118.2437,
    contact_info: { email: 'contact@electricsoul.ink' },
    profile_image_url: 'https://cdn.pixabay.com/photo/2017/07/11/15/51/tattoo-2493750_1280.jpg',
    styles: ['Traditional', 'Watercolor', 'Japanese'],
    artist_ids: [3, 6],
    ratings: { average: 4.7, count: 120 },
    reviews: [
      { user_id: 103, rating: 5, comment: 'Mike is a legend!' },
    ],
  },
  {
    id: 3,
    name: 'Black Lotus Tattoo',
    address: '789 Pine Boulevard',
    city: 'Chicago',
    lat: 41.8781,
    lng: -87.6298,
    contact_info: { phone: '555-5678', website: 'https://blacklotus.example.com' },
    profile_image_url: 'https://cdn.pixabay.com/photo/2018/03/19/18/20/tattoo-3240125_1280.jpg',
    styles: ['Neo-Traditional', 'Blackwork', 'Realism'],
    artist_ids: [4, 7],
    ratings: { average: 4.6, count: 95 },
    reviews: [
      { user_id: 101, rating: 4, comment: 'Elena did a great job on my sleeve.' },
    ],
  }
];

export const mockArtists: Artist[] = [
  {
    id: 1,
    studio_id: 1,
    name: 'Alex Johnson',
    avatar_url: 'https://cdn.pixabay.com/photo/2017/11/02/14/27/model-2911332_1280.jpg',
    bio: 'Specializing in traditional and neo-traditional styles with 10+ years of experience.',
    styles: ['Traditional', 'Neo-Traditional'],
    years_experience: 7,
    hourly_rate_range: '$150-200/hr',
    portfolio: [
      'https://cdn.pixabay.com/photo/2017/09/01/01/21/fantasy-2702261_1280.jpg',
      'https://cdn.pixabay.com/photo/2018/03/19/10/51/fantasy-3239547_1280.jpg'
    ],
    ratings: { average: 4.8, count: 45 },
    contact_info: { instagram: '@alexjtattoos' }
  },
  {
    id: 2,
    studio_id: 1,
    name: 'Samantha Lee',
    avatar_url: 'https://cdn.pixabay.com/photo/2018/01/15/07/52/woman-3083401_1280.jpg',
    bio: 'Watercolor specialist with a background in fine arts and illustration.',
    styles: ['Watercolor'],
    years_experience: 5,
    hourly_rate_range: '$170-210/hr',
    portfolio: [
      'https://cdn.pixabay.com/photo/2016/12/02/05/08/woman-1877056_1280.jpg'
    ],
    ratings: { average: 4.9, count: 60 },
    contact_info: { instagram: '@samleeart' }
  },
  {
    id: 3,
    studio_id: 2,
    name: 'Marcus Chen',
    avatar_url: 'https://cdn.pixabay.com/photo/2017/08/01/17/05/tattoo-artist-2566879_1280.jpg',
    bio: 'Japanese tattoo master trained in traditional Irezumi techniques.',
    styles: ['Japanese'],
    years_experience: 15,
    hourly_rate_range: '$200-300/hr',
    portfolio: [
      'https://cdn.pixabay.com/photo/2017/08/01/17/05/tattoo-artist-2566879_1280.jpg'
    ],
    ratings: { average: 4.9, count: 80 },
    contact_info: { instagram: '@marcusinkmaster' }
  },
  {
    id: 4,
    studio_id: 3,
    name: 'Olivia Rodriguez',
    avatar_url: 'https://cdn.pixabay.com/photo/2018/04/05/09/32/portrait-3292287_1280.jpg',
    bio: 'Blackwork and dotwork specialist with a minimalist approach.',
    styles: ['Blackwork'],
    years_experience: 6,
    hourly_rate_range: '$160-220/hr',
    portfolio: [
      'https://cdn.pixabay.com/photo/2018/04/05/09/32/portrait-3292287_1280.jpg'
    ],
    ratings: { average: 4.8, count: 55 },
    contact_info: { instagram: '@oliviablackink' }
  }
];

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'jsmith',
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    avatar_url: 'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg',
    location: 'Anytown',
    taste_profile: {
      favorite_styles: ['Traditional', 'Japanese']
    },
    liked_posts: [1, 3],
    bookmarked_studios: [1, 3],
    following_artists: [1, 4],
  },
  {
    id: 2,
    username: 'taylor_jones',
    name: 'Taylor Wong',
    email: 'taylor@example.com',
    avatar_url: 'https://cdn.pixabay.com/photo/2018/01/24/19/49/people-3104635_1280.jpg',
    location: 'Lakeside',
    taste_profile: {
      favorite_styles: ['Traditional', 'Neo-Traditional']
    },
    liked_posts: [2, 4],
    bookmarked_studios: [4],
    following_artists: [5, 8],
  },
  {
    id: 3,
    username: 'avery_g',
    name: 'Avery Johnson',
    email: 'avery@example.com',
    avatar_url: 'https://cdn.pixabay.com/photo/2017/02/16/23/10/smile-2072907_1280.jpg',
    location: 'Metro City',
    taste_profile: {
      favorite_styles: ['Watercolor']
    },
    liked_posts: [1],
    bookmarked_studios: [2],
    following_artists: [3],
  },
  {
    id: 4,
    username: 'morgan_w',
    name: 'Morgan Lee',
    email: 'morgan@example.com',
    avatar_url: 'https://cdn.pixabay.com/photo/2018/04/27/03/50/woman-3353699_1280.jpg',
    location: 'Anytown',
    taste_profile: {
      favorite_styles: ['Blackwork']
    },
    liked_posts: [4],
    bookmarked_studios: [3],
    following_artists: [4],
  }
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: 'p1',
    user_id: 1,
    artist_id: 1,
    studio_id: 1,
    image_url: 'https://cdn.pixabay.com/photo/2019/08/12/10/03/tattoo-4400625_1280.jpg',
    caption: 'Fresh traditional piece by Alex Johnson!',
    style_ids: ['Traditional'],
  },
  {
    id: 'p2',
    user_id: 2,
    artist_id: 2,
    studio_id: 1,
    image_url: 'https://cdn.pixabay.com/photo/2020/03/26/08/06/tattoo-4969701_1280.jpg',
    caption: 'Love my new watercolor tattoo from Samantha Lee!',
    style_ids: ['Watercolor'],
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Ink Masters Convention 2025',
    description: 'Annual gathering of the best tattoo artists worldwide.',
    venue: 'City Convention Center',
    start_datetime: '2025-08-15T10:00:00Z',
    end_datetime: '2025-08-17T18:00:00Z',
    image_url: 'https://cdn.pixabay.com/photo/2017/08/01/17/05/tattoo-artist-2566879_1280.jpg',
    website: 'https://inkmasters.com',
  },
  {
    id: 'e2',
    title: 'Guest Spot: Marcus Chen at Ink & Iron',
    description: 'Japanese master Marcus Chen will be guesting at Ink & Iron Studio.',
    venue: 'Ink & Iron Studio', // Could also link to studio_id: 2
    start_datetime: '2025-06-01T11:00:00Z',
    end_datetime: '2025-06-07T19:00:00Z',
  }
];

// Export all mock data
export const mockData = {
  styles: mockStyles,
  tribes: mockTribes,
  artists: mockArtists,
  studios: mockStudios,
  users: mockUsers,
  posts: mockPosts,
  events: mockEvents
};
