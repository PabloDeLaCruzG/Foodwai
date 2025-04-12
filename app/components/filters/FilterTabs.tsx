import { Dispatch, SetStateAction } from "react";

interface FilterTabsProps {
  filterType: "all" | "favorite";
  setFilterType: Dispatch<SetStateAction<"all" | "favorite">>;
}

export default function FilterTabs({
  filterType,
  setFilterType,
}: FilterTabsProps) {
  return (
    <div className="flex gap-3 shrink-0">
      <button
        onClick={() => setFilterType("all")}
        className={`
          text-sm font-medium transition-all whitespace-nowrap
          ${
            filterType === "all"
              ? "text-gray-900 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-gray-700"
          }
        `}
      >
        Todas
      </button>
      <button
        onClick={() => setFilterType("favorite")}
        className={`
          text-sm font-medium transition-all whitespace-nowrap
          ${
            filterType === "favorite"
              ? "text-gray-900 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-gray-700"
          }
        `}
      >
        Favoritas
      </button>
    </div>
  );
}
