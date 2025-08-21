"use client";

import Script from "next/script";
import { useAuth } from "../context/AuthContext";

export default function AdsterraSocialBar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Script
      src="https://pl27471490.profitableratecpm.com/80/30/ed/8030ed989b5864652cdfadd3945809ef.js"
      strategy="lazyOnload"
    />
  );
}
