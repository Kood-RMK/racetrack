"use client";

import React from "react";
import { Race } from "@/racetrack/types/stateTypes";
import { useSocket } from "@/components/socket/SocketProvider";


interface RaceCardProps {
  race: Race;
  onDelete?: () => void;
  //onModify?: () => void;
  tags: React.ReactNode;  // Accepts any tag elements passed from Tags.tsx
  buttons?: React.ReactNode;
}



export default function RaceCard ({ race, tags, buttons}: RaceCardProps) {

  const socket = useSocket();

  const maxDrivers = 8;
  const contestants = race?.contestants ?? [];
  console.log("📦 Race contestants raw:", race?.contestants);



  return (
    <div className="bg-gray-100 w-full h-full p-4 gap-4 flex flex-col font-cairo">
      {/* Tags */}
      <div className="tags">{tags}</div>

      {/* Driver Info */}
      <div className="w-full h-full items-center">

        <h3 className="text-xl font-semibold">
          Drivers {contestants?.length ?? 0}/{maxDrivers}
        </h3>

        <div className="grid grid-cols-2 p-10 w-full h-full justify-center items-center gap-y-4">
          {Array(maxDrivers).fill(null).map((_, index) => {
            const driver = contestants[index];
            console.log("drivers:", driver);
            
              return (
                <div key={index} className="text-center text-sm font-medium">
                  <p>Racecar {`${driver?.racecar ?? index + 1}`}</p>
                  <p className="text-black font-medium text-base max-w-xs md:max-w-sm">
                    {driver?.name ?? "-"}
                  </p>
                </div>
              );

            })}
        </div>
      </div>

    {/* Buttons */}
    <div className="buttons">{buttons}</div>
    </div>
    
  );
}