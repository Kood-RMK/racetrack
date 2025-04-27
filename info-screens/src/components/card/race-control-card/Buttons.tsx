"use client";

import React, { RefObject } from "react";
import Icon from '@mdi/react';
import { mdiDelete, mdiFlagCheckered, mdiPauseOctagon, mdiAlertOctagon, mdiHazardLights, mdiCheck, mdiPlayCircle, mdiStopCircle } from '@mdi/js';
import {Button} from 'react-aria-components';
import { ActiveRaceController } from "@/app/providers/controllers/raceControllerProvider";
import { ActiveRace } from "@/racetrack/types/stateTypes";

export type RaceButtonParams = {
    activeRace : ActiveRace,
    activeRaceController : RefObject <ActiveRaceController>,
}

export function StartRaceButton({activeRace, activeRaceController} : RaceButtonParams) {

    return (
        <Button aria-label="Start race" className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
        onPress={() => {activeRaceController.current.tryChangeRaceState('active')}}>
        <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
        Start Race
        </Button>
    )    
}

export function CancelRaceButton({activeRace, activeRaceController} : RaceButtonParams) {

    return (
        <Button aria-label="Cancel race" className="text-xl flex justify-center items-center bg-red-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
        onPress={() => {activeRaceController.current.tryChangeRaceState('canceled')}}>
        <Icon path={mdiDelete} className="w-6 h-6 flex-shrink-0"/>
        Cancel Race
        </Button>
    )
}

export function HazardRaceButton({activeRace, activeRaceController} : RaceButtonParams) {

    return (
        <Button
        aria-label="Hazard"
    className={`text-xl flex justify-center items-center ${!activeRace.isHazard ? 'bg-yellow-400 text-yellow-800 hover:shadow-sm' : 'bg-yellow-500 text-yellow-900 drop-shadow-md' } duration-75 p-2 rounded w-56 h-14 gap-1 whitespace-nowrap`}
        onPress={() => {activeRaceController.current.trySetHazard(!activeRace.isHazard)}}>
            <Icon path={mdiAlertOctagon} className="w-6 h-6 flex-shrink-0"/>
            <span>Hazard</span>
        </Button>
    )
}


export function FinishRaceButton({activeRace, activeRaceController} : RaceButtonParams) {

    return (
        <Button
        aria-label="Finish"
        className={`text-xl flex justify-center items-center ${!activeRace.isFinishing ? 'bg-white text-black hover:shadow-sm' : 'drop-shadow-md bg-black text-white' } duration-200 p-2 rounded w-56 h-14 gap-1 whitespace-nowrap`}
        onPress={() => {activeRaceController.current.trySetFinishing(!activeRace.isFinishing)}}>
            <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
            <span>Finish</span>
        </Button>
    )
}

export function StopRaceButton({activeRace, activeRaceController} : RaceButtonParams) {

    return (
        <Button 
            aria-label="Stop race"
            className={`text-xl flex justify-center items-center bg-red-600 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap`}
            onPress={() => {activeRaceController.current.tryChangeRaceState('paused')}}>
            <Icon path={mdiPauseOctagon} className="w-6 h-6 flex-shrink-0"/>
            Stop Race
        </Button>
    )
}

export function EndRaceButton({activeRace, activeRaceController} : RaceButtonParams) {

    return (
        <Button 
            aria-label="End session" 
            className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={() => {activeRaceController.current.tryChangeRaceState('completed')}}>
            <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
            End Session
        </Button>
    )
}
