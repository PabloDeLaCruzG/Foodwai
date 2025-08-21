"use client";

import { useEffect, useRef, useState } from "react";

export default function AdsPopupManager() {
  const [showPopup, setShowPopup] = useState(false);
  const scriptInjected = useRef(false);

  useEffect(() => {
    // Mostrar popup después de 15 segundos
    const showTimer = setTimeout(() => {
      setShowPopup(true);
    }, 15000);

    // Cerrar automáticamente después de 30 segundos adicionales
    const closeTimer = setTimeout(() => {
      setShowPopup(false);
    }, 45000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  useEffect(() => {
    if (showPopup && !scriptInjected.current) {
      // Script para Social Bar
      const socialScript = document.createElement("script");
      socialScript.type = "text/javascript";
      socialScript.src =
        "https://pl27471490.profitableratecpm.com/80/30/ed/8030ed989b5864652cdfadd3945809ef.js";
      document.body.appendChild(socialScript);

      scriptInjected.current = true;
    }
  }, [showPopup]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <button
          onClick={() => setShowPopup(false)}
          className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            ¡Espera un momento!
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Contenido especial para ti...
          </p>
        </div>

        {/* Container para Social Bar */}
        <div
          id="container-8030ed989b5864652cdfadd3945809ef"
          className="mt-4"
        ></div>
      </div>
    </div>
  );
}
