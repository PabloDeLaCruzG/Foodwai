import { Dispatch, SetStateAction } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";

interface SortByProps {
  sortBy: "recent" | "time" | "difficulty";
  setSortBy: Dispatch<SetStateAction<"recent" | "time" | "difficulty">>;
}

export default function SortBy({ sortBy, setSortBy }: SortByProps) {
  return (
    <div className="relative inline-flex items-center w-24 sm:w-auto">
      <ArrowsUpDownIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        className="appearance-none bg-transparent text-sm text-gray-700 pl-6 pr-2 py-1.5 cursor-pointer focus:outline-none hover:text-gray-900 w-full"
      >
        <option value="recent">Recientes</option>
        <option value="time">Tiempo</option>
        <option value="difficulty">Dificultad</option>
      </select>
    </div>
  );
}
