"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any[];
  }
}

interface AdSenseDisplayProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSenseDisplay({
  slot,
  style,
  className,
}: AdSenseDisplayProps) {
  useEffect(() => {
    try {
      const adsbygoogle = window.adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
      }
    } catch (err) {
      console.error("Error al inicializar el anuncio:", err);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-3475344187130724"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
