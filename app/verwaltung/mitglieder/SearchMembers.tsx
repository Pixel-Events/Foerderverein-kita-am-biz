"use client";

import { useState } from "react";

export default function SearchMembers({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleChange(searchValue: string) {
    setValue(searchValue);
    onSearch(searchValue);
  }

  return (
    <div className="mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Nach Name, E-Mail oder Mitgliedsnummer suchen..."
        className="w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400 shadow-sm"
      />
    </div>
  );
}