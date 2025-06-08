"use client";

import React from "react";


// Small race Flags
export function SmallCheckeredFlag () {

    const squareSize = 40;

    return (
        <div
      className="w-40 h-28"
      style={{
        backgroundColor: "#fff",
        backgroundImage: [
          `linear-gradient(45deg, #000 25%, transparent 25%)`,
          `linear-gradient(-45deg, #000 25%, transparent 25%)`,
          `linear-gradient(45deg, transparent 75%, #000 75%)`,
          `linear-gradient(-45deg, transparent 75%, #000 75%)`,
        ].join(", "),
        backgroundSize: `${squareSize}px ${squareSize}px`,
        backgroundPosition: `0 0, 0 ${squareSize/2}px, ${squareSize/2}px -${squareSize/2}px, -${squareSize/2}px 0`,
      }}
    />
    )
}

export function SmallRedFlag () {

    return (
        <div className="w-40 h-28 bg-red-700"></div>
    );
}

export function SmallYellowFlag () {

    return (
        <div className="w-40 h-28 bg-amber-300"></div>
    );
}

export function SmallGreenFlag () {

    return (
        <div className="w-40 h-28 bg-green-500 rounded-sm"></div>
    );
}