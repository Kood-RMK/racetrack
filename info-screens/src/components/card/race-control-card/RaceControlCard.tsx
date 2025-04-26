"use client";

import React from "react";
import Icon from '@mdi/react';
import { mdiAccountMultiple } from "@mdi/js";
import { TagGroup, TagList } from "react-aria-components";


export type RaceControlCardProps = {
  buttons? : React.ReactNode;
  tags? : React.ReactNode;
}

export default function RaceControlCard({ tags, buttons }: RaceControlCardProps) {

  return (
    <div className="bg-gray-100 w-full h-full p-8 gap-4 font-cairo">
      {/* Race Tags */}
      {
        tags && 
          <div className="tags">
            <TagGroup aria-label="Race tags" className="w-full h-14 flex flex-shrink-0">
              <TagList className="flex gap-4">
                {tags}     
              </TagList>
            </TagGroup>
          </div>
        }
        

        {/* Driver Info */}
        <div className="w-full h-3/6 items-center">

        <h3 className="text-3xl font-semibold py-6 flex items-center gap-4">
          <Icon path={mdiAccountMultiple} size={1.5} />
            Drivers 8/8
        </h3>

          <div className="grid grid-cols-2 grid-rows-4 lg:grid-cols-4 lg:grid-rows-2 lg:my-20 w-full h-full justify-center items-center gap-x-9 gap-y-14 p-10">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="text-center text-xl lg:text-2xl font-medium">
                  <p>Racecar {index + 1}</p>
                  <p className="text-black font-medium text-2xl lg:text-3xl max-w-xs md:max-w-sm">Test Driver</p>
                </div>
              ))}
          </div>
      
        </div>

        {/* Control Buttons */}
        <div className="buttons flex justify-end pt-8 space-x-3">
          {buttons}
        </div>
    </div>
  );
}