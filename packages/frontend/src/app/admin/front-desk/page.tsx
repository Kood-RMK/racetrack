'use client';

import NewRaceDialog from '@/components/card/schedule-race-card'
import RaceCard from '@/components/card/race-card'
import { RacePendingTags } from '@/components/card/race-card/Tags';
import { RacePendingButtons } from '@/components/card/race-card/Buttons'
import { RaceScheduleControllerProvider, useRaceScheduleController } from '@/app/providers/controllers/raceScheduleControllerProvider';
import { RaceScheduleStateProvider, useRaceScheduleState } from '@/app/providers/state/raceScheduleStateProvider';
import { SocketProvider } from '@/app/providers/socket/socketProvider';
import { AuthenticationProvider } from '@/app/providers/auth/authProvider';
import { LoginWrapper } from '@/components/authentication/Login';
import { RacetrackClientRole } from 'racetrack-shared/types';


function RaceSchedulePage() {

  const scheduleState = useRaceScheduleState();
  const scheduleController = useRaceScheduleController();

  if (!scheduleState.schedule || !scheduleController) {
    return <div>Loading...</div>;
  }

  

  return (
    <div className='font-cairo flex flex-col min-h-full p-10 text-5xl'>
      <p className='text-center py-10'>Race Schedule</p>

      <div className='grid grid-cols-1 lg:grid-cols-3 w-full h-full pl-10 pt-10 gap-10 items-start'>

        <NewRaceDialog />

        {scheduleState.schedule.map((raceData) => {
          return (
            <RaceCard
              key={raceData.raceId}
              race={raceData}
              tags={<RacePendingTags race={raceData} />}
              buttons={<RacePendingButtons race={raceData} />}
            />
          );
        })}

      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthenticationProvider>
      <LoginWrapper options={{ permittedRoles: [RacetrackClientRole.RECEPTIONIST] }}>
        <SocketProvider url="http://localhost:3001">
          <RaceScheduleStateProvider>
            <RaceScheduleControllerProvider>
              <RaceSchedulePage />
            </RaceScheduleControllerProvider>
          </RaceScheduleStateProvider>
        </SocketProvider>
      </LoginWrapper>
    </AuthenticationProvider >
  )
}