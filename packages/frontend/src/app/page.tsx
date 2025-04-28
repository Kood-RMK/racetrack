"use client";

import React from "react";
import Icon from '@mdi/react';
import { mdiLightningBoltOutline } from '@mdi/js';
import { Button, Input, Label, TextField } from 'react-aria-components';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col items-center font-cairo">

      {/*Heading*/}
      <div className="pt-32 pb-12 w-screen h-20 flex justify-center items-center text-6xl">
        <Icon className="rotate-12 w-10 min-w-10 text-yellow-400" path={mdiLightningBoltOutline}/>
          <h1>Beachside Racetrack</h1>
        <Icon className="rotate-12 w-10 min-w-10 text-yellow-400" path={mdiLightningBoltOutline}/>
      </div>

      {/*Sub-heading*/}
      <div className="text-base pb-20">
      The race starts here. Are you ready?
      </div>

      {/*Menu*/}
      <div className='w-screen h-20 bg-yellow-400 grid grid-cols-4 text-black text-lg font-semibold'>
        
        <Link href="/display/race-leaderboard" className='flex justify-center items-center'>
          <Button >Leaderboard</Button>
        </Link>
        
        <Link href="/display/race-flag" className='flex justify-center items-center'>
          <Button>Flags</Button>
        </Link>
        
        <Link href="/display/race-announcements" className='flex justify-center items-center'>
          <Button>Announcements</Button>
        </Link>
        
        <Link href="/display/race-timer" className='flex justify-center items-center'>
          <Button>Timer</Button>
        </Link>
        
      </div>

      {/*Login window*/}
      <div className="w-screen flex-grow flex items-center justify-center" 
      style={{
        backgroundImage: "url('/yellow-car-race.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>

        <div className="bg-gray-900 w-1/2 h-96 rounded-lg bg-opacity-90 p-4 flex justify-center items-center max-w-96">
          
          <div className="w-5/6 h-5/6">
            <p className="text-3xl mb-6">Login</p>

            <TextField>
              <Label>Username</Label>
              <Input className="w-full h-12 bg-white rounded-lg mb-8 mt-1 bg-opacity-90 text-black p-2"></Input>
            </TextField>

            <TextField>
              <Label>Password</Label>
              <Input className="w-full h-12 bg-white rounded-lg mb-8 mt-1 bg-opacity-90 text-black p-2"></Input>
            </TextField>

            <div className="flex justify-end">
              <Button className="w-20 h-10 bg-black bg-opacity-80 text-white rounded-md">Login</Button>
            </div>

          </div>
        </div> 
      </div>
    </div>
  );
}