"use client";

import { useEffect, useRef } from "react";

interface AdsterraBannerProps {
  onAdLoad?: () => void;
  showError?: boolean;
}

// ESTE ES UN COMPONENTE GENÉRICO, DEBERÁS PEGAR TU CÓDIGO DENTRO
export default function AdsterraBanner({ onAdLoad }: AdsterraBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Evitamos que el script se cargue múltiples veces en desarrollo
    if (!adRef.current || scriptLoaded.current) {
      return;
    }

    try {
      const script = document.createElement("script");
      script.type = "text/javascript";

      script.innerHTML = `
        atOptions = {
		    'key' : '2946a8f141a58cd9afd0aad4fcb7545b',
		    'format' : 'iframe',
		    'height' : 250,
		    'width' : 300,
		    'params' : {}
	    };
      `;
      const adScript = document.createElement("script");
      adScript.type = "text/javascript";
      adScript.src = `//www.highperformanceformat.com/2946a8f141a58cd9afd0aad4fcb7545b/invoke.js`;

      adRef.current.appendChild(script);
      adRef.current.appendChild(adScript);

      // Simulamos la carga del anuncio para iniciar el contador
      // Adsterra no tiene un callback de "carga" tan fiable como AdSense
      setTimeout(() => {
        if (onAdLoad) {
          onAdLoad();
        }
      }, 1500); // Esperamos 1.5s para asumir que el anuncio ha cargado

      scriptLoaded.current = true;
    } catch (error) {
      console.error("Error al cargar el script de Adsterra:", error);
    }
  }, [onAdLoad]);

  return <div ref={adRef} style={{ width: "300px", height: "250px" }} />;
}
