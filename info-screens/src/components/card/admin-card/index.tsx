"use client";

import React from "react";

interface RaceCardProps {
  tags: React.ReactNode;  // Accepts any tag elements passed from Tags.tsx
  buttons?: React.ReactNode;
}


export default function AdminRaceCard ({ tags, buttons}: RaceCardProps) {

  return (
<div className="bg-gray-100 w-full h-full p-4 gap-4 flex flex-col font-cairo">
    
    {/*Tags*/}
    <div className="tags">{tags}</div>
    
    {/* Driver Info */}
    <div className="w-full h-full items-center">
        <h3 className="text-xl font-semibold">
        Drivers 8/8
        </h3>
        <div className="grid grid-cols-2 p-10 w-full h-full justify-center items-center gap-y-4">
            {Array(8)
            .fill(0)
            .map((_, index) => (
                <div key={index} className="text-center text-sm font-medium">
                    <p>Racecar {index + 1}</p>
                    <p className="text-black font-medium text-base max-w-xs md:max-w-sm">Test Driver</p>
                </div>
            ))}
        </div>
    </div>

    {/* Buttons */}
    <div className="buttons">{buttons}</div>
    </div>
    
  );
}