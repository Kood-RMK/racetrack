import NewRaceDialog from '@/components/card/placement-card'
import RaceCard from '@/components/card/timeslot-card'
import { RaceScheduleButtons } from '@/components/card/timeslot-card/Buttons'
import { RaceScheduleTags } from '@/components/card/timeslot-card/Tags'
import type { ReactElement } from 'react'
 

export default async function Page() {
 
  return (
    <div className='font-cairo flex flex-col justify-between h-screen w-full p-10 text-5xl'>
      
      <p className='text-center pt-14'>Race Schedule</p>
    
      <div className='grid grid-cols-3 w-full pl-10 gap-10'>

        <RaceCard tags={<RaceScheduleTags/>} buttons={<RaceScheduleButtons/>} />
        <RaceCard tags={<RaceScheduleTags/>} buttons={<RaceScheduleButtons/>} />
        <RaceCard tags={<RaceScheduleTags/>} buttons={<RaceScheduleButtons/>} />

        <RaceCard tags={<RaceScheduleTags/>} buttons={<RaceScheduleButtons/>} />
        <RaceCard tags={<RaceScheduleTags/>} buttons={<RaceScheduleButtons/>} />
        <RaceCard tags={<RaceScheduleTags/>} buttons={<RaceScheduleButtons/>} />

        <RaceCard tags={<RaceScheduleTags/>} buttons={<RaceScheduleButtons/>} />
        <NewRaceDialog/>

      </div>
    </div>
  )

}