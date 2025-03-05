import RaceCard from '@/components/card/timeslot-card'
import {  RacePendingButtons, ActiveRaceButtons, ActiveRaceHazardButtons, ActiveRaceDangerButtons, RaceCancelledButtons, EndSessionButtons } from '@/components/card/timeslot-card/Buttons'
import { ActiveRaceDangerTags, ActiveRaceHazardTags, ActiveRaceTags, EndSessionTags, RaceCancelledTags, RacePendingTags } from '@/components/card/timeslot-card/Tags'
 

export default async function Page() {
 
  return (
    <div className='font-cairo flex flex-col min-h-full p-10 text-5xl'>
      
      <p className='text-center pt-14 mr-12'>Race Control</p>

      <div>
        <div className='grid grid-cols-3 w-full max-w-[calc(100vw-16rem)] mx-auto pl-10 pt-10 gap-10  items-start'>

        <RaceCard tags={<RacePendingTags/>} buttons={<RacePendingButtons/>} />
        <RaceCard tags={<ActiveRaceTags/>} buttons={<ActiveRaceButtons/>} />
        <RaceCard tags={<ActiveRaceHazardTags/>} buttons={<ActiveRaceHazardButtons/>} />

        <RaceCard tags={<ActiveRaceDangerTags/>} buttons={<ActiveRaceDangerButtons/>} />
        <RaceCard tags={<RaceCancelledTags/>} buttons={<RaceCancelledButtons/>} />
        <RaceCard tags={<EndSessionTags/>} buttons={<EndSessionButtons/>} />
        

        </div>
      </div>
    </div>
  )
}