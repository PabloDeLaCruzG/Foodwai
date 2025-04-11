import { FaUtensils, FaHeart, FaMagic } from "react-icons/fa";

export default function FeatureSection() {
  return (
    <section id="features" className="py-16 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">¿Por qué elegir Foodia?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre una nueva forma de cocinar con la ayuda de la inteligencia
            artificial. Foodia te ayuda a crear platos deliciosos adaptados a
            tus necesidades.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4 mx-auto">
              <FaUtensils className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-orange-500 text-center mb-3">
              Recetas Personalizadas
            </h3>
            <p className="text-gray-700 text-center">
              Genera recetas únicas basadas en tus ingredientes disponibles y
              preferencias dietéticas.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4 mx-auto">
              <FaHeart className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-orange-500 text-center mb-3">
              Adaptado a Ti
            </h3>
            <p className="text-gray-700 text-center">
              Respeta tus restricciones dietéticas y preferencias alimentarias
              en cada receta.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4 mx-auto">
              <FaMagic className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-orange-500 text-center mb-3">
              Magia Culinaria
            </h3>
            <p className="text-gray-700 text-center">
              Obtén instrucciones paso a paso y sugerencias creativas para cada
              receta.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-6">
            Comienza tu viaje culinario
          </h3>
          <p className="text-gray-600 mb-8">
            Únete a nuestra comunidad y descubre nuevas posibilidades en tu
            cocina.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("auth-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors"
          >
            Prueba Foodia Gratis
          </button>
        </div>
      </div>
    </section>
  );
}
