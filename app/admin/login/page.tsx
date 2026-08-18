"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputBase } from "@/components/admin/FormControls";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function masuk(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(json?.error ?? "Gagal masuk, coba lagi");
        setLoading(false);
      }
    } catch {
      setError("Gagal terhubung ke server");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hijau-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="font-serif text-2xl font-bold text-hijau-950">
          Panel Admin
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Masuk untuk mengelola konten Padukuhan Jambon.
        </p>

        <form onSubmit={masuk} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
              {error}
            </p>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBase}
              placeholder="admin@desajambon.id"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputBase}
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-hijau-800 px-5 py-2.5 text-sm font-semibold text-krem-50 transition-colors hover:bg-hijau-900 disabled:opacity-60"
          >
            {loading ? "Memeriksa…" : "Masuk"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-stone-400">
          Kredensial diatur lewat variabel ADMIN_EMAIL / ADMIN_PASSWORD di .env
        </p>
      </div>
    </div>
  );
}
