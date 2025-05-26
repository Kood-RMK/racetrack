import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/front-desk",
      destination: "/admin/front-desk"
    },
    {
      source : "/race-control",
      destination : "/admin/race-control",
    },
    {
      source : "/lap-line-tracker",
      destination : "/admin/lap-line-tracker",
    },
    {
      source : "/leader-board",
      destination : "/display/leader-board",
    },
    {
      source : "/next-race",
      destination : "/display/next-race"
    },
    {
      source : "/race-countdown",
      destination : "/display/race-countdown"
    },
    {
      source : "/race-flags",
      destination : "/display/race-flags"
    }

  ]
};

export default nextConfig;
