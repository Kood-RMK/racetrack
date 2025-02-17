"use client"

import React from "react";
import Icon from '@mdi/react';
import { mdiClockTimeFour, mdiCheckerboardPlus } from '@mdi/js';
import {
    Tag,
    TagGroup,
    TagList
  } from 'react-aria-components';
import {Button} from 'react-aria-components';


export default function NewRaceCard() {
    return (
  <div className="bg-gray-100 w-80 h-56 p-4 gap-4 flex flex-col font-cairo">

    {/* Header Section */}
    <TagGroup selectionMode="multiple" className="w-48 h-5 gap-2 flex flex-shrink-0">
        <TagList className="flex gap-2">
            <Tag className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm"/>
                00:00 - 00:00</Tag>
        </TagList>
    </TagGroup>

    {/* New Race Button */}
    <div className="w-72 h-36 flex flex-col justify-center items-center">
        <Button className="flex flex-col items-center gap-2 p-2">
            <Icon path={mdiCheckerboardPlus} size={1.5}/>
            Schedule Race
        </Button>

    </div>
  </div>
 );
}

