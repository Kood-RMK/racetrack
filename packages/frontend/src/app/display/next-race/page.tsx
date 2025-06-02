'use client';

import React from 'react';
import NextRaceHeader from '@/components/display/next-race-header';
import { SocketProvider } from '@/app/providers/socket/socketProvider';
import { ActiveRaceStateProvider, useActiveRaceState } from '@/app/providers/state/activeRaceStateProvider';
import { AuthenticationProvider } from '@/app/providers/auth/authProvider';
import { RaceScheduleStateProvider, useRaceScheduleState } from '@/app/providers/state/raceScheduleStateProvider';
import { useRaceScheduleController } from '@/app/providers/controllers/raceScheduleControllerProvider';

type AnnouncementCardProps = {
  driver: string;
  car: string;
};

const AnnouncementCard = ({ driver, car }: AnnouncementCardProps) => (
  <div
    className={`relative flex flex-col justify-center bg-zinc-950 text-white px-6 py-4 font-cairo w-48 border-s border-red-600`}
  >
    <div className="text-sm text-gray-400 font-medium">RACECAR</div>
    <div className="text-2xl font-bold">{car}</div>
    <div className="text-sm text-gray-400 font-medium flex justify-end">DRIVER</div>
    <div className="text-2xl font-bold mb-3 flex justify-end">{driver}</div>
  </div>
);

function NextRacePage() {

  const scheduleState = useRaceScheduleState();
  const activeRaceState = useActiveRaceState();


  // 1. Näita esimest pending racei
  // 2. Kui active raceis ei ole näita please proceed to paddock

  if (!scheduleState.nextRace) {
    return <div>Loading...</div>;
  }

  const upcomingRace = scheduleState.nextRace

  const announcements =
    upcomingRace?.contestants?.map((contestant: any) => ({
      driver: contestant.name,
      car: contestant.racecarNumber,
    })) ?? [];

  
  const hasActiveRace = activeRaceState.activeRaceState? 1 : null;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex flex-col items-center">
      <NextRaceHeader />
      <h2 className='text-center py-10'>{upcomingRace.raceScheduledStartTimeSlot}</h2>

      <main className="flex flex-col items-center space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 m-20 pt-10">
          {announcements.map((item, index) => (
            <AnnouncementCard key={index} {...item} />
          ))}
        </div>

        {!hasActiveRace && (
          <h3 className="text-2xl md:text-2xl font-semibold text-center text-white tracking-wide uppercase font-cairo md:pt-40 pt-80">
            Please proceed to the paddock
          </h3>
        )}


      </main>
    </div>
  );
}

export default function Page() {
  return (
    <AuthenticationProvider>
      <SocketProvider url="http://localhost:3001">
        <ActiveRaceStateProvider>
          <RaceScheduleStateProvider>
            <NextRacePage />
          </RaceScheduleStateProvider>
        </ActiveRaceStateProvider>
      </SocketProvider>
    </AuthenticationProvider>
  );
}