"use client";

import LapLineObserverButtons from "@/components/lap-observer";


export default function Page() {

    return (
        // If no active race return text 'No active race' 

        // If there's an active race return the buttons
        <div className="bg-white w-screen h-screen p-2">
            <LapLineObserverButtons></LapLineObserverButtons>
        </div>

        // If race ended return text 'Race ended' for 5-10sec, then 'No active Race'
        
    );
}