"use client";

import React from "react";

interface HeaderProps {
    trackStateLabel: string;
  }

  export default function NextRaceHeader() {
    return (
        <div className="bg-black text-white px-6 py-4 w-full max-w-screen-lg mx-auto">
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-bold">NEXT RACE</span>
            <div className="h-1 w-full bg-gradient-to-r from-black via-red-500 to-bl"></div>
            <span className="text-sm">BEACHSIDE RACETRACK</span>
          </div>
      </div>
      
    );
  };