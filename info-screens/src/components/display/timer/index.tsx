"use client";

import React from "react";

interface RaceTimerProps {
    timeLeft: string; // Define type for timeLeft prop
}

const RaceTimer: React.FC<RaceTimerProps> = ({ timeLeft }) => {
    return (
      <div className="flex flex-col items-center text-white">
        <span className="text-sm">TIME LEFT</span>
        <span className="font-bold text-xl">{timeLeft}</span>
      </div>
    );
  };
  
  export default RaceTimer;