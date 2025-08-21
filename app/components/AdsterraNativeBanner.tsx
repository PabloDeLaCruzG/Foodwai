"use client";
import { useEffect, useRef } from "react";

export default function AdsterraNativeBanner() {
  //const adRef = useRef<HTMLDivElement>(null);
  const scriptInjected = useRef(false);

  useEffect(() => {
    if (scriptInjected.current) return;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "//pl27471946.profitableratecpm.com/c65d6579e9a324aac2816fe89727d7df/invoke.js";

    // Se recomienda añadir el script al body para asegurar que el div ya existe.
    document.body.appendChild(script);
    scriptInjected.current = true;

    // Opcional: Limpieza al desmontar el componente
    return () => {
      // document.body.removeChild(script); // Descomentar si causa problemas al navegar
    };
  }, []);

  return <div id="container-c65d6579e9a324aac2816fe89727d7df"></div>;
}
