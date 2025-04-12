interface AdModalProps {
  onClose: () => void;
  onWatchAd: () => void;
}

export default function AdModal({ onClose, onWatchAd }: AdModalProps) {
  const closeAdModal = () => onClose();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleWatchAd = () => onWatchAd();
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md relative max-w-sm w-full mx-3 sm:mx-auto">
        <button
          onClick={closeAdModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="text-xl">&times;</span>
        </button>
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pr-6">
          Has llegado al límite de créditos diarios
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Vuelve mañana o instala la aplicación y obtén una generación
          adicional.
        </p>
        {/* <button
          onClick={handleWatchAd}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm sm:text-base"
        >
          Ver anuncio
        </button> */}
      </div>
    </div>
  );
}
