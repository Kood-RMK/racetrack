import { Metadata } from "next";
import Sidebar from "@components/navigation/sidebar"


export const metadata: Metadata = {
  title: "Racetrack Admin",
  description: "",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="bg-gray-950 h-screen w-screen">
        <Sidebar></Sidebar>
        {children}
    </body>
  );
}