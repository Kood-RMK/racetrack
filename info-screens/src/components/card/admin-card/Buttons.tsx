// Buttons for Admin Card

"use client";

import React from "react";
import { Button } from 'react-aria-components';
import { mdiDelete, mdiInvoiceTextEdit } from "@mdi/js";
import Icon from '@mdi/react';

// Race Pending Buttons

export function RacePendingButtons() {
    return (
        <div aria-label="Race schedule buttons" className="flex justify-end w-full h-8 gap-2 mt-6 flex-shrink-0">

            <Button aria-label="Modify drivers" className="text-xs flex justify-center items-center bg-blue-800 text-white p-2 rounded w-28 h-8 gap-1 whitespace-nowrap">
                <Icon path={mdiInvoiceTextEdit} className="w-4 h-4 flex-shrink-0"/>
                Modify Drivers
            </Button>

            <Button aria-label="Delete race" className="text-xs flex justify-center items-center bg-red-700 text-white p-2 rounded w-28 h-8 gap-1 whitespace-nowrap">
                <Icon path={mdiDelete} className="w-4 h-4 flex-shrink-0"/>
                Delete Race
            </Button>

        </div>
    );
}


