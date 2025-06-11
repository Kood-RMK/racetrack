"use client";

import { RaceObserverController, RaceObserverControllerProvider, useRaceObserverController } from "@/app/providers/controllers/raceObserverControllerProvider";
import { SocketProvider } from "@/app/providers/socket/socketProvider";
import { ActiveRaceStateProvider, useActiveRaceState } from "@/app/providers/state/activeRaceStateProvider";
import { RefObject, useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { millisecondsToMinutes } from "@/utils/timeConverter"
import { ActiveRaceContestant, RacetrackClientRole } from "racetrack-shared/types";
import { AuthenticationProvider } from "@/app/providers/auth/authProvider";
import { LoginWrapper } from "@/components/authentication/Login";


function RaceObserverCardTag({title, value, isHovered} : {title : string, value : string, isHovered?: boolean}) {
    return (
        <span className={`text-gray-500 ${isHovered ? '' : 'hidden'}`}>{title} : {value}</span>
    )
}

function RaceObserverPanel({contestants, raceObserverController} : {raceObserverController : RefObject<RaceObserverController>, contestants: ActiveRaceContestant[]} ) {
    return (
        <div className={`grid gap-4 w-full h-full ${contestants.length >= 4 ? 'grid-cols-4' : 'grid-cols-2' }`}>
            {
                contestants.map((contestant, index) => {
                    const [isHovered, setIsHovered] = useState(false);
                    return <li key={index} className="list-none">
                        <Button
                            key={index}
                            className={({isPressed}) => `bg-gray-100 group w-full h-full font-cairo rounded-md border-gray-200 border-2 flex justify-center items-center ${isPressed ? 'bg-green-300' : ''} hover:border-gray-300 transition-all duration-75`} 
                            onPress={() => {
                                raceObserverController.current?.tryHandleLineCrossed(contestant.contestant.contestantId);
                            }}
                            aria-label={`Lap-line-observer button`}
                            onHoverStart={() => setIsHovered(true)}
                            onHoverEnd={() => setIsHovered(false)}
                            >
                            <div className="h-full w-full flex justify-center items-center relative">
                                <p className={`text-7xl text-gray-800 ${isHovered ? 'hidden' : ''}`} >{ contestant.contestant.racecarNumber }</p>
                                <div className="absolute z-10 bottom-0 left-0 right-0 h-1/3 flex flex-col justify-end pb-8 items-center">
                                    <RaceObserverCardTag title="Place" value={contestant.place.toString()} isHovered={isHovered}></RaceObserverCardTag>
                                    <RaceObserverCardTag title="Lap" value={contestant.lapCount.toString()} isHovered={isHovered}></RaceObserverCardTag>
                                    {contestant.fastestLap !== null && <RaceObserverCardTag title="Best Lap" value={millisecondsToMinutes(contestant.fastestLap)} isHovered={isHovered}/> }
                                    <RaceObserverCardTag title="Lap Time" value={millisecondsToMinutes(contestant.lapStopwatchTime)} isHovered={isHovered}></RaceObserverCardTag>
                                </div>
                            </div>
                        </Button>
                    </li>
                })     
            }
        </div>
    )
}

function RaceObserverPage() {

    const activeRace = useActiveRaceState();

    console.log("activeRace: ", activeRace)
    const raceObserverController = useRaceObserverController();

    if (!activeRace || !raceObserverController) {
        return <div className="bg-white w-full h-full p-2">Loading...</div>
    }


    return (
        <div className="bg-white flex justify-center items-center flex-col w-full h-full py-12 px-12">
        <h1 className='text-center py-12 text-5xl'>Race Observer</h1>
            {activeRace.activeRaceState?.raceState == 'active' ?
            <RaceObserverPanel raceObserverController={raceObserverController} contestants={Object.values (activeRace.activeRaceState.contestants)}></RaceObserverPanel>
            : <div className="text-3xl text-gray-500 text"> No Active Race </div>
            }
        </div>
    )
}

export default function Page() {

    return (

    <AuthenticationProvider>
      <LoginWrapper options={{ permittedRoles: [RacetrackClientRole.OBSERVER] }}>
        <SocketProvider url="http://localhost:3001">
            <ActiveRaceStateProvider>
                <RaceObserverControllerProvider>
                    <RaceObserverPage></RaceObserverPage>
                </RaceObserverControllerProvider>
            </ActiveRaceStateProvider>
        </SocketProvider>
      </LoginWrapper>
      </AuthenticationProvider>
    );
}