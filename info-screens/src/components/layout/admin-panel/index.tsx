import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Racetrack Admin",
  description: "",
};

export function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="bg-red-200">
        {children}
    </body>
  );
}