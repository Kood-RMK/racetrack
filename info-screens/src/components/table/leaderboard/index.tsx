"use client";

import React from "react";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader
} from 'react-aria-components';


export default function LeaderboardTable() {
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
    <Row className="h-20 w-[1232px] bg-gold border-y-8 border-black">
      <Cell className="text-start pl-4">001</Cell>
      <Cell className="text-start pl-4">Racecar 1</Cell>
      <Cell className="text-start pl-4">Test Driver</Cell>
      <Cell></Cell>
      <Cell className="text-start pl-4">00:00:00</Cell>
      <Cell className="text-end pr-4">3</Cell>
    </Row>

    <Row className="h-20 bg-silver border-y-8 border-black">
      <Cell className="text-start pl-4">002</Cell>
      <Cell className="text-start pl-4">Racecar 2</Cell>
      <Cell className="text-start pl-4">Test Driver</Cell>
      <Cell></Cell>
      <Cell className="text-start pl-4">00:00:00</Cell>
      <Cell className="text-end pr-4">3</Cell>
    </Row>

    <Row className="h-20 bg-bronze border-y-8 border-black">
      <Cell className="text-start pl-4">003</Cell>
      <Cell className="text-start pl-4">Racecar 3</Cell>
      <Cell className="text-start pl-4">Test Driver</Cell>
      <Cell></Cell>
      <Cell className="text-start pl-4">00:00:00</Cell>
      <Cell className="text-end pr-4">2</Cell>
    </Row>

    <Row className="h-20 bg-black border-y-8 border-black">
      <Cell className="text-start pl-4">004</Cell>
      <Cell className="text-start pl-4">Racecar 4</Cell>
      <Cell className="text-start pl-4">Test Driver</Cell>
      <Cell></Cell>
      <Cell className="text-start pl-4">00:00:00</Cell>
      <Cell className="text-end pr-4">2</Cell>
    </Row>

    <Row className="h-20 bg-[#0A0A0A] border-y-8 border-black">
      <Cell className="text-start pl-4">005</Cell>
      <Cell className="text-start pl-4">Racecar 5</Cell>
      <Cell className="text-start pl-4">Test Driver</Cell>
      <Cell></Cell>
      <Cell className="text-start pl-4">00:00:00</Cell>
      <Cell className="text-end pr-4">2</Cell>
    </Row>

    <Row className="h-20 bg-black border-y-8 border-black">
      <Cell className="text-start pl-4">006</Cell>
      <Cell className="text-start pl-4">Racecar 6</Cell>
      <Cell className="text-start pl-4">Test Driver</Cell>
      <Cell></Cell>
      <Cell className="text-start pl-4">00:00:00</Cell>
      <Cell className="text-end pr-4">2</Cell>
    </Row>

    <Row className="h-20 bg-[#0A0A0A] border-y-8 border-black">
      <Cell className="text-start pl-4">007</Cell>
      <Cell className="text-start pl-4">Racecar 7</Cell>
      <Cell className="text-start pl-4">Test Driver</Cell>
      <Cell></Cell>
      <Cell className="text-start pl-4">00:00:00</Cell>
      <Cell className="text-end pr-4">1</Cell>
    </Row>

    <Row className="h-20 bg-black border-y-8 border-black">
      <Cell className="text-start pl-4">008</Cell>
      <Cell className="text-start pl-4">Racecar 8</Cell>
      <Cell className="text-start pl-4">Test Driver</Cell>
      <Cell></Cell>
      <Cell className="text-start pl-4">00:00:00</Cell>
      <Cell className="text-end pr-4">1</Cell>
    </Row>

  </TableBody>
</Table>

  </div>
 );
}