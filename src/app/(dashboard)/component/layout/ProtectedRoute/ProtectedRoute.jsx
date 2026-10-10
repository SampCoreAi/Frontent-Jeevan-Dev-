"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname || "";
    const isMedicalRoute = currentPath.includes("/medical/pages/");
    const shouldBypassAuth = isMedicalRoute && process.env.NODE_ENV !== "production";

    if (!token && !shouldBypassAuth) {
      router.replace("/Home/pages/Login");
      return;
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return null;
  }

  return children;
}
