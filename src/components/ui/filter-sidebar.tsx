"use client";

import React, { useState } from 'react';
import { Search, X, ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useStore from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterSidebarProps {
  type: 'artists' | 'studios';
  className?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ type, className = '' }) => {
  const {
    styles,
    tribes,
    selectedStyles,
    selectedTribes,
    locationFilter,
    toggleStyleFilter,
    toggleTribeFilter,
    setLocationFilter,
    clearFilters,
  } = useStore();

  const [expandedSections, setExpandedSections] = useState({
    styles: true,
    tribes: true,
    location: true,
  });

  const toggleSection = (section: 'styles' | 'tribes' | 'location') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <div className={`bg-card rounded-lg border p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-xs"
        >
          Clear All
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={`Search ${type}...`}
          className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
        />
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('location')}
        >
          <h4 className="font-medium flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expandedSections.location ? 'rotate-180' : ''
            }`}
          />
        </div>
        <AnimatePresence>
          {expandedSections.location && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 py-2">
                <input
                  type="text"
                  placeholder="City or zip code"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setLocationFilter('New York')}
                  >
                    New York
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setLocationFilter('Los Angeles')}
                  >
                    LA
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setLocationFilter('Chicago')}
                  >
                    Chicago
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Styles Filter */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('styles')}
        >
          <h4 className="font-medium">Styles</h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expandedSections.styles ? 'rotate-180' : ''
            }`}
          />
        </div>
        <AnimatePresence>
          {expandedSections.styles && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 py-2">
                {styles.map((style) => (
                  <div key={style.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`style-${style.id}`}
                      checked={selectedStyles.includes(style.id)}
                      onChange={() => toggleStyleFilter(style.id)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={`style-${style.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {style.name}
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tribes Filter */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('tribes')}
        >
          <h4 className="font-medium">Tribes</h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expandedSections.tribes ? 'rotate-180' : ''
            }`}
          />
        </div>
        <AnimatePresence>
          {expandedSections.tribes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 py-2">
                {tribes.map((tribe) => (
                  <div key={tribe.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`tribe-${tribe.id}`}
                      checked={selectedTribes.includes(tribe.id)}
                      onChange={() => toggleTribeFilter(tribe.id)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={`tribe-${tribe.id}`}
                      className="text-sm cursor-pointer flex items-center"
                    >
                      <img
                        src={tribe.iconUrl}
                        alt={tribe.name}
                        className="w-4 h-4 mr-1"
                      />
                      {tribe.name}
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters */}
      {(selectedStyles.length > 0 || selectedTribes.length > 0 || locationFilter) && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {selectedStyles.map((styleId) => {
              const style = styles.find((s) => s.id === styleId);
              return (
                <div
                  key={`active-style-${styleId}`}
                  className="bg-primary/10 text-primary text-xs rounded-full px-3 py-1 flex items-center"
                >
                  {style?.name}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => toggleStyleFilter(styleId)}
                  />
                </div>
              );
            })}
            {selectedTribes.map((tribeId) => {
              const tribe = tribes.find((t) => t.id === tribeId);
              return (
                <div
                  key={`active-tribe-${tribeId}`}
                  className="bg-secondary/20 text-secondary-foreground text-xs rounded-full px-3 py-1 flex items-center"
                >
                  {tribe?.name}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => toggleTribeFilter(tribeId)}
                  />
                </div>
              );
            })}
            {locationFilter && (
              <div className="bg-accent/20 text-accent-foreground text-xs rounded-full px-3 py-1 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {locationFilter}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => setLocationFilter('')}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
