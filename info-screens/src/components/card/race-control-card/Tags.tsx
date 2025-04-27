"use client";

import React from "react";
import { Tag, TagGroup, TagList } from 'react-aria-components';
import { mdiClockTimeFour, mdiCheck, mdiAlertOctagon, mdiCloseOctagon, mdiTimerSand, mdiTimerSandFull, mdiStopCircle, mdiHazardLights, mdiFlagCheckered } from "@mdi/js";
import Icon from '@mdi/react';


// Race Pending Tags
export function RacePendingTags() {
    return (
        <TagGroup aria-label="Race pending tags" className="w-full h-14 flex flex-shrink-0">
          <TagList className="flex gap-4">
            
            <Tag textValue="Time" className="bg-blue-200 w-40 h-8 text-base text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0"/>
                00:00 - 00:00</Tag>

                
          </TagList>
        </TagGroup>
    );
}

export function RaceTimeslotTag(timeslot : string) {
   return (
        <Tag textValue="Time" className="bg-blue-200 w-40 h-8 text-base text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
            <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0"/>
            {timeslot}
        </Tag>
   );
}

export function RacePendingTag() {
    return (
        <Tag textValue="Race Pending" className="bg-blue-200 w-40 h-8 text-base text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
            <Icon path={mdiTimerSandFull} className="w-4 h-4 flex-shrink-0"/>
            Race Pending
        </Tag>
    )
}

export function RaceActiveTag() {
    return (
        <Tag textValue="Active race" className="bg-green-100 w-40 h-8 text-base text-green-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
            <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
            Active Race
        </Tag>
    )
}

export function RaceHazardTag() {
    return (
        <Tag textValue="Hazard" className="bg-yellow-100 w-40 h-8 text-base text-yellow-900 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
            <Icon path={mdiAlertOctagon} className="w-4 h-4 flex-shrink-0"/>
            Hazard
        </Tag>
    )
}

export function RaceDangerTag() {
    return (
        <Tag textValue="Danger" className="bg-red-100 w-40 h-8 text-base text-red-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
            <Icon path={mdiHazardLights} className="w-4 h-4 flex-shrink-0"/>
            Danger
        </Tag>
    )
}

export function RaceFinishingTag() {
    return (
        <Tag textValue="Race finishing" className="bg-lime-200 w-40 h-8 text-base text-lime-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
            <Icon path={mdiFlagCheckered} className="w-4 h-4 flex-shrink-0"/>
            Race Finishing
        </Tag>
    )
}

export function RaceCancelledTag() {
    return (
        <Tag textValue="Race Cancelled" className="bg-red-100 w-40 h-8 text-base text-red-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
            <Icon path={mdiCloseOctagon} className="w-4 h-4 flex-shrink-0"/>
            Race Cancelled
        </Tag>
    )
}