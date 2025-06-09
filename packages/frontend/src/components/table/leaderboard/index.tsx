"use client";

import { ActiveRace } from "racetrack-shared/types";
import React from "react";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader
} from 'react-aria-components';


interface HeaderProps {
  activeRaceData: ActiveRace;

}

export default function LeaderboardTable({ activeRaceData }: HeaderProps) {
  
  return (
  <div className="bg-black w-3/4 h-3/5 gap-16 font-cairo p-2 text-white content-evenly">
    <Table aria-label="Leaderboard" selectionMode="none" className="w-full text-center mt-12">
  
  <TableHeader className="h-5 w-[1232px]">
    <Column isRowHeader className="w-1/12 text-start pl-4 font-normal">PLACE</Column>
    <Column isRowHeader className="w-2/12 text-start pl-4 font-normal">CAR NO.</Column>
    <Column isRowHeader className="w-2/12 text-start pl-4 font-normal">DRIVER</Column>
    <Column isRowHeader className="w-4/12 text-start pl-4 font-normal"></Column>
    <Column isRowHeader className="w-2/12 text-start pl-4 font-normal">FASTEST LAP</Column>
    <Column isRowHeader className="w-1/12 text-end pr-4 font-normal">LAP COUNT</Column>
  </TableHeader>

  <TableBody>
    {Object.values(activeRaceData.contestants)
      .sort((a, b) => a.place - b.place) // sort by place
      .map((driver, index) => {
        const bgColors = ["bg-gold", "bg-silver", "bg-bronze"];
        const defaultBg = index % 2 === 0 ? "bg-black" : "bg-[#0A0A0A]";
        const bg = bgColors[driver.place - 1] || defaultBg;

        return (
          <Row key={driver.contestant.contestantId} className={`h-20 ${bg} border-y-8 border-black`}>
            <Cell className="text-start pl-4">{String(driver.place).padStart(3, "0")}</Cell>
            <Cell className="text-start pl-4">Racecar {driver.contestant.racecarNumber}</Cell>
            <Cell className="text-start pl-4">{driver.contestant.name}</Cell>
            <Cell></Cell>
            <Cell className="text-start pl-4">{formatLapTime(driver.fastestLap)}</Cell>
            <Cell className="text-end pr-4">{driver.lapCount}</Cell>
          </Row>
        );
      })}
  </TableBody>
</Table>

  </div>
 );

 function formatLapTime(ms: number | null): string {
  if (ms === null) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10); // Show centiseconds
  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}
}