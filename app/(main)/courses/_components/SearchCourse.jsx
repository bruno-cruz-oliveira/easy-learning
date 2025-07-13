"use client";

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

export const SearchCourse = ({search, handleChange}) => {
  return (
    <div className="relative h-10 max-lg:w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 h-4 w-4" />
      <Input
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Search courses..."
        className="pl-8 pr-3 py-2 text-sm" // Add additional styling as needed
      />
    </div>
  );
};