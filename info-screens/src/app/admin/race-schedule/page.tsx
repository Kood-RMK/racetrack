import NewRaceDialog from '@/components/card/admin-placement-card'
import AdminRaceCard from '@/components/card/admin-card'

import React from "react";
import { CompletedRaceTags, RacePendingTags, ActiveRaceTags } from '@/components/card/admin-card/Tags';
import { RacePendingButtons } from '@/components/card/admin-card/Buttons'

export default async function Page() {
 
  return (
    <div className='font-cairo flex flex-col min-h-full p-10 text-5xl'>
      
      <p className='text-center py-10'>Race Schedule</p>

      <div>
      <div className='grid grid-cols-1 lg:grid-cols-3 w-full h-full pl-10 pt-10 gap-10 items-start'>

        <NewRaceDialog/>
        <AdminRaceCard tags={<RacePendingTags/>} buttons={<RacePendingButtons/>} />
        <AdminRaceCard tags={<ActiveRaceTags/>} />

        <AdminRaceCard tags={<CompletedRaceTags/>} />
        

      </div>
      </div>
    </div>
  )
}