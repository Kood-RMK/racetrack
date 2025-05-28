'use client';

import React from 'react';
import NextRaceHeader from '@/components/display/next-race-header';
import { RaceScheduleStateProvider, useRaceScheduleState } from '@/app/providers/state/raceScheduleStateProvider';
import { SocketProvider } from '@/app/providers/socket/socketProvider';
import { ActiveRaceStateProvider, useActiveRaceState } from '@/app/providers/state/activeRaceStateProvider';
import { RaceState as ERaceState, ScheduledRace } from 'racetrack-shared/types';
import { AuthenticationProvider } from '@/app/providers/auth/authProvider';

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

function parseTimeslot(timeslot: string): number {
  const [start] = timeslot.split(' - ');
  const [hours, minutes] = start.split(':').map(Number);
  return hours * 60 + minutes;
}

function NextRacePage() {

  const scheduleState = useRaceScheduleState();
  const activeRaceState = useActiveRaceState();

  console.log("scheduleState: ", scheduleState)

  const isRaceActive = activeRaceState?.raceState === ERaceState.Active;

  // Sort races by time
  const sortedRaces = scheduleState
    ? Object.values(scheduleState)
      .filter(race => race.raceState === 'pending')
      .sort((a, b) =>
        parseTimeslot(a.raceScheduledStartTimeSlot) - parseTimeslot(b.raceScheduledStartTimeSlot)
      )
    : [];


  //const earliestRace = sortedRaces[0];


  // const announcements = earliestRace?.contestants?.map((contestant: any) => ({

  //   driver: contestant.name,
  //   car: contestant.racecarNumber,
  // })) ?? [];

  let nextRace: ScheduledRace | null = null;

  if (isRaceActive && activeRaceState?.raceId) {
    const activeRaceIndex = sortedRaces.findIndex(
      (race) => race.raceId === activeRaceState.raceId
    );
    nextRace = sortedRaces[activeRaceIndex + 1] ?? null;

  } else if (sortedRaces.length > 0) {  // If no race is active, show the first upcoming race
    nextRace = sortedRaces[0];
  }

  const announcements =
    nextRace?.contestants?.map((contestant: any) => ({
      driver: contestant.name,
      car: contestant.racecarNumber,
    })) ?? [];

  // If there is a completed race 
  const hasCompletedRace = Object.values(scheduleState || {}).some(
    (race) => race.raceState === 'completed'
  );


  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex flex-col items-center">
      <NextRaceHeader />

      <main className="flex flex-col items-center space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 m-20 pt-10">
          {announcements.map((item, index) => (
            <AnnouncementCard key={index} {...item} />
          ))}
        </div>

        {hasCompletedRace && (
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