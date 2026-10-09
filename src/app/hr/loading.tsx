export default function HRLoading() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-7 space-y-5 animate-pulse">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-[14px] bg-white border border-[#EEF1F7]" />
        ))}
      </div>

      {/* Two section cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-64 rounded-[14px] bg-white border border-[#EEF1F7]" />
        <div className="h-64 rounded-[14px] bg-white border border-[#EEF1F7]" />
      </div>

      {/* Table skeleton */}
      <div className="h-80 rounded-[14px] bg-white border border-[#EEF1F7]" />
    </div>
  );
}
