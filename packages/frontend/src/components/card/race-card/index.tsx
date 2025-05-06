"use client";

import React from "react";
import { useSocket } from "@/app/providers/socket/socketProvider";
import { ScheduledRace } from "racetrack-shared/types";
import { RaceScheduleEntryState } from "racetrack-backend/services";



interface RaceCardProps {
  race: RaceScheduleEntryState; // ✅ changed from ScheduledRace
  onDelete?: () => void;
  tags: React.ReactNode;
  buttons?: React.ReactNode;
}



export default function RaceCard({ race, tags, buttons }: RaceCardProps) {

  const socket = useSocket();

  const maxDrivers = 8;
  const contestants = race?.contestants ?? [];
  console.log("📦 [RaceCard] Full RaceScheduleEntry received:", race);
  console.log("📦 [RaceCard] Race ID:", race?.raceId);
  console.log("📦 [RaceCard] Race Start DateTime:", race?.raceScheduledStartUnixTime);
  console.log("📦 [RaceCard] Race State:", race?.raceState);
  console.log("📦 [RaceCard] Contestants array:", contestants);



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
                <p>Racecar {`${driver?.racecarNumber ?? index + 1}`}</p>
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