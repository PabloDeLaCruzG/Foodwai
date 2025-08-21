"use client";

import { useEffect, useRef, useState } from "react";

export default function AdsterraSocialPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const scriptInjected = useRef(false);

  useEffect(() => {
    // Mostrar el popup después de 30 segundos de navegación
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showPopup && !scriptInjected.current) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://pl27471490.profitableratecpm.com/80/30/ed/8030ed989b5864652cdfadd3945809ef.js";
      document.body.appendChild(script);
      scriptInjected.current = true;
    }
  }, [showPopup]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div id="container-8030ed989b5864652cdfadd3945809ef"></div>
      </div>
    </div>
  );
}
