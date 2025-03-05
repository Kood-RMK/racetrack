"use client";

import React from "react";
import Icon from '@mdi/react';
import { mdiInvoiceTextEdit, mdiDelete, mdiFlagCheckered, mdiPauseOctagon, mdiAlertOctagon, mdiHazardLights, mdiCheck, mdiPlayCircle, mdiStopCircle } from '@mdi/js';
import {Button} from 'react-aria-components';

// Race Schedule Buttons

export function RaceScheduleButtons() {
    return (
        <div aria-label="Race schedule buttons" className="flex justify-end w-72 h-6 gap-2 flex-shrink-0">
            <Button aria-label="Modify drivers" className="text-xs flex justify-center items-center bg-blue-800 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiInvoiceTextEdit} className="w-4 h-4 flex-shrink-0"/>
            Modify Drivers
            </Button>

            <Button aria-label="Delete race" className="text-xs flex justify-center items-center bg-red-700 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiDelete} className="w-4 h-4 flex-shrink-0"/>
            Delete Race
            </Button>
        </div>
    );
}


// Race Pending Buttons

export function RacePendingButtons() {
    return (
        <div aria-label="Race pending buttons" className="flex justify-end w-72 h-6 gap-2 flex-shrink-0">
            <Button aria-label="Cancel race" className="text-xs flex justify-center items-center bg-red-700 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiDelete} className="w-4 h-4 flex-shrink-0"/>
            Cancel Race
            </Button>

            <Button aria-label="Start race" className="text-xs flex justify-center items-center bg-green-700 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiFlagCheckered} className="w-4 h-4 flex-shrink-0"/>
            Start Race
            </Button>
        </div>
    );
}


// Active Race Buttons

export function ActiveRaceButtons() {
    return (
        <div aria-label="Active Race buttons" className="flex justify-end w-72 h-6 gap-2 flex-shrink-0">
            <Button aria-label="Stop race" className="text-xs flex justify-center items-center bg-red-600 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiPauseOctagon} className="w-4 h-4 flex-shrink-0"/>
            Stop Race
            </Button>

            <Button aria-label="Hazard" className="text-xs flex justify-center items-center bg-yellow-400 text-yellow-900 p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiAlertOctagon} className="w-4 h-4 flex-shrink-0"/>
            Hazard
            </Button>

            <Button aria-label="Danger" className="text-xs flex justify-center items-center bg-red-800 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiHazardLights} className="w-4 h-4 flex-shrink-0"/>
            Danger
            </Button>
        </div>
    );
}

// Active Race with Hazard Buttons

export function ActiveRaceHazardButtons() {
    return (
        <div aria-label="Active race hazard buttons" className="flex justify-end w-72 h-6 gap-2 flex-shrink-0">
            <Button aria-label="Stop race" className="text-xs flex justify-center items-center bg-red-600 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiPauseOctagon} className="w-4 h-4 flex-shrink-0"/>
            Stop Race
            </Button>

            <Button aria-label="Safe" className="text-xs flex justify-center items-center bg-green-700 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
            Safe
            </Button>

            <Button aria-label="Danger" className="text-xs flex justify-center items-center bg-red-800 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiHazardLights} className="w-4 h-4 flex-shrink-0"/>
            Danger
            </Button>
        </div>
    );
}

// Active Race with Danger Buttons

export function ActiveRaceDangerButtons() {
    return (
        <div aria-label="Active race danger buttons" className="flex justify-end w-72 h-6 gap-2 flex-shrink-0">
            <Button aria-label="Resume race" className="text-xs flex justify-center items-center bg-green-700 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiPlayCircle} className="w-4 h-4 flex-shrink-0"/>
            Resume Race
            </Button>

            <Button aria-label="Stop race" className="text-xs flex justify-center items-center bg-red-700 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiStopCircle} className="w-4 h-4 flex-shrink-0"/>
            Stop Race
            </Button>
        </div>
    );
}

// Race Cancelled Buttons

export function RaceCancelledButtons() {
    return (
        <div aria-label="Race cancelled no buttons">
        </div>
    );
}

// End Session Buttons

export function EndSessionButtons() {
    return (
        <div aria-label="End session buttons" className="flex justify-end w-72 h-6 gap-2 flex-shrink-0">
            <Button aria-label="End session" className="text-xs flex justify-center items-center bg-green-700 text-white p-2 rounded w-28 h-6 gap-1 whitespace-nowrap">
            <Icon path={mdiFlagCheckered} className="w-4 h-4 flex-shrink-0"/>
            End Session
            </Button>
        </div>
    );
}