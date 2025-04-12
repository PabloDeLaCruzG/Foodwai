interface ProgressNutrientBarProps {
  label: string;
  value: number;
  low: number;
  high: number;
}

export default function ProgressNutrientBar({
  label,
  value,
  low,
  high,
}: ProgressNutrientBarProps) {
  // Calcular el porcentaje de progreso
  const percentage = Math.min(
    Math.max(((value - low) / (high - low)) * 100, 0),
    100
  );

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm sm:text-base">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value}g</span>
      </div>
      <div className="relative h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs sm:text-sm text-gray-500">
        <span>{low}g</span>
        <span>{high}g</span>
      </div>
    </div>
  );
}
