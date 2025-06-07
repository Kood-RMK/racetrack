"use client";

import { RaceFlagGreen, RaceFlagYellow, RaceFlagRed, RaceFlagCheckered } from "@/components/display/flags";
import { ActiveRaceStateProvider, useActiveRaceState } from "@/app/providers/state/activeRaceStateProvider";
import { ActiveRace, RaceState } from "racetrack-shared/types";
import { SocketProvider } from "@/app/providers/socket/socketProvider";
import { AuthenticationProvider } from "@/app/providers/auth/authProvider";
import { useEffect, useState } from "react";
import { RaceScheduleStateProvider } from "@/app/providers/state/raceScheduleStateProvider";

// Mapping between race states and race flags
const raceFlagMap = ({ activeRace: activeRace }: { activeRace: ActiveRace }) => {

    const raceState = activeRace.raceState;

    switch (raceState) {
        case RaceState.Pending: return <RaceFlagRed />;
        case RaceState.Active: return activeRace.isHazard ? <RaceFlagYellow /> : activeRace.isFinishing ? <RaceFlagCheckered /> : <RaceFlagGreen />;
        case RaceState.Paused: return <RaceFlagRed />;
        case RaceState.Completed: return <RaceFlagRed />;
        case RaceState.Canceled: return <RaceFlagRed />;

        default: return <RaceFlagRed />;
    }
    console.log("raceFlagMap: ", raceState)
};


function RaceFlagDisplayPage() {

    const { activeRaceState } = useActiveRaceState();

    console.log("ActivRaceState: ", activeRaceState)

    // Show red flag until actual race state is received
    if (!activeRaceState) {
        return (
            <div className="min-h-screen w-full">
                <RaceFlagRed />
            </div>
        );
    }

    // const [race, setRace] = useState<ActiveRace>()

    // useEffect(() => {
    //     if (activeRaceState.activeRaceState) {
    //         setRace(activeRaceState.activeRaceState);

    //     }
    // }, [activeRaceState.activeRaceState]);



    return (
        <div className="min-h-screen w-full">
            {activeRaceState ? raceFlagMap({ activeRace: activeRaceState }) : <RaceFlagRed />}
        </div>
    );
}

export default function Page() {
    return (
        <AuthenticationProvider>
            <SocketProvider url="http://localhost:3001">
                <ActiveRaceStateProvider>
                    <RaceScheduleStateProvider>
                        <RaceFlagDisplayPage></RaceFlagDisplayPage>
                    </RaceScheduleStateProvider>
                </ActiveRaceStateProvider>
            </SocketProvider>
        </AuthenticationProvider>
    )
}