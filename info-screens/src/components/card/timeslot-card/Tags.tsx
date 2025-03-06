"use client";

import React from "react";
import { Tag, TagGroup, TagList } from 'react-aria-components';
import { mdiClockTimeFour, mdiCheck, mdiAlertOctagon, mdiCloseOctagon, mdiTimerSand, mdiTimerSandFull, mdiStopCircle, mdiHazardLights } from "@mdi/js";
import Icon from '@mdi/react';


// Race Schedule Tags

export function RaceScheduleTags() {
    return (
        <TagGroup aria-label="Race schedule tags" className="w-48 h-5 gap-2 flex flex-shrink-0">
          <TagList className="flex gap-2">
            
            <Tag textValue="Time" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Completed" className="bg-green-100 w-24 h-5 text-xs text-green-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
                Completed</Tag>
                
          </TagList>
        </TagGroup>
    );
}


// Race Pending Tags

export function RacePendingTags() {
    return (
        <TagGroup aria-label="Race pending tags" className="w-48 h-5 gap-2 flex flex-shrink-0">
          <TagList className="flex gap-2">
            
            <Tag textValue="Time" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Race Pending" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiTimerSandFull} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                Race Pending</Tag>
                
          </TagList>
        </TagGroup>
    );
}


// Active Race Tags

export function ActiveRaceTags() {
    return (
        <TagGroup aria-label="Active race tags" className="w-48 h-5 gap-2 flex flex-shrink-0">
          <TagList className="flex gap-2">
            
            <Tag textValue="Time" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Active race" className="bg-green-100 w-24 h-5 text-xs text-green-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
                Active Race</Tag>
                
          </TagList>
        </TagGroup>
    );
}

// Active Race with Hazard

export function ActiveRaceHazardTags() {
    return (
        <TagGroup aria-label="Active race hazard tags" className="w-48 h-5 gap-2 flex flex-shrink-0">
          <TagList className="flex gap-2">
            
            <Tag textValue="Time" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Active race" className="bg-green-100 w-24 h-5 text-xs text-green-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
                Active Race</Tag>

            <Tag textValue="Hazard" className="bg-yellow-100 w-20 h-5 text-xs text-yellow-900 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiAlertOctagon} className="w-4 h-4 flex-shrink-0"/>
                Hazard</Tag>
                
          </TagList>
        </TagGroup>
    );
}

// Active Race with Danger

export function ActiveRaceDangerTags() {
    return (
        <TagGroup aria-label="Active race danger tags" className="w-48 h-5 gap-2 flex flex-shrink-0">
          <TagList className="flex gap-2">
            
            <Tag textValue="Time" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Active race" className="bg-green-100 w-24 h-5 text-xs text-green-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
                Active Race</Tag>

            <Tag textValue="Danger" className="bg-red-100 w-20 h-5 text-xs text-red-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiHazardLights} className="w-4 h-4 flex-shrink-0"/>
                Danger</Tag>
                
          </TagList>
        </TagGroup>
    );
}


// Race Cancelled Tags

export function RaceCancelledTags() {
    return (
        <TagGroup aria-label="Race cancelled tags" className="w-48 h-5 gap-2 flex flex-shrink-0">
          <TagList className="flex gap-2">
            
            <Tag textValue="Time" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Race Cancelled" className="bg-red-100 w-26 h-5 text-xs text-red-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiCloseOctagon} className="w-4 h-4 flex-shrink-0"/>
                Race Cancelled</Tag>
                
          </TagList>
        </TagGroup>
    );
}

// End Session Tags

export function EndSessionTags() {
    return (
        <TagGroup aria-label="End session tags" className="w-48 h-5 gap-2 flex flex-shrink-0">
          <TagList className="flex gap-2">
            
            <Tag textValue="Time" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Race Stopped" className="bg-red-100 w-26 h-5 text-xs text-red-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiStopCircle} className="w-4 h-4 flex-shrink-0"/>
                Race Stopped</Tag>
                
          </TagList>
        </TagGroup>
    );
}