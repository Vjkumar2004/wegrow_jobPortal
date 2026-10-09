export default function JobsLoading() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-7 space-y-5 animate-pulse">
      {/* Search / filter bar */}
      <div className="h-12 rounded-[10px] bg-white border border-[#EEF1F7]" />

      {/* Quick filter chips */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-[#EEF1F7]" />
        ))}
      </div>

      {/* Job cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-44 rounded-[14px] bg-white border border-[#EEF1F7]" />
        ))}
      </div>
    </div>
  );
}
