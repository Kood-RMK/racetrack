"use client";

import React, { useState } from "react";
import {
    Tag,
    TagGroup,
    TagList,
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
    Popover
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
import { useSocket } from "@/components/socket/ClientProvider";

export default function NewRaceDialog() {
    const [driverCount, setDriverCount] = useState(8);
    const socket = useSocket();
    const onSave = () => {
        console.log("Test")

        if (socket){
            socket.emit("updateDrivers", {drivers: ["Rivo", "Mimi"]})

        }
    }


    return (
        <div className="bg-gray-100 w-80 h-56 p-4 gap-4 flex flex-col font-cairo">
            
            {/* Time Tag */}
            <TagGroup selectionMode="multiple" className="w-48 h-5 gap-2 flex flex-shrink-0">
              <TagList className="flex gap-2">
               <Tag className="bg-blue-200 w-24 h-5 text-xs text-blue-800 font-medium rounded flex justify-center items-center gap-1 p-1 whitespace-nowrap">
                <Icon path={mdiClockTimeFour} className="w-4 h-4 flex-shrink-0 max-w-xs md:max-w-sm" />
                  9:00 - 9:10
               </Tag>
              </TagList>
            </TagGroup>
        
            {/* Dialog */}
            <DialogTrigger>

                {/* Button that triggers Dialog */}
                <Button className="flex flex-col items-center gap-2 p-2 mt-8 text-base">
                    <Icon path={mdiCheckerboardPlus} size={1.5}/>
                    Schedule Race
                </Button>

                <Modal className="flex justify-center items-center fixed inset-0 bg-black/50 font-cairo">
                    <Dialog className="bg-gray-100 shadow-lg p-5 w-1/2">
                        
                        {/* Close Button */}
                        <div className="flex justify-end">
                            <Button slot="close">
                                <Icon path={mdiWindowClose} size={0.8} className="flex justify-end text-gray-400"></Icon>
                            </Button>
                        </div>

                        <div className="px-32">
                        {/* Heading  & Timeslot*/}
                        <div className="flex justify-between items-center w-full py-5 font-cairo">

                            <Heading className="text-2xl font-semibold text-center flex justify-start">
                                Race Details
                            </Heading>

                            <ComboBox className="relative w-48">

                                <Button>
                                <div className="realtive flex items-center">
                                  <Icon path={mdiClockTimeFour} size={0.9} className="absolute left-2 text-gray-500 pointer-events-none"></Icon>
                                  <Input placeholder="Timeslot" className="border border-gray-300 rounded-lg pl-8 pr-8 py-1 w-full"/>
                                  <Icon path={mdiMenuDown} size={1} className="absolute right-2 text-black pointer-events-none"></Icon>
                                </div>
                                </Button>

                                <Popover className="bg-white/80 rounded w-48 p-2 shadow-lg backdrop-blur-md">
                                  <ListBox className="max-h-48 overflow-y-auto font-cairo">
                                    <ListBoxItem>9:00 - 9.30</ListBoxItem>
                                    <ListBoxItem>9:30 - 10.00</ListBoxItem>
                                    <ListBoxItem>10:00 - 10:30</ListBoxItem>
                                    <ListBoxItem>10:30 - 11:00</ListBoxItem>
                                    <ListBoxItem>11:00 - 11:30</ListBoxItem>
                                    <ListBoxItem>11:30 - 12:00</ListBoxItem>
                                    <ListBoxItem>12:00 - 12:30</ListBoxItem>
                                    <ListBoxItem>12:30 - 13:00</ListBoxItem>
                                    <ListBoxItem>13:30 - 14:00</ListBoxItem>
                                    <ListBoxItem>14:30 - 15:00</ListBoxItem>
                                    <ListBoxItem>15:30 - 16:00</ListBoxItem>
                                  </ListBox>
                                </Popover>

                            </ComboBox>

                        </div>
                       
                        {/* Racecar Inputs */}
                        <div className="grid grid-cols-2 gap-y-6 gap-x-20 my-4 py-5">
                            {[...Array(driverCount)].map((_, i) => ( 
                                <TextField key={i} className="flex flex-col">
                                    <Label className="text-sm font-medium pb-2">Racecar {i + 1}</Label>
                                    <div className="relative flex items-center">
                                        <Icon path={mdiAccount} size={0.8} className="absolute left-2 text-gray-500"/>
                                        <Input className="border border-gray-300 rounded-lg pl-8 py-1 w-full" placeholder="Name" />
                                    </div>
                                </TextField>
                            ))}
                        </div>

                        {/* Driver Count Selector */}
                        <div className="flex justify-start text-sm">
                            Driver Count
                        </div>

                        <div className="flex justify-between items-center w-full gap-2">
                          <div className="flex items-center justify-center gap-2 py-2">
                            <Button
                                onPress={() => setDriverCount(Math.max(1, driverCount - 1))}
                                className="px-3 py-1 rounded border">
                                -
                            </Button>
                            <span className="text-lg font-medium">{driverCount}</span>
                            <Button
                                onPress={() => setDriverCount(Math.min(10, driverCount + 1))}
                                className="px-3 py-1 rounded border">
                                +
                            </Button>
                          </div>

                           {/* Save Button */}
                           <Button slot="close" className="bg-blue-800 text-white w-[192px] h-8 rounded flex justify-center items-center text-xs whitespace-nowrap gap-1"
                            onPress={onSave}>
                           <Icon path={mdiInvoiceTextEdit} className="w-4 h-4 flex-shrink-0"/>
                            Save Details
                           </Button>
                        </div>
                        
                        <div>
                        <p className="text-center text-sm text-gray-500 flex justify-start">Enter a number between 1 and 10</p>
                        </div>

                      </div>
                    </Dialog>
                </Modal>
            </DialogTrigger>
        </div>
    );
}