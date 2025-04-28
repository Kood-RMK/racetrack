"use client";

import { RaceObserverControllerProvider, useRaceObserverController } from "@/app/providers/controllers/raceObserverControllerProvider";
import { SocketProvider } from "@/app/providers/socket/socketProvider";
import { ActiveRaceStateProvider, useActiveRaceState } from "@/app/providers/state/activeRaceStateProvider";
import { useEffect } from "react";
import { Button } from "react-aria-components";



function RaceObserverCardTag({title, value} : {title : string, value : string}) {
    return (
            <span>{title} : {value}</span>
    )

}

function RaceObserverPage() {

    const activeRace = useActiveRaceState();
    const raceObserverController = useRaceObserverController();

    if (!activeRace || !raceObserverController) {
        return <div className="bg-white w-full h-full p-2">Loading...</div>
    }

    let contestants = Object.entries (activeRace.contestants).map(([contestantId, contestant]) => {
        return contestant;
    });

    // Sort contestants by car number.
    contestants = contestants.sort((a, b) => {
        return a.contestant.racecarNumber - b.contestant.racecarNumber;
    });

    return (
        <div className="bg-white flex justify-center flex-col w-full h-full py-12 px-12">
        <h1 className='text-center py-12 text-5xl'>Race Observer</h1>
            <div className={`grid gap-4 w-full h-full ${contestants.length >= 4 ? 'grid-cols-4' : 'grid-cols-2' }`}>
                {
                   contestants.map((contestant, index) => {
                    return <li key={index} className="list-none">
                        <Button
                            key={index}
                            className="bg-gray-100 w-full h-[600px] font-cairo rounded-md border-gray-200 border-2 flex justify-center items-center"
                            onPress={() => {
                                raceObserverController.current?.tryHandleLineCrossed(contestant.contestant.contestantId);
                            }}
                            aria-label={`Lap-line-observer button`}
                            >
                            <div className="h-full w-full flex justify-center items-center relative">
                                <p className="text-7xl text-gray-800">{ contestant.contestant.racecarNumber }</p>
                                <div className="absolute bottom-0 left-0 right-0 h-1/3 flex flex-col justify-end pb-8 items-center">
                                    <RaceObserverCardTag title="Place" value={contestant.place.toString()}></RaceObserverCardTag>
                                    <RaceObserverCardTag title="Lap" value={contestant.lapCount.toString()}></RaceObserverCardTag>
                                    <RaceObserverCardTag title="Fastest Lap" value={contestant.fastestLap.toString()}></RaceObserverCardTag>
                                    <RaceObserverCardTag title="Lap Time" value={contestant.lapStopwatchTime.toString()}></RaceObserverCardTag>
                                </div>
                            </div>
                            
                        </Button>
                    </li>
                   })     
                }
            </div>
        </div>
    )
}

export default function Page() {

    return (
        <SocketProvider url="http://localhost:3001">
            <ActiveRaceStateProvider>
                <RaceObserverControllerProvider>
                    <RaceObserverPage></RaceObserverPage>
                </RaceObserverControllerProvider>
            </ActiveRaceStateProvider>
        </SocketProvider>
    );
}