interface SearchFilterProps {
  search: string;
  setSearch: (val: string) => void;
  filter?: string;
  setFilter?: (val: string) => void;
  filterOptions?: { value: string; label: string }[];
  placeholder?: string;
}

export default function SearchFilter({
  search,
  setSearch,
  filter,
  setFilter,
  filterOptions = [],
  placeholder = "Search...",
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center w-full my-4 bg-white">
      {/* Search input */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`px-4 py-2 w-full border-[0.5px] border-cyan-800 shadow-sm bg-white focus:outline-none 
        ${
          setFilter && filterOptions.length > 0
            ? "rounded-s-xl rounded-e-0"
            : "rounded-xl"
        }`}
        />
        <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {/* Filter (optional) */}
      {setFilter && filterOptions.length > 0 && (
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-e-xl border-s-0 shadow-sm bg-slate-700 text-slate-200 focus:outline-none min-w-40"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
