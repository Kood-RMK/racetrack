"use client";

import React from "react";
import {Button} from 'react-aria-components';

export default function LapLineObserverButtons() {
    
    return(

        // A correct number of buttons should be generated, base on the number of drivers in active race
        //So this should be connected to the socket as well
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full h-full">
            {Array(8)
                .fill(0)
                .map((_, index) => (
                    <Button
                        key={index}
                        aria-label={`Lap-line-observer button ${index + 1}`}
                        className="bg-gray-100 w-full h-full font-cairo rounded-md border-gray-200 border-2 flex justify-center items-center">
                    
                        <div
                            className="text-7xl text-gray-800">
                            <p>{ index + 1}</p>
                        </div>
                    </Button>
                ))
            }
        </div>
    );

}