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

export const Header = ({ className = "", AnnouncementHeader, ...props }) => {
  return (
    <div className={`header ${className}`} {...props}>
      <div className="middle">
        <div className="title">ANNOUNCEMENT</div>
        <div className="line-1"></div>
        <div className="subtext">Beachside Racetrack</div>
      </div>
    </div>
  );
};

