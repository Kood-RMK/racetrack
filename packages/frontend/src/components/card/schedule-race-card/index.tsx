"use client";

import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogTrigger,
    Heading,
    Input,
    Label,
    Modal,
    TextField,
    ComboBox,
    ListBox,
    ListBoxItem,
    Popover,
    Key
} from 'react-aria-components';
import Icon from '@mdi/react';
import {
    mdiClockTimeFour,
    mdiCheckerboardPlus,
    mdiAccount,
    mdiWindowClose,
    mdiMenuDown,
    mdiInvoiceTextEdit
} from '@mdi/js';


import { useRaceScheduleController } from "@/app/providers/controllers/raceScheduleControllerProvider";
import { RaceContestant, RaceState, ScheduledRace } from "racetrack-shared/types";




export default function NewRaceDialog() {

    // Tahame koguda kõigepealt objekti tüübiga RaceContestant ja seejärel lisada objektid arraysse tüübiga RaceContestant[]
    // Peame välja saatma ScheduledRace tüübi ehk kas siin peaks juba lisama mingi id ka?

    const [driverCount, setDriverCount] = useState(8);
    // const [driverNames, setDriverNames] = useState<string[]>(Array(driverCount).fill(""));
    const [driverNames, setDriverNames] = useState<string[]>([""]);
    const [selectedTimeslot, setSelectedTimeslot] = useState<Key | null>(null);

    // Get the scheduleController from the provider
    const scheduleController = useRaceScheduleController();

    // Also want to get car numbers later
    const handleNameChange = (index: number, driverName: string) => {
        const updatedNames = [...driverNames];
        updatedNames[index] = driverName;
        setDriverNames(updatedNames);
    };


    const onSave = () => {

        const contestants: RaceContestant[] = driverNames
            .filter(name => name.trim() !== "")
            .map((name, index) => ({
                contestantId: `driver-${index}-${Date.now()}`, // or another unique strategy
                name,
                racecarNumber: index + 1,
            }));

        // Create the new race object (you can adjust the logic for the race data as needed)
        const newRace: ScheduledRace = {
            raceId: `race-${Date.now()}`,
            raceScheduledStartUnixTime: Date.now().toString(),
            contestants,
            raceState: RaceState.Pending,
        };

        // Use the controller's tryAddRace method to add the new race
        if (scheduleController && scheduleController.current && scheduleController.current.tryAddRace) {
            scheduleController.current.tryAddRace(newRace); // Add the new race to the schedule
        }
    }


    return (
        <div className="bg-gray-100 w-full h-full p-4 gap-4 flex items-center justify-center font-cairo">
            <DialogTrigger>
                {/* Button that triggers Dialog */}
                <Button
                    aria-label="Race"
                    className="flex flex-col items-center justify-center gap-2 p-2 text-base"
                >
                    <Icon path={mdiCheckerboardPlus} size={1.5} />
                    Scheduled Race
                </Button>

                <Modal className="absolute inset-0 flex justify-center items-center w-full h-full bg-black/50 font-cairo z-50">
                    <Dialog className="bg-gray-100 shadow-lg p-5 w-1/2">
                        {/* Close Button */}
                        <div className="flex justify-end">
                            <Button aria-label="Close" slot="close">
                                <Icon
                                    path={mdiWindowClose}
                                    size={0.8}
                                    className="flex justify-end text-gray-400"
                                />
                            </Button>
                        </div>

                        <div className="px-32">
                            {/* Heading & Timeslot */}
                            <div className="flex justify-between items-center w-full py-5 font-cairo">
                                <Heading className="text-2xl font-semibold text-center flex justify-start">
                                    Race Details
                                </Heading>

                                <ComboBox className="relative w-48">
                                    <Label className="text-sm font-medium pb-2">Timeslot</Label>

                                    <Button>
                                        <div className="relative flex items-center">
                                            <Icon
                                                path={mdiClockTimeFour}
                                                size={0.9}
                                                className="absolute left-2 text-gray-500 pointer-events-none"
                                            />
                                            <Input
                                                id="timeslot"
                                                placeholder="Timeslot"
                                                className="border border-gray-300 rounded-lg pl-8 pr-8 py-1 w-full"
                                            />
                                            <Icon
                                                path={mdiMenuDown}
                                                size={1}
                                                className="absolute right-2 text-black pointer-events-none"
                                            />
                                        </div>
                                    </Button>

                                    <Popover className="bg-white/80 rounded w-48 p-2 shadow-lg backdrop-blur-md">
                                        <ListBox
                                            className="max-h-48 overflow-y-auto font-cairo"
                                            selectedKeys={selectedTimeslot ? new Set([selectedTimeslot]) : new Set()}
                                            onSelectionChange={(keys) => {
                                              const key = (keys as Set<React.Key>).values().next().value;
                                              setSelectedTimeslot(key as string);
                                            }}
                                          >
                                            {[
                                                "9:00 - 9.30",
                                                "9:30 - 10.00",
                                                "10:00 - 10:30",
                                                "10:30 - 11:00",
                                                "11:00 - 11:30",
                                                "11:30 - 12:00",
                                                "12:00 - 12:30",
                                                "12:30 - 13:00",
                                                "13:30 - 14:00",
                                                "14:30 - 15:00",
                                                "15:30 - 16:00",
                                            ].map((slot) => (
                                                <ListBoxItem key={slot}>{slot}</ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </Popover>
                                </ComboBox>
                            </div>

                            {/* Racecar Inputs */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-20 my-4 py-5">
                                {[...Array(driverCount)].map((_, i) => (
                                    <TextField key={i} className="flex flex-col">
                                        <Label htmlFor={`driver-${i}`} className="text-sm font-medium pb-2">
                                            Racecar {i + 1}
                                        </Label>
                                        <div className="relative flex items-center">
                                            <Icon
                                                path={mdiAccount}
                                                size={0.8}
                                                className="absolute left-2 text-gray-500"
                                            />
                                            <Input
                                                id={`driver-${i}`}
                                                className="border border-gray-300 rounded-lg pl-8 py-1 w-full"
                                                placeholder="Name"
                                                value={driverNames[i] || ""}
                                                onChange={(e) => handleNameChange(i, e.target.value)}
                                            />
                                        </div>
                                    </TextField>
                                ))}
                            </div>

                            {/* Driver Count Selector */}
                            <div className="flex justify-start text-sm">Driver Count</div>

                            <div className="flex justify-between items-center w-full gap-2">
                                <div className="flex items-center justify-center gap-2 py-2">
                                    <Button
                                        aria-label="Decrease driver count"
                                        onPress={() => setDriverCount(Math.max(1, driverCount - 1))}
                                        className="px-3 py-1 rounded border"
                                    >
                                        -
                                    </Button>
                                    <span className="text-lg font-medium">{driverCount}</span>
                                    <Button
                                        aria-label="Increase driver count"
                                        onPress={() => setDriverCount(Math.min(8, driverCount + 1))}
                                        className="px-3 py-1 rounded border"
                                    >
                                        +
                                    </Button>
                                </div>

                                {/* Save Button */}
                                <Button
                                    aria-label="Save race details"
                                    slot="close"
                                    className="bg-blue-800 text-white w-[192px] h-8 rounded flex justify-center items-center text-xs whitespace-nowrap gap-1"
                                    onPress={onSave}
                                >
                                    <Icon path={mdiInvoiceTextEdit} className="w-4 h-4 flex-shrink-0" />
                                    Save Details
                                </Button>
                            </div>

                            <div>
                                <p className="text-center text-sm text-gray-500 flex justify-start">
                                    Maximum 8 drivers
                                </p>
                            </div>
                        </div>
                    </Dialog>
                </Modal>
            </DialogTrigger>
        </div>
    );
}