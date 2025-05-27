"use client";

import React from "react";

interface HeaderProps {
    trackStateLabel: string;
  }

  export default function Header({ trackStateLabel }: HeaderProps) {
    return (
        <div className="bg-black text-white px-6 py-4 w-full max-w-screen-lg mx-auto">
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div className="flex flex-col items-start">
            <span className="text-sm">TRACK STATE</span>
            <span className="font-bold text-lg">{ trackStateLabel }</span>
          </div>
      
          {/* Center Section */}
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-bold">RACE LEADERBOARD</span>
            <div className="h-1 w-full bg-gradient-to-r from-black via-red-500 to-bl"></div>
            <span className="text-sm">BEACHSIDE RACETRACK</span>
          </div>
      
          {/* Right Section */}
          <div className="flex flex-col items-end">
            <span className="text-sm">TIME LEFT</span>
            <span className="font-bold text-lg">08:05:03</span>
          </div>
        </div>
      </div>
      
    );
  };

