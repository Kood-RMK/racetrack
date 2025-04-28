"use client";

import { RaceObserverControllerProvider } from "@/app/providers/controllers/observerControllerProvider";
import { SocketProvider } from "@/app/providers/socket/socketProvider";
import { ActiveRaceStateProvider } from "@/app/providers/state/activeRaceStateProvider";
import LapLineObserverButtons from "@/components/lap-observer";

function RaceObserverPage() {
    return (
        <div className="bg-white w-full h-full p-2">
            <LapLineObserverButtons></LapLineObserverButtons>
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