"use client";

 import { SocketProvider } from "@providers/socket/socketProvider";
import { ActiveRaceStateProvider, useActiveRaceState } from "@providers/state/activeRaceStateProvider";
import { AuthenticationProvider } from "@/app/providers/auth/authProvider";
import LeaderboardTable from "@/components/table/leaderboard";
import Header from "@/components/display/leaderboard-header";
import { mdiArrowExpandAll } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "react-aria-components";
import { useRef } from "react";


function LeaderboardPage() {
  const activeRaceState = useActiveRaceState();
  const containerRef = useRef<HTMLDivElement>(null);
  const race = activeRaceState.activeRaceState;

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return race ? (
  <div ref={containerRef} className="relative">
    <div className="bg-black min-h-screen min-w-screen text-white flex flex-col items-center pt-10 relative">
      
      {/* Fullscreen Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          aria-label="fullscreen"
          className="w-10 h-10 p-2 bg-gray-800 hover:bg-gray-700 rounded-full"
          onPress={toggleFullscreen}
        >
          <Icon path={mdiArrowExpandAll} className="w-6 h-6 text-white" />
        </Button>
      </div>

      <Header activeRaceData={race} />
      <LeaderboardTable activeRaceData={race} />
    </div>
  </div>
) : (
  <div className="bg-black min-h-screen min-w-screen flex justify-center items-center text-white">
    <div className="font-medium md:text-4xl">No ongoing races</div>
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
  )
}