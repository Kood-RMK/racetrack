'use client';

import NewRaceDialog from '@/components/card/schedule-race-card'
import RaceCard from '@/components/card/race-card'

import React, { useEffect, useState } from "react";
import { CompletedRaceTags, RacePendingTags, ActiveRaceTags } from '@/components/card/race-card/Tags';
import { RacePendingButtons } from '@/components/card/race-card/Buttons'
import { Race } from '@/racetrack/state';
import { useSocket } from "@/components/socket/ClientProvider";
import { RaceScheduleState, RaceScheduleUpdated } from '@/racetrack/services/race-schedule.service';
import { RacetrackEvent } from '@/racetrack/types/messageTypes';
import ModifyRaceDialog from '@/components/card/modify-race-card';


export default function Page() {

  const socket = useSocket();
  const [raceSchedule, setRaceSchedule] = useState<Race[]>([]);

//   const [selectedRace, setSelectedRace] = useState<Race | null>(null);
//   const [isDialogOpen, setDialogOpen] = useState(false);


//   const handleModifyClick = (race: Race) => {
//     setSelectedRace(race);
//     setDialogOpen(true);
// };

  useEffect(() => {
    if (!socket) return;

    const handleInitialState = (data: RacetrackEvent<RaceScheduleState>) => {
      console.log("🌟 Received initial state:", data);
      const {schedule, type} =  data.message;
      setRaceSchedule(schedule);
    };
    
    const handleStateChange = (data: RacetrackEvent<RaceScheduleUpdated>) => {
      console.log('📡 Received updated schedule:', data);

      const {schedule, type} =  data.message;

      schedule.forEach((race, i) => {
        console.log(`🏁 Race ${i}:`, race);
        console.log(`🚗 Contestants:`, race.contestants);
      });
      
      setRaceSchedule(schedule);
    };

    socket.on('raceScheduleState', handleInitialState);
    socket.on('raceScheduleUpdated', handleStateChange);

    // Optional: clean up listener on unmount
    return () => {
      socket.off('raceScheduleState', handleInitialState);
      socket.off('raceScheduleUpdated');
    };
  }, [socket]);

  
  if (!socket) {
    return <div>Connecting to socket...</div>; // render something instead of returning before hooks
  }
  
  function onDelete(raceId: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className='font-cairo flex flex-col min-h-full p-10 text-5xl'>
      <p className='text-center py-10'>Race Schedule</p>

      <div className='grid grid-cols-1 lg:grid-cols-3 w-full h-full pl-10 pt-10 gap-10 items-start'>
        <NewRaceDialog />

        
        {/* {isDialogOpen && selectedRace && (
          <ModifyRaceDialog
            isOpen={true}
            onClose={() => setDialogOpen(false)}
            initialRace={selectedRace}
          />
        )} */}


        {/* Dynamically create AdminRaceCard for each race */}
        {raceSchedule.map((race, index) => (
          <RaceCard
            key={race.raceId}
            race={race}
            onDelete={() => onDelete(race.raceId)}
            // onModify={() => {
            //   setSelectedRace(race);
            //   setDialogOpen(true);
            // }}
            tags={<RacePendingTags />}
            buttons={<RacePendingButtons race={race} />}
          />
        ))}
      </div>
    </div>
  );
}