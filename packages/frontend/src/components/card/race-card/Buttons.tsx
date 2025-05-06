// Buttons for Admin Card

"use client";

import React, { useState } from "react";
import { Button } from 'react-aria-components';
import { mdiDelete, mdiInvoiceTextEdit } from "@mdi/js";
import Icon from '@mdi/react';
import { useSocket } from "@/app/providers/socket/socketProvider";
import { RacetrackCommand, ScheduledRace } from "racetrack-shared/types";
import { DeleteRace, RaceScheduleCommands, RaceScheduleEntryState } from "racetrack-backend/services";



// Race Pending Buttons

export function RacePendingButtons({ race }: { race: RaceScheduleEntryState }) {

//     const [isDialogOpen, setIsDialogOpen] = useState(false);  // State to manage dialog visibility

//     // Handler for opening the dialog
//     const handleOpenDialog = () => {
//     setIsDialogOpen(true);  // Set the dialog to open
//   };

    const socket = useSocket();

    const onDelete = () => {

        if (socket) {

            const commandMessage: RacetrackCommand<DeleteRace> = {
                senderId: "socket.id",
                message: {
                    type: RaceScheduleCommands.DeleteRace,
                    data: {
                        race: {
                            raceId: race.raceId, // this should come from the component's props
                            raceDateTime: race.raceScheduledStartUnixTime,
                            contestants: race.contestants,
                        }
                    }
                }
            };

            socket.current?.emit("deleteRace", commandMessage);
            console.log(" Delete Event emitted");
        }
    }

    // const onModify = () => {

    //     if (socket) {

    //         const commandMessage: RacetrackCommand<ModifyRace> = {
    //             senderId: "socket.id",
    //             message: {
    //                 type: "modifyRace",
    //                 data: {
    //                     race: {
    //                         raceId: race.raceId, // this should come from the component's props
    //                         raceDateTime: race.raceDateTime,
    //                         contestants: race.contestants,
    //                     }
    //                 }
    //             }
    //         };

    //         socket.emit("modifyRace", commandMessage);
    //         console.log("Modify event emitted");
    //     }
    // }

{/* <Button onPress={() => setIsOpen(true)}>Modify Race</Button> */}



    // function setIsOpen(arg0: boolean): void {
    //     throw new Error("Function not implemented.");
    // }

    return (
        <div aria-label="Race schedule buttons" className="flex justify-end w-full h-8 gap-2 mt-6 flex-shrink-0">

            <Button aria-label="Modify race" className="text-xs flex justify-center items-center bg-blue-800 text-white p-2 rounded w-28 h-8 gap-1 whitespace-nowrap"
                //</div>onPress={() => setIsOpen(true)}
                >
                <Icon path={mdiInvoiceTextEdit} className="w-4 h-4 flex-shrink-0"/>
                Modify Race
            </Button>

            <Button aria-label="Delete race" className="text-xs flex justify-center items-center bg-red-700 text-white p-2 rounded w-28 h-8 gap-1 whitespace-nowrap"
                onPress={onDelete}>
                <Icon path={mdiDelete} className="w-4 h-4 flex-shrink-0"/>
                Delete Race
            </Button>

        </div>

    );
}


