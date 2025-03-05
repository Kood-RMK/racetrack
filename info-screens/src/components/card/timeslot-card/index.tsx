"use client";

import React from "react";

interface RaceCardProps {
  tags: React.ReactNode;  // Accepts any tag elements passed from Tags.tsx
  buttons: React.ReactNode; // Accepts any button elements passed from Buttons.tsx
}

export default function RaceCard({ tags, buttons }: RaceCardProps ) {

  return (
<div className="bg-gray-100 w-80 h-56 p-4 gap-4 flex flex-col font-cairo">
    
      {/* Header Section for dynamic tags*/}
      <div className="tags">{tags}</div>

      {/* Driver Info */}
      <div className="w-72 h-28 items-center">
        <h3 className="text-lg font-semibold">Drivers 4/8</h3>
        <div className="grid grid-cols-3 mt-1 mb-1 w-72 h-20 justify-center items-center">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="text-center text-xs font-medium">
                <p>Racecar 1</p>
                <p className="text-black font-medium text-sm max-w-xs md:max-w-sm">Test Driver</p>
              </div>
            ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="buttons">{buttons}</div>

    </div>
  );
}