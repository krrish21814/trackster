import React from "react";

export default function SidebarLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-4 border-[#6B7280] border-t-[#1F2937] rounded-full animate-spin"></div>
      </div>
      <p className="text-[#222222] text-sm mt-4">Loading...</p>
    </div>
  );
}
