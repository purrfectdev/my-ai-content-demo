"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "./components/NavBar";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      {children}
      <Toaster position="top-center" richColors closeButton />
      <NavBar />
    </>
  );
}
