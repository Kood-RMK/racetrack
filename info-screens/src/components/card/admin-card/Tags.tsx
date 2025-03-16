// Tags for Admin Card

"use client";

import React from "react";
import { Tag, TagGroup, TagList } from 'react-aria-components';
import { mdiClockTimeFour, mdiCheck, mdiTimerSandFull } from "@mdi/js";
import Icon from '@mdi/react';


// Race Pending Tags

export function RacePendingTags() {
    return (
        <TagGroup aria-label="Race pending tags" className="w-full h-5 flex flex-shrink-0">
          <TagList className="flex gap-4">
            
            <Tag textValue="Time" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Race Pending" className="bg-yellow-200 w-24 h-5 text-xs text-yellow-900 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiTimerSandFull} className="w-4 h-4 flex-shrink-0"/>
                Race Pending</Tag>
                
          </TagList>
        </TagGroup>
    );
}

// Active Race Tags

export function ActiveRaceTags() {
    return (
        <TagGroup aria-label="Active race tags" className="w-full h-5 flex flex-shrink-0">
          <TagList className="flex gap-4">
            
            <Tag textValue="Time" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0"/>
                00:00 - 00:00</Tag>

            <Tag textValue="Active race" className="bg-green-100 w-24 h-5 text-xs text-green-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
                Active Race</Tag>
                
          </TagList>
        </TagGroup>
    );
}

// Race Completed Tags 

export function CompletedRaceTags() {
    return (
        <TagGroup aria-label="Race schedule tags" className="w-full h-5 flex flex-shrink-0">
            <TagList className="flex gap-4">
                    
                <Tag textValue="Time" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                    <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0"/>
                    00:00 - 00:00</Tag>
        
                <Tag textValue="Completed" className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                    <Icon path={mdiCheck} className="w-4 h-4 flex-shrink-0"/>
                    Completed</Tag>
                        
            </TagList>
        </TagGroup>

    )
}