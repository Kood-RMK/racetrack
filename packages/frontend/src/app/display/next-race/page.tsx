'use client';

import React from 'react';
import NextRaceHeader from '@/components/display/next-race-header';
import { RaceScheduleStateProvider, useRaceScheduleState } from '@/app/providers/state/raceScheduleStateProvider';
import { SocketProvider } from '@/app/providers/socket/socketProvider';

type AnnouncementCardProps = {
  driver: string;
  car: string;
  borderColor: string;
};

const AnnouncementCard = ({ driver, car, borderColor }: AnnouncementCardProps) => (
  <div
    className={`relative flex flex-col justify-center bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-lg border-l-8 ${borderColor} min-w-[200px]`}
  >
     <div className="text-sm text-gray-400 font-medium">CAR</div>
    <div className="text-2xl font-bold">{car}</div>
    <div className="text-sm text-gray-400 font-medium">DRIVER</div>
    <div className="text-2xl font-bold mb-3">{driver}</div>
   
  </div>
);

function parseTimeslot(timeslot: string): number {
  const [start] = timeslot.split(' - ');
  const [hours, minutes] = start.split(':').map(Number);
  return hours * 60 + minutes;
}
function NextRacePage() {
  
  const scheduleState = useRaceScheduleState();
  console.log("scheduleState: ", scheduleState)

  // Sort races by time
 const sortedRaces = scheduleState
  ? Object.values(scheduleState)
      .filter(race => race.raceState === 'pending')
      .sort((a, b) =>
        parseTimeslot(a.raceScheduledStartTimeSlot) - parseTimeslot(b.raceScheduledStartTimeSlot)
      )
  : [];
  

  const earliestRace = sortedRaces[0];

  const announcements = earliestRace?.contestants?.map((contestant: any) => ({
    
    driver: contestant.name,
    car: contestant.racecarNumber,
    borderColor: 'border-red-600', // You can adjust this based on team/color logic
  })) ?? [];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center border-4 border-red-600">
      <NextRaceHeader />

      <main className="flex flex-col items-center space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mt-6">
          {announcements.map((item, index) => (
            <AnnouncementCard key={index} {...item} />
          ))}
        </div>

        <h3 className="text-3xl md:text-4xl font-semibold text-center text-white tracking-wide uppercase">
          Please proceed to the paddock
        </h3>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <SocketProvider url="http://localhost:3001"> 
      <RaceScheduleStateProvider>
        <NextRacePage />
      </RaceScheduleStateProvider>
    </SocketProvider>
  );
}