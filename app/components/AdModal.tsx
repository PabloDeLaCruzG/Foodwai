import { useEffect, useRef, useState } from "react";
import AdSenseDisplay from "./AdSenseDisplay";

interface AdModalProps {
  onClose: () => void;
  onWatchAd: () => void;
}

export default function AdModal({ onClose, onWatchAd }: AdModalProps) {
  const [timer, setTimer] = useState(20);
  const [canReward, setCanReward] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Solo iniciamos el temporizador cuando el anuncio está cargado
    if (isAdLoaded) {
      intervalRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            setCanReward(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAdLoaded]);

  const handleAdLoad = () => {
    setIsAdLoaded(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md relative max-w-sm w-full mx-3 sm:mx-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="text-xl">&times;</span>
        </button>
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pr-6">
          ¡Consigue un token extra!
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Mira el anuncio durante <b>{timer}</b> segundos y gana 1 token
          adicional o espera a mañana para obtener mas ideas.
        </p>
        <div className="flex justify-center items-center mb-4 min-h-[120px]">
          <AdSenseDisplay
            slot="4215757779"
            style={{ display: "block", width: "100%", minHeight: 100 }}
            onAdLoad={handleAdLoad}
            showError={true}
          />
        </div>
        <button
          onClick={onWatchAd}
          className={`w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm sm:text-base ${
            canReward ? "" : "opacity-60 cursor-not-allowed"
          }`}
          disabled={!canReward}
        >
          {canReward ? "Obtener token" : `Espera ${timer} segundos...`}
        </button>
      </div>
    </div>
  );
}
