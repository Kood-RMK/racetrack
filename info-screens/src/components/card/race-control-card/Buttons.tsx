"use client";

import React from "react";
import Icon from '@mdi/react';
import { mdiDelete, mdiFlagCheckered, mdiPauseOctagon, mdiAlertOctagon, mdiHazardLights, mdiCheck, mdiPlayCircle, mdiStopCircle } from '@mdi/js';
import {Button} from 'react-aria-components';
import { ActiveRaceStateBinding } from "@/app/admin/race-control/activeRaceStateProvider";


export function StartRaceButton({activeRaceStateBinding} : {activeRaceStateBinding: ActiveRaceStateBinding}) {

    return (
        <Button aria-label="Start race" className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
        onPress={() => {activeRaceStateBinding.tryChangeRaceState('active')}}>
        <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
        Start Race
        </Button>
    )    
}

export function CancelRaceButton({activeRaceStateBinding} : {activeRaceStateBinding: ActiveRaceStateBinding}) {

    return (
        <Button aria-label="Cancel race" className="text-xl flex justify-center items-center bg-red-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
        onPress={() => {activeRaceStateBinding.tryChangeRaceState('canceled')}}>
        <Icon path={mdiDelete} className="w-6 h-6 flex-shrink-0"/>
        Cancel Race
        </Button>
    )
}

export function HazardRaceButton({activeRaceStateBinding} : {activeRaceStateBinding: ActiveRaceStateBinding}) {

    return (
        <Button
        aria-label="Hazard"
    className={`text-xl flex justify-center items-center ${activeRaceStateBinding.activeRace.isHazard ? 'bg-yellow-400 text-yellow-800' : 'bg-yellow-500 text-yellow-900 scale-95  drop-shadow-md' } duration-75 p-2 rounded w-56 h-14 gap-1 whitespace-nowrap`}
        onPress={() => {activeRaceStateBinding.trySetHazard(!activeRaceStateBinding.activeRace.isHazard)}}>
            <Icon path={mdiAlertOctagon} className="w-6 h-6 flex-shrink-0"/>
            <span>Hazard</span>
        </Button>
    )
}


export function FinishRaceButton({activeRaceStateBinding} : {activeRaceStateBinding: ActiveRaceStateBinding}) {

    return (
        <Button
        aria-label="Finish"
        className={`text-xl flex justify-center items-center ${activeRaceStateBinding.activeRace.isFinishing ? '' : 'drop-shadow-lg shadow-gray-300' }  bg-white text-black p-2 rounded w-56 h-14 gap-1 whitespace-nowrap`}
        onPress={() => {activeRaceStateBinding.trySetFinishing(!activeRaceStateBinding.activeRace.isFinishing)}}>
            <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
            <span>Finish</span>
        </Button>
    )
}

export function StopRaceButton({activeRaceStateBinding} : {activeRaceStateBinding: ActiveRaceStateBinding}) {

    return (
        <Button 
            aria-label="Stop race"
            className={`text-xl flex justify-center items-center bg-red-600 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap`}
            onPress={() => {activeRaceStateBinding.tryChangeRaceState('paused')}}>
            <Icon path={mdiPauseOctagon} className="w-6 h-6 flex-shrink-0"/>
            Stop Race
        </Button>
    )
}

export function EndRaceButton({activeRaceStateBinding} : {activeRaceStateBinding: ActiveRaceStateBinding}) {

    return (
        <Button 
            aria-label="End session" 
            className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={() => {activeRaceStateBinding.tryChangeRaceState('completed')}}>
            <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
            End Session
        </Button>
    )
}
