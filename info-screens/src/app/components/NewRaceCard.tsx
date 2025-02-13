"use client";

import React from "react";
import Icon from '@mdi/react';
import { mdiClockTimeFour, mdiCheckerboardPlus } from "@mdi/js";

export default function NewRaceCard() {
    return (
  <div className="bg-gray-100 w-80 h-56 p-4 gap-4 grid font-cairo">

    {/* Header Section */}
    <div className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
        <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
        <span>10:00 - 12:10</span>
    </div>

    {/* Schedule Race */}
    <div className="w-72 h-28 flex flex-col items-center justify-center text-sm font-medium">
        <Icon path={mdiCheckerboardPlus} size={1.5} />
        <span>Schedule Race</span>
    </div>
  </div>
 );
} 
