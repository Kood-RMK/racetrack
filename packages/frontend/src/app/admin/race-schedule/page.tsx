'use client';

import NewRaceDialog from '@/components/card/schedule-race-card'
import RaceCard from '@/components/card/race-card'
import { RacePendingTags } from '@/components/card/race-card/Tags';
import { RacePendingButtons } from '@/components/card/race-card/Buttons'
import { RaceScheduleControllerProvider, useRaceScheduleController } from '@/app/providers/controllers/raceScheduleControllerProvider';
import { RaceScheduleStateProvider, useRaceScheduleState } from '@/app/providers/state/raceScheduleStateProvider';
import { SocketProvider } from '@/app/providers/socket/socketProvider';
import { RaceScheduleEntry } from 'racetrack-backend/services';


function RaceSchedulePage() {

  const scheduleState = useRaceScheduleState();
  const scheduleController = useRaceScheduleController();

  if (!scheduleState || !scheduleController) {
    return <div>Loading...</div>;
  }

  // Sort the races by the raceDateTime (timeslot)
  //TODO: Write sorting logic.
  // const sortedRaces = scheduleState;

  const sortedRaces = Object.fromEntries(
    Object.entries(scheduleState).map(([raceId, raceData]) => [
      raceId,
      new RaceScheduleEntry(raceData), // ✅ wrap each one
    ])
  );

  return (
    <div className='font-cairo flex flex-col min-h-full p-10 text-5xl'>
      <p className='text-center py-10'>Race Schedule</p>

      <div className='grid grid-cols-1 lg:grid-cols-3 w-full h-full pl-10 pt-10 gap-10 items-start'>

        <NewRaceDialog />

        {Object.entries(sortedRaces).map(([raceId, raceEntry]: [string, RaceScheduleEntry]) => {


          console.log("➡️ Race Entry is this!!!!!!:", raceEntry);
          console.log("📥 Race Entry .race:", raceEntry.race); // ✅ use getter as a property
          console.log("👥 Contestants:", raceEntry.contestants); // also a getter
          console.log("Is instance of RaceScheduleEntry?", raceEntry instanceof RaceScheduleEntry);

          return (
            <RaceCard
              key={raceId}
              race={raceEntry.race}
              tags={<RacePendingTags />}
              buttons={<RacePendingButtons race={raceEntry} />}
            />
          );
        })}

      </div>
    </div>
  );
}

export default function Page() {
  return (

    <SocketProvider url="http://localhost:3001">
      <RaceScheduleStateProvider>
        <RaceScheduleControllerProvider>
          <RaceSchedulePage />
        </RaceScheduleControllerProvider>
      </RaceScheduleStateProvider>
    </SocketProvider>

  )
}
