"use client";

import { useEffect, useRef, useState } from "react";

interface AdSenseDisplayProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  onAdLoad?: () => void;
  showError?: boolean;
}

const AD_LOAD_TIMEOUT = 10000; // 10 segundos máximo de espera

export default function AdSenseDisplay({
  slot,
  style,
  className,
  onAdLoad,
  showError = false,
}: AdSenseDisplayProps) {
  const [adError, setAdError] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const setupAdObserver = () => {
      if (!adContainerRef.current) return;

      // Configurar MutationObserver para detectar cuando el anuncio se inserta
      observerRef.current = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          // Buscar cambios que indiquen que el anuncio se ha cargado
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            const iframe = adContainerRef.current?.querySelector("iframe");
            if (iframe) {
              // Si encontramos un iframe, consideramos que el anuncio se ha cargado
              if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
              }
              onAdLoad?.();
              observerRef.current?.disconnect();
              return;
            }
          }
        }
      });

      // Observar cambios en el contenedor del anuncio
      observerRef.current.observe(adContainerRef.current, {
        childList: true,
        subtree: true,
      });
    };

    try {
      // Iniciar temporizador de timeout
      loadTimeoutRef.current = setTimeout(() => {
        setAdError(true);
        observerRef.current?.disconnect();
      }, AD_LOAD_TIMEOUT);

      // Inicializar el anuncio
      // @ts-expect-error - El tipo window.adsbygoogle no está definido
      if (window.adsbygoogle) {
        // @ts-expect-error - El tipo window.adsbygoogle no está definido
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }

      setupAdObserver();
    } catch (err) {
      console.error("Error al inicializar el anuncio:", err);
      setAdError(true);
    }

    // Cleanup
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      observerRef.current?.disconnect();
    };
  }, [onAdLoad]);

  if (adError) {
    if (!showError) return null;
    return (
      <div className="text-center p-4 text-gray-600 bg-gray-100 rounded-lg">
        No se pudo cargar el anuncio. Por favor, inténtalo más tarde.
      </div>
    );
  }

  return (
    <div ref={adContainerRef}>
      <ins
        className={`adsbygoogle ${className || ""}`}
        style={{ display: "block", ...style }}
        data-ad-client="ca-pub-3475344187130724"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
