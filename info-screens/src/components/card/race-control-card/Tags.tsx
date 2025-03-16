"use client";

import React from "react";
import { Tag, TagGroup, TagList } from 'react-aria-components';
import { mdiClockTimeFour, mdiCheck, mdiAlertOctagon, mdiCloseOctagon, mdiTimerSand, mdiTimerSandFull, mdiStopCircle, mdiHazardLights } from "@mdi/js";
import Icon from '@mdi/react';


// Race Pending Tags

export function RacePendingTags() {
    return (
        <TagGroup aria-label="Race pending tags" className="w-full h-14 flex flex-shrink-0">
          <TagList className="flex gap-4">
            
            <Tag textValue="Time" className="bg-blue-200 w-40 h-8 text-base text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Race Pending" className="bg-blue-200 w-40 h-8 text-base text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiTimerSandFull} className="w-4 h-4 flex-shrink-0"/>
                Race Pending</Tag>
                
          </TagList>
        </TagGroup>
    );
}


// Active Race Tags

export function ActiveRaceTags() {
    return (
        <TagGroup aria-label="Active race tags" className="w-full h-14 flex flex-shrink-0">
          <TagList className="flex gap-4">
            
            <Tag textValue="Time" className="bg-blue-200 w-40 h-8 text-base text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Active race" className="bg-green-100 w-40 h-8 text-base text-green-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
                Active Race</Tag>
                
          </TagList>
        </TagGroup>
    );
}

// Active Race with Hazard

export function ActiveRaceHazardTags() {
    return (
        <TagGroup aria-label="Active race hazard tags" className="w-full h-14 flex flex-shrink-0">
          <TagList className="flex flex-wrap gap-4">
            
            <Tag textValue="Time" className="bg-blue-200 w-40 h-8 text-base text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Active race" className="bg-green-100 w-40 h-8 text-base text-green-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
                Active Race</Tag>

            <Tag textValue="Hazard" className="bg-yellow-100 w-40 h-8 text-base text-yellow-900 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiAlertOctagon} className="w-4 h-4 flex-shrink-0"/>
                Hazard</Tag>
                
          </TagList>
        </TagGroup>
    );
}

// Active Race with Danger

export function ActiveRaceDangerTags() {
    return (
        <TagGroup aria-label="Active race danger tags" className="w-full h-14 flex flex-shrink-0">
          <TagList className="flex flex-wrap gap-4">
            
            <Tag textValue="Time" className="bg-blue-200 w-40 h-8 text-base text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Active race" className="bg-green-100 w-40 h-8 text-base text-green-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
                Active Race</Tag>

            <Tag textValue="Danger" className="bg-red-100 w-40 h-8 text-base text-red-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiHazardLights} className="w-4 h-4 flex-shrink-0"/>
                Danger</Tag>
                
          </TagList>
        </TagGroup>
    );
}


// Race Cancelled Tags

export function RaceCancelledTags() {
    return (
        <TagGroup aria-label="Race cancelled tags" className="w-full h-14 flex flex-shrink-0">
          <TagList className="flex gap-4">
            
            <Tag textValue="Time" className="bg-blue-200 w-40 h-8 text-base text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Race Cancelled" className="bg-red-100 w-40 h-8 text-base text-red-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiCloseOctagon} className="w-4 h-4 flex-shrink-0"/>
                Race Cancelled</Tag>
                
          </TagList>
        </TagGroup>
    );
}

// End Session Tags

export function EndSessionTags() {
    return (
        <TagGroup aria-label="End session tags" className="w-full h-14 flex flex-shrink-0">
          <TagList className="flex gap-4">
            
            <Tag textValue="Time" className="bg-blue-200 w-40 h-8 text-base text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Race Stopped" className="bg-red-100 w-40 h-8 text-base text-red-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiStopCircle} className="w-4 h-4 flex-shrink-0"/>
                Race Stopped</Tag>
                
          </TagList>
        </TagGroup>
    );
}