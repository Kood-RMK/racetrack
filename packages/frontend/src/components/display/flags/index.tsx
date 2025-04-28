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


    return (
        <div className="w-screen h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/CheckeredFlag.png')"}}>
            <div className="flex justify-end p-5">
                <Button aria-label="fullscreen" className="w-10 h-10 whitespace-nowrap"
                    onPress={toggleFullscreen}>
                    <Icon path={mdiArrowExpandAll} className="w-10 h-10 flex-shrink-0 text-amber-400"/>
                </Button>
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
                <Button aria-label="fullscreen" className="w-10 h-10 whitespace-nowrap"
                    onPress={toggleFullscreen}>
                    <Icon path={mdiArrowExpandAll} className="w-10 h-10 flex-shrink-0 text-slate-700"/>
                </Button>
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
                <Button aria-label="fullscreen" className="w-10 h-10 whitespace-nowrap"
                    onPress={toggleFullscreen}>
                    <Icon path={mdiArrowExpandAll} className="w-10 h-10 flex-shrink-0 text-slate-700"/>
                </Button>
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
        <div className="w-screen h-screen bg-green-900">
            <div className="flex justify-end p-5">
                <Button aria-label="fullscreen" className="w-10 h-10 whitespace-nowrap"
                    onPress={toggleFullscreen}>
                    <Icon path={mdiArrowExpandAll} className="w-10 h-10 flex-shrink-0 text-white"/>
                </Button>
            </div>
        </div>
    );
}



