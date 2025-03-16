import RaceCard from '@/components/card/race-control-card'
import {  RacePendingButtons, ActiveRaceButtons, ActiveRaceHazardButtons, ActiveRaceDangerButtons, EndSessionButtons } from '@/components/card/race-control-card/Buttons'
import { ActiveRaceDangerTags, ActiveRaceHazardTags, ActiveRaceTags, EndSessionTags, RaceCancelledTags, RacePendingTags } from '@/components/card/race-control-card/Tags'
 

export default async function Page() {
 
  return (
    <div className='font-cairo min-h-full min-w-full text-5xl px-12'>
      
      <p className='text-center py-12'>Race Control</p>

      <div>
        <div>

        <RaceCard tags={<ActiveRaceDangerTags/>} buttons={<ActiveRaceDangerButtons/>} />

        </div>
      </div>
    </div>
  )
}