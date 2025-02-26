"use client";

import React from "react";
import "./Header.css";

export const Header = ({ AnnouncementHeader, ...props }) => {
  return (
    <div className={"header " + className}>
      <div className="middle">
        <div className="title">ANNOUNCEMENT </div>
        <div className="line-1"></div>
        <div className="subtext">Beachside Racetrack </div>
      </div>
    </div>
  );
};
