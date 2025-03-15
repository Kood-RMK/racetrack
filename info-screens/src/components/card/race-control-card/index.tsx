"use client";

import React from "react";
import Icon from '@mdi/react';
import { mdiAccountMultiple } from "@mdi/js";

interface RaceCardProps {
  tags: React.ReactNode;  // Accepts any tag elements passed from Tags.tsx
  buttons: React.ReactNode; // Accepts any button elements passed from Buttons.tsx
}

export default function RaceCard({ tags, buttons }: RaceCardProps ) {

  return (
<div className="bg-gray-100 w-full h-full p-8 gap-4 font-cairo">
    
      {/* Header Section for dynamic tags*/}
      <div className="tags">{tags}</div>

      {/* Driver Info */}
      <div className="w-full h-3/6 items-center">

       <h3 className="text-3xl font-semibold py-6 flex items-center gap-4">
        <Icon path={mdiAccountMultiple} size={1.5} />
          Drivers 8/8
       </h3>

        <div className="grid grid-cols-2 grid-rows-4 lg:grid-cols-4 lg:grid-rows-2 lg:my-20 w-full h-full justify-center items-center gap-x-9 gap-y-14 p-10">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="text-center text-2xl font-medium">
                <p>Racecar {index + 1}</p>
                <p className="text-black font-medium text-3xl max-w-xs md:max-w-sm">Test Driver</p>
              </div>
            ))}
        </div>
    
      </div>

      {/* Buttons */}
      <div className="buttons flex justify-end pt-8">{buttons}</div>

    </div>
  );
}