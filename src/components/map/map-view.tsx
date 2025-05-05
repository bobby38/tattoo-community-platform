'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LocationData, DEFAULT_CENTER, DEFAULT_ZOOM, getMapCenter } from '@/lib/map-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

// Need to import Leaflet CSS
import 'leaflet/dist/leaflet.css';
import L, { divIcon } from 'leaflet';

// Fix for the marker icon issue in Next.js
// This is needed because of how Next.js handles static assets
const createMarkerIcon = (type: 'studio' | 'artist' | 'event') => {
  const color = type === 'studio' ? '#3b82f6' : type === 'artist' ? '#f97316' : '#ef4444';
  
  return divIcon({
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Component to handle map center changes
const MapCenterController = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      console.log('MapCenterController: Setting map view to', center);
      map.setView([center.lat, center.lng], DEFAULT_ZOOM);
    }
  }, [center, map]);
  
  return null;
};

// Component to handle map bounds to show all markers
const MapBoundsController = ({ locations }: { locations: LocationData[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map && locations && locations.length > 0) {
      console.log('MapBoundsController: Setting bounds to show all locations');
      
      // Create bounds object
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      
      // Fit the map to these bounds with some padding
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 13
      });
    }
  }, [map, locations]);
  
  return null;
};

interface MapViewProps {
  locations: LocationData[];
  selectedCity?: string;
  selectedLocation?: LocationData | null;
  onMarkerClick?: (location: LocationData) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  locations, 
  selectedCity,
  selectedLocation,
  onMarkerClick
}) => {
  const [mounted, setMounted] = useState(false);
  const [mapKey, setMapKey] = useState(Date.now()); 
  
  // Filter out locations with invalid coordinates
  const validLocations = locations.filter(loc => {
    return typeof loc.lat === 'number' && 
           typeof loc.lng === 'number' && 
           !isNaN(loc.lat) && 
           !isNaN(loc.lng);
  });
  
  // Calculate map center
  let mapCenter = DEFAULT_CENTER;
  
  if (selectedLocation) {
    mapCenter = { lat: selectedLocation.lat, lng: selectedLocation.lng };
  } else if (validLocations.length > 0) {
    mapCenter = { lat: validLocations[0].lat, lng: validLocations[0].lng };
  }
  
  // Set mounted state when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('MapView: Mounting with locations:', locations);
      setMounted(true);
      
      // Generate a new key whenever locations change to force re-creation of the map
      setMapKey(Date.now());
    }
    
    return () => {
      // Cleanup function to ensure map is properly destroyed
      console.log('MapView: Unmounting');
    };
  }, [locations, selectedLocation]); 
  
  // Handle marker click
  const handleMarkerClick = (location: LocationData) => {
    console.log('MapView: Marker clicked:', location);
    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };
  
  // If not mounted, show loading spinner
  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-[500px] bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  return (
    <div className="h-[500px] bg-gray-800 rounded-lg overflow-hidden">
      {validLocations.length > 0 ? (
        <MapContainer
          key={mapKey} 
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {validLocations.map(location => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createMarkerIcon(location.type as 'studio' | 'artist' | 'event')}
              eventHandlers={{
                click: () => handleMarkerClick(location),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{location.name}</h3>
                  <p className="text-sm">{location.address}</p>
                  <p className="text-sm">{location.city}, {location.country}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {validLocations.length > 1 && (
            <MapBoundsController locations={validLocations} />
          )}
        </MapContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mb-4">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p className="text-gray-400 text-center">No locations found.</p>
        </div>
      )}
    </div>
  );
};

export default MapView;
