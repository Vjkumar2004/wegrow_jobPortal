export default function StudentLoading() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-7 space-y-5 animate-pulse">
      {/* Page header */}
      <div className="h-10 w-48 rounded-[8px] bg-[#EEF1F7]" />
      <div className="h-4 w-72 rounded-[6px] bg-[#EEF1F7]" />

      {/* Content rows */}
      <div className="h-[72px] rounded-[14px] bg-white border border-[#EEF1F7]" />
      <div className="h-[72px] rounded-[14px] bg-white border border-[#EEF1F7]" />
      <div className="h-[72px] rounded-[14px] bg-white border border-[#EEF1F7]" />
      <div className="h-[72px] rounded-[14px] bg-white border border-[#EEF1F7]" />
      <div className="h-[72px] rounded-[14px] bg-white border border-[#EEF1F7]" />
    </div>
  );
}
