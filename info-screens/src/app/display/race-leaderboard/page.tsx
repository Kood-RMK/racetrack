import type { ReactElement } from 'react'
import {Header} from "@/components/display/header";
import LeaderboardTable from '@/components/table/leaderboard';

export default function RaceTimerPage() {
  return (
    <div className="bg-black min-h-screen min-w-screen text-white flex flex-col items-center">
      <Header />
      <LeaderboardTable />
    </div>
  );
}