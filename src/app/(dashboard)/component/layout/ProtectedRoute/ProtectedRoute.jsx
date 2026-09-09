"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/Home/pages/Login");
      return;
    }

    setChecking(false);
  }, [router]);

  // Jab tak token check nahi ho jata kuch bhi render mat karo
  if (checking) {
    return null;
  }

  return children;
}
