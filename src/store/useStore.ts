import { create } from 'zustand';
import type { Artist, Studio, TattooStyle, Tribe, User, Post, Event } from '@/types';

interface StoreState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  
  // Data state
  styles: TattooStyle[];
  tribes: Tribe[];
  artists: Artist[];
  studios: Studio[];
  posts: Post[];
  events: Event[];
  
  // Filters
  selectedStyles: number[];
  selectedTribes: number[];
  locationFilter: string;
  
  // Actions
  setStyles: (styles: TattooStyle[]) => void;
  setTribes: (tribes: Tribe[]) => void;
  setArtists: (artists: Artist[]) => void;
  setStudios: (studios: Studio[]) => void;
  setPosts: (posts: Post[]) => void;
  setEvents: (events: Event[]) => void;
  
  toggleStyleFilter: (styleId: number) => void;
  toggleTribeFilter: (tribeId: number) => void;
  setLocationFilter: (location: string) => void;
  clearFilters: () => void;
}

const useStore = create<StoreState>((set) => ({
  // User state
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  // Data state
  styles: [],
  tribes: [],
  artists: [],
  studios: [],
  posts: [],
  events: [],
  
  // Filters
  selectedStyles: [],
  selectedTribes: [],
  locationFilter: '',
  
  // Actions
  setStyles: (styles) => set({ styles }),
  setTribes: (tribes) => set({ tribes }),
  setArtists: (artists) => set({ artists }),
  setStudios: (studios) => set({ studios }),
  setPosts: (posts) => set({ posts }),
  setEvents: (events) => set({ events }),
  
  toggleStyleFilter: (styleId) => set((state) => ({
    selectedStyles: state.selectedStyles.includes(styleId)
      ? state.selectedStyles.filter(id => id !== styleId)
      : [...state.selectedStyles, styleId]
  })),
  
  toggleTribeFilter: (tribeId) => set((state) => ({
    selectedTribes: state.selectedTribes.includes(tribeId)
      ? state.selectedTribes.filter(id => id !== tribeId)
      : [...state.selectedTribes, tribeId]
  })),
  
  setLocationFilter: (location) => set({ locationFilter: location }),
  
  clearFilters: () => set({
    selectedStyles: [],
    selectedTribes: [],
    locationFilter: ''
  }),
}));

export default useStore;
