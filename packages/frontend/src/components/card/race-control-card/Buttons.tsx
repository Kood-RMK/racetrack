"use client";

import React, { RefObject } from "react";
import Icon from '@mdi/react';
import { mdiDelete, mdiFlagCheckered, mdiPauseOctagon, mdiAlertOctagon, mdiHazardLights, mdiCheck, mdiPlayCircle, mdiStopCircle } from '@mdi/js';
import {Button} from 'react-aria-components';
import { RaceController } from "@/app/providers/controllers/raceControllerProvider";
import { ActiveRace, RaceState, ScheduledRace } from "racetrack-shared/types";


export type RaceButtonParams<RaceType> = {
    race : RaceType,
    raceController : RefObject <RaceController>,
}

export function StartRaceButton({race, raceController} : RaceButtonParams<ScheduledRace>) {

    return (
        <Button 
            aria-label="Start race" 
            className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded xl:w-56 w-full min-w-56 h-14 gap-1 whitespace-nowrap"
            onPress={() => {raceController.current.tryStartRace(race)}}>
            <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
            Start Race
        </Button>
    )    
}

export function ResumeRaceButton({race, raceController} : RaceButtonParams<ActiveRace>) {

    return (
        <Button 
            aria-label="Safe" 
            className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded xl:w-56 w-full min-w-56 h-14 gap-1 whitespace-nowrap"
            onPress={() => {raceController.current.tryChangeRaceState(race.raceId, RaceState.Active)}}>
            <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
            Safe
        </Button>
    )    
}

export function CancelRaceButton({race, raceController} : RaceButtonParams<ActiveRace>) {

    return (
        <Button 
            aria-label="Cancel race" 
            className="text-xl flex justify-center items-center bg-red-700 text-white p-2 rounded w-full xl:w-56 min-w-56 h-14 gap-1 whitespace-nowrap"
            onPress={() => {raceController.current.tryChangeRaceState(race.raceId, RaceState.Canceled)}}>
            <Icon path={mdiDelete} className="w-6 h-6 flex-shrink-0"/>
            Cancel Race
        </Button>
    )
}

export function HazardRaceButton({race, raceController} : RaceButtonParams<ActiveRace>) {

    return (
        <Button 
        aria-label="Hazard" 
        className={`text-xl flex justify-center items-center ${!race.isHazard ? 'bg-yellow-400 text-yellow-800 hover:shadow-sm' : 'bg-yellow-500 text-yellow-900' } duration-75 p-2 rounded w-full xl:w-56 min-w-56 h-14 gap-1 whitespace-nowrap`}
        onPress={() => {raceController.current.trySetHazard(race.raceId, !race.isHazard)}}>
            <Icon path={mdiAlertOctagon} className="w-6 h-6 flex-shrink-0"/>
            <span>Hazard</span>
        </Button>
    )
}


export function FinishRaceButton({race, raceController} : RaceButtonParams<ActiveRace>) {

    return (
        <Button
            aria-label="Finish"
            className={`text-xl flex justify-center items-center ${!race.isFinishing ? 'bg-white text-black hover:shadow-sm' : 'drop-shadow-md bg-black text-white' } duration-200 p-2 rounded w-full xl:w-56 min-w-56 h-14 gap-1 whitespace-nowrap`}
            onPress={() => {raceController.current.trySetFinishing(race.raceId, !race.isFinishing)}}>
            <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
            <span>Finish</span>
        </Button>
    )
}

export function StopRaceButton({race, raceController} : RaceButtonParams<ActiveRace>) {

    return (
        <Button 
            aria-label="Danger"
            className={`text-xl flex justify-center items-center bg-red-600 text-white p-2 rounded w-full xl:w-56 min-w-56 h-14 gap-1 whitespace-nowrap`}
            onPress={() => {raceController.current.tryChangeRaceState(race.raceId, RaceState.Paused)}}>
            <Icon path={mdiPauseOctagon} className="w-6 h-6 flex-shrink-0"/>
            Danger
        </Button>
    )
}

export function EndRaceButton({race, raceController} : RaceButtonParams<ActiveRace>) {

    return (
        <Button 
            aria-label="End session" 
            className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded w-full xl:w-56 min-w-56 h-14 gap-1 whitespace-nowrap"
            onPress={() => {raceController.current.tryChangeRaceState(race.raceId, RaceState.Completed)}}>
            <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
            End Session
        </Button>
    )
}
