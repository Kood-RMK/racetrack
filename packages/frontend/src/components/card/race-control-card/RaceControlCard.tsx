"use client";

import React from "react";
import Icon from '@mdi/react';
import { mdiAccountMultiple } from "@mdi/js";
import { TagGroup, TagList } from "react-aria-components";
import { RaceContestant } from "racetrack-shared/types";


export type RaceControlCardProps = {
  buttons? : React.ReactNode;
  tags? : React.ReactNode;
  contestants: RaceContestant[]
}

export default function RaceControlCard({ tags, buttons, contestants }: RaceControlCardProps) {

  return (
    <div className="bg-gray-100 w-full max-w-[1200px] p-8 mb-14 font-cairo rounded-sm">
      {/* Race Tags */}
      {
        tags && 
            <TagGroup aria-label="Race tags" className="w-full mb-4">
              <TagList className="flex flex-wrap gap-2">
                {tags}     
              </TagList>
            </TagGroup>
        }
        
        {/* Driver Info */}
        <div className="w-full items-center">
          <h3 className="text-3xl font-semibold py-6 flex items-center gap-4">
            <Icon path={mdiAccountMultiple} size={1.5} />
              {`Drivers ${contestants.length}/8`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 xl:grid-cols-4 xl:grid-rows-2 gap-y-6 md:gap-y-12 gap-x-2 w-full h-full justify-center items-center py-6 md:py-20">
            {contestants.map((contestant, index) => (
                <div key={index} className="flex flex-col items-center text-center text-xl lg:text-2xl font-medium">
                  <p>Racecar {contestant.racecarNumber}</p>
                  <p className="text-black font-medium text-2xl lg:text-3xl max-w-xs md:max-w-sm">{contestant.name}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col xl:flex-row items-center mx-auto xl:mx-0 xl:justify-end pb-2 pt-8 gap-x-3 gap-y-2">
          {buttons}
        </div>
    </div>
  );
}