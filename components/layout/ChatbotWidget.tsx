"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/chatbot";

const SUGESTI = [
  "Persyaratan membuat KK",
  "Cara membuat KTP",
  "Jadwal posyandu",
  "Kontak kantor desa",
];

const SAMBUTAN: ChatMessage = {
  role: "assistant",
  content:
    "Halo! 👋 Aku asisten informasi Padukuhan Jambon.\nTanya apa saja soal layanan surat, KTP/KK, akta, posyandu, atau kontak desa.",
};

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([SAMBUTAN]);
  const [input, setInput] = useState("");
  const [mengetik, setMengetik] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, mengetik, open]);

  async function kirim(teks?: string) {
    const pesan = (teks ?? input).trim();
    if (!pesan || mengetik) return;

    const riwayat = messages.slice(-8);
    setMessages((m) => [...m, { role: "user", content: pesan }]);
    setInput("");
    setMengetik(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: pesan, history: riwayat }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply ?? "Maaf, ada kendala. Coba lagi ya.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Maaf, koneksi bermasalah. Silakan coba lagi.",
        },
      ]);
    } finally {
      setMengetik(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Tutup chat" : "Buka chat asisten"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-hijau-800 text-2xl text-krem-50 shadow-lg shadow-hijau-950/30 transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[480px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-hijau-100 bg-white shadow-2xl shadow-hijau-950/25">
          <div className="flex items-center gap-3 bg-hijau-900 px-4 py-3 text-krem-50">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emas-200 text-lg text-hijau-950">
              🌿
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Asisten Jambon</p>
              <p className="text-xs text-krem-100/70">Informasi layanan desa</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-krem-50 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto rounded-br-md bg-hijau-700 text-krem-50"
                    : "mr-auto rounded-bl-md bg-white text-stone-700 shadow-sm"
                )}
              >
                {m.content}
              </div>
            ))}
            {mengetik && (
              <div className="mr-auto w-fit rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-stone-400 shadow-sm">
                Mengetik…
              </div>
            )}
          </div>

          <div className="border-t border-hijau-100 bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SUGESTI.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => kirim(s)}
                  className="rounded-full border border-hijau-200 bg-hijau-50 px-2.5 py-1 text-xs text-hijau-800 hover:bg-hijau-100"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                kirim();
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pertanyaanmu…"
                className="min-w-0 flex-1 rounded-full border border-hijau-200 px-4 py-2 text-sm outline-none focus:border-hijau-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || mengetik}
                className="rounded-full bg-hijau-800 px-4 py-2 text-sm font-medium text-krem-50 disabled:opacity-40"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
