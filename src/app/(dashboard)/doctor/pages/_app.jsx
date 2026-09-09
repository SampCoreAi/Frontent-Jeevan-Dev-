"use client"; 

import { usePathname } from "next/navigation";
import RootLayout from "../../../(dashboard)/layout"; 

export default function AppLayout({ children }) {
  const pathname = usePathname();


  const noLayoutRoutes = ["/login", "/register"];
  const isNoLayout = noLayoutRoutes.includes(pathname);

  return isNoLayout ? children : <RootLayout>{children}</RootLayout>;
}


