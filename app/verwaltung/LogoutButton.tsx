"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded-full bg-red-100 px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
    >
      Abmelden
    </button>
  );
}