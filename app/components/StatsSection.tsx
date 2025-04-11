import { FaUsers, FaUtensils, FaStar } from "react-icons/fa";

export default function StatsSection() {
  return (
    <section className="py-12 bg-orange-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <FaUsers className="w-8 h-8 text-orange-500" />
            </div>
            <span className="text-4xl font-bold text-orange-500 mb-2">
              10K+
            </span>
            <p className="text-gray-600">Usuarios Activos</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <FaUtensils className="w-8 h-8 text-orange-500" />
            </div>
            <span className="text-4xl font-bold text-orange-500 mb-2">
              50K+
            </span>
            <p className="text-gray-600">Recetas Generadas</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <FaStar className="w-8 h-8 text-orange-500" />
            </div>
            <span className="text-4xl font-bold text-orange-500 mb-2">4.8</span>
            <p className="text-gray-600">Calificación Promedio</p>
          </div>
        </div>
      </div>
    </section>
  );
}
