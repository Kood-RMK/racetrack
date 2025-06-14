'use client';

import React, { useRef } from 'react';
import { SocketProvider } from '@providers/socket/socketProvider';
import { ActiveRaceStateProvider, useActiveRaceState } from '@providers/state/activeRaceStateProvider';
import { AuthenticationProvider } from '@/app/providers/auth/authProvider';
import { mdiArrowExpandAll } from '@mdi/js';
import Icon from '@mdi/react';

function LeaderboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRaceState = useActiveRaceState();
  const race = activeRaceState.activeRaceState;
  const timeLeft = race?.timeLeft;

  const formattedTime = timeLeft ? formatTimeLeft(timeLeft) : '00:00:00';

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  function formatTimeLeft(ms: number): string {
    const clampedMs = Math.min(ms, 10 * 60 * 1000); // Cap at 10 min max
    const absMs = Math.abs(clampedMs); // Always positive
    const totalSeconds = Math.floor(absMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((absMs % 1000) / 10);

    const pad = (n: number, len = 2) => n.toString().padStart(len, '0');
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  }

  if (!race) {
    return (
      <div ref={containerRef} className="flex min-h-screen justify-center items-center text-white bg-black text-4xl">

      {/* Fullscreen Button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          aria-label="Toggle fullscreen"
          onClick={toggleFullscreen}
          className="w-10 h-10 p-2 bg-gray-800 hover:bg-gray-700 rounded-full"
        >
          <Icon path={mdiArrowExpandAll} className="w-6 h-6 text-white" />
        </button>
      </div>
        <span>No Active Race</span>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative bg-black min-h-screen text-white flex items-center justify-center">
      {/* Fullscreen Button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          aria-label="Toggle fullscreen"
          onClick={toggleFullscreen}
          className="w-10 h-10 p-2 bg-gray-800 hover:bg-gray-700 rounded-full"
        >
          <Icon path={mdiArrowExpandAll} className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="text-9xl">{formattedTime}</div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthenticationProvider>
      <SocketProvider>
        <ActiveRaceStateProvider>
          <LeaderboardPage />
        </ActiveRaceStateProvider>
      </SocketProvider>
    </AuthenticationProvider>
  );
}