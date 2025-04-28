"use client";

import React from 'react';
import { useOverlay } from '@/components/overlay/Overlay';

const ChildComponent: React.FC = () => {
  const { openOverlay, closeOverlay } = useOverlay();

  const handleClick = () => {
    console.log("Button clicked, opening modal...");
    openOverlay(
      <div>
        <h2 className="text-xl font-bold mb-2">Modal from Child 🎉</h2>
        <p>This is dynamic content passed in via context.</p>
        <button onClick={() => {closeOverlay()}}>close</button>
      </div>
    );
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Open Modal
    </button>
  );
};

export default ChildComponent;