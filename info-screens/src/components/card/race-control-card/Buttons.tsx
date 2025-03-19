"use client";

import React from "react";
import Icon from '@mdi/react';
import { mdiDelete, mdiFlagCheckered, mdiPauseOctagon, mdiAlertOctagon, mdiHazardLights, mdiCheck, mdiPlayCircle, mdiStopCircle } from '@mdi/js';
import {Button} from 'react-aria-components';
import { useSocket } from "@/components/socket/ClientProvider";


// Race Pending Buttons

export function RacePendingButtons() {

    const socket = useSocket(); // Retrieves the WebSocket connection

    const onCancel = () => { // Race control can cancel a race while its' state is 'pending'. Flag remains red
        if (socket) {
            socket.emit("updateRaceState", {state: ["canceled"]})
        }
    }
    
    const onStart = () => { // Flag changes to green, timer starts counting down from 10
        if (socket) {
            socket.emit("updateRaceState", {state: ["active"]})
        }
    }

    return (
        <div aria-label="Race pending buttons" className="flex justify-end w-full h-20 gap-4 flex-shrink-0">
            <Button aria-label="Cancel race" className="text-xl flex justify-center items-center bg-red-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onCancel}>
            <Icon path={mdiDelete} className="w-6 h-6 flex-shrink-0"/>
            Cancel Race
            </Button>

            <Button aria-label="Start race" className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onStart}>
            <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
            Start Race
            </Button>
        </div>
    );
}


// Active Race Buttons

export function ActiveRaceButtons() {

    const socket = useSocket();

    const onFinish = () => { // Flag changes to checkered, drivers return to start/finish line
        if (socket) {
            socket.emit("updateRaceState", {state: ["finishing"]})
        }
    }
    
    const onHazard = () => { // Flag changes to yellow, drive slow, time does not stop
        if (socket) {
            socket.emit("updateRaceState", {state: ["hazard"]})
        }
    }
    
    const onDanger = () => { // Flag changes to red, cars need to stop, time stops.
        if (socket) {
            socket.emit("updateRaceState", {state: ["danger"]})
        }
    }

    return (
        <div aria-label="Active Race buttons" className="flex justify-end w-full h-20 gap-4 flex-shrink-0">
            <Button aria-label="Stop race" className="text-xl flex justify-center items-center bg-red-600 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onFinish}>
            <Icon path={mdiPauseOctagon} className="w-6 h-6 flex-shrink-0"/>
            Finish Race
            </Button>

            <Button aria-label="Hazard" className="text-xl flex justify-center items-center bg-yellow-400 text-yellow-900 p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onHazard}>
            <Icon path={mdiAlertOctagon} className="w-6 h-6 flex-shrink-0"/>
            Hazard
            </Button>

            <Button aria-label="Danger" className="text-xl flex justify-center items-center bg-red-800 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onDanger}>
            <Icon path={mdiHazardLights} className="w-6 h-6 flex-shrink-0"/>
            Danger
            </Button>
        </div>
    );
}

// Active Race with Hazard Buttons

export function ActiveRaceHazardButtons() {

    const socket = useSocket();

    const onFinish = () => { // Flag changes to checkered, drivers return to start/finish line
        if (socket) {
            socket.emit("updateRaceState", {state: ["finishing"]})
        }
    }
    
    const onSafe = () => { // Flag changes to yellow, drive slow, time does not stop
        if (socket) {
            socket.emit("updateRaceState", {state: ["safe"]})
        }
    }
    
    const onDanger = () => { // Flag changes to red, cars need to stop, time stops.
        if (socket) {
            socket.emit("updateRaceState", {state: ["danger"]})
        }
    }

    return (
        <div aria-label="Active race hazard buttons" className="flex justify-end w-full h-20 gap-4 flex-shrink-0">
            <Button aria-label="Stop race" className="text-xl flex justify-center items-center bg-red-600 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onFinish}>
            <Icon path={mdiPauseOctagon} className="w-6 h-6 flex-shrink-0"/>
            Finish Race
            </Button>

            <Button aria-label="Safe" className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onSafe}>
            <Icon path={mdiCheck} className="w-6 h-6 flex-shrink-0"/>
            Safe
            </Button>

            <Button aria-label="Danger" className="text-xl flex justify-center items-center bg-red-800 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onDanger}>
            <Icon path={mdiHazardLights} className="w-6 h-6 flex-shrink-0"/>
            Danger
            </Button>
        </div>
    );
}

// Active Race with Danger Buttons

export function ActiveRaceDangerButtons() {

    const socket = useSocket();

    const onResume = () => { // Flag changes to green, timer has been stopped, but continues counting when flag state is switched to "resumed"
        if (socket) {
            socket.emit("updateRaceState", {state: ["resume"]})
        }
    }

    const onFinish = () => { // Flag changes to green, timer has been stopped, but continues counting when flag state is switched to "resumed"
        if (socket) {
            socket.emit("updateRaceState", {state: ["finishing"]})
        }
    }

    return (
        <div aria-label="Active race danger buttons" className="flex justify-end w-full h-20 gap-4 flex-shrink-0">
            <Button aria-label="Resume race" className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onResume}>
            <Icon path={mdiPlayCircle} className="w-6 h-6 flex-shrink-0"/>
            Resume Race
            </Button>

            <Button aria-label="Stop race" className="text-xl flex justify-center items-center bg-red-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onFinish}>
            <Icon path={mdiStopCircle} className="w-6 h-6 flex-shrink-0"/>
            Finish Race
            </Button>
        </div>
    );
}

// End Session Buttons

export function EndSessionButtons() {

    const socket = useSocket();

    const onEndSession = () => { // When everyone has returned to start/finish line, race control pushes "End Session" - flag changes to red.
        if (socket) {
            socket.emit("updateRaceState", {state: ["completed"]})
        }
    }

    return (
        <div aria-label="End session buttons" className="flex justify-end w-full h-20 gap-2 flex-shrink-0">
            <Button aria-label="End session" className="text-xl flex justify-center items-center bg-green-700 text-white p-2 rounded w-56 h-14 gap-1 whitespace-nowrap"
            onPress={onEndSession}>
            <Icon path={mdiFlagCheckered} className="w-6 h-6 flex-shrink-0"/>
            End Session
            </Button>
        </div>
    );
}