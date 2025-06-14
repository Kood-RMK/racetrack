"use client";

import React from "react";
import { useState } from "react";
import Icon from '@mdi/react';
import { mdiArrowExpandAll } from '@mdi/js';
import { Button } from 'react-aria-components';



// Race Flags
export function RaceFlagCheckered () {
    
    // FullScreen
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };

    const squareSize = 40;

    return (
        <div
      className="w-screen h-screen"
      style={{
        backgroundColor: "#fff",
        backgroundImage: [
          `linear-gradient(45deg, #000 25%, transparent 25%)`,
          `linear-gradient(-45deg, #000 25%, transparent 25%)`,
          `linear-gradient(45deg, transparent 75%, #000 75%)`,
          `linear-gradient(-45deg, transparent 75%, #000 75%)`,
        ].join(", "),
        backgroundSize: `${squareSize}px ${squareSize}px`,
        backgroundPosition: `0 0, 0 ${squareSize/2}px, ${squareSize/2}px -${squareSize/2}px, -${squareSize/2}px 0`,
      }}
    >
            <div className="flex justify-end p-5">
                <button
                aria-label="Toggle fullscreen"
                onClick={toggleFullscreen}
                className="w-10 h-10 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                <Icon path={mdiArrowExpandAll} className="w-6 h-6 text-black" />
                </button>
            </div>

        </div>
    )
}

export function RaceFlagRed () {

    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };

    return (
        <div className="w-screen h-screen bg-red-700">
            <div className="flex justify-end p-5">
                <button
                aria-label="Toggle fullscreen"
                onClick={toggleFullscreen}
                className="w-10 h-10 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                <Icon path={mdiArrowExpandAll} className="w-6 h-6 text-black" />
                </button>
            </div>
        </div>
    );
}

export function RaceFlagYellow () {

    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };

    return (
        <div className="w-screen h-screen bg-amber-300">
            <div className="flex justify-end p-5">
                <button
                aria-label="Toggle fullscreen"
                onClick={toggleFullscreen}
                className="w-10 h-10 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                    <Icon path={mdiArrowExpandAll} className="w-6 h-6 text-black" />
                </button>
            </div>
        </div>
    );
}

export function RaceFlagGreen () {

    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };

    return (
        <div className="w-screen h-screen bg-green-500">
            <div className="flex justify-end p-5">
                <button
                aria-label="Toggle fullscreen"
                onClick={toggleFullscreen}
                className="w-10 h-10 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                    <Icon path={mdiArrowExpandAll} className="w-6 h-6 text-black" />
                </button>
            </div>
        </div>
    );
}



