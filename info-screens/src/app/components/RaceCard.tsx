"use client";

import React from "react";
import Icon from '@mdi/react';
import { mdiClockTimeFour } from "@mdi/js";
import { mdiCheck } from '@mdi/js';
import { mdiInvoiceTextEdit } from '@mdi/js';
import { mdiDelete } from '@mdi/js';


export default function RaceCard() {
  return (
<div className="bg-gray-100 w-80 h-56 p-4 gap-4 grid font-cairo">
    
      {/* Header Section */}
      <div className="w-48 h-5 gap-2 flex flex-shrink-0">

        <div className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
          <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
          <span>9:00 - 9:10</span>
        </div>

        <div className="bg-green-100 w-24 h-5 text-xs text-green-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
        <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
          <span>Completed</span>
        </div>
      </div>

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
      <div className="flex justify-end w-72 h-6 gap-2 flex-shrink-0">
        <button className="text-xs flex justify-center items-center bg-blue-800 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
          <Icon path={mdiInvoiceTextEdit} className="w-4 h-4 flex-shrink-0"/>
          <span>Modify Drivers</span>
        </button>

        <button className="text-xs flex justify-center items-center bg-red-700 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
          <Icon path={mdiDelete} className="w-4 h-4 flex-shrink-0"/>
          <span>Delete Race</span>
        </button>
      </div>
    </div>
  );
}
