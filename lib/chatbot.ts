import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

async function jawabanGemini(message: string, history: ChatMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const konteks = await prisma.siteConfig
    .findUnique({ where: { id: 1 } })
    .then((s) =>
      s
        ? `Desa: ${s.namaDesa}, ${s.kecamatan}, ${s.kabupaten}, ${s.provinsi}. Alamat: ${s.alamatKantor}. Jam layanan: ${s.jamLayanan ?? "hubungi kantor"}. WhatsApp: ${s.noWhatsApp}.`
        : ""
    );

  const riwayat = history
    .slice(-6)
    .map((h) => `${h.role === "user" ? "Warga" : "Asisten"}: ${h.content}`)
    .join("\n");

  const prompt = `Kamu adalah asisten informasi resmi Padukuhan Jambon, Hargomulyo, Gedangsari, Gunungkidul. Jawab singkat, ramah, dalam Bahasa Indonesia, maksimal 120 kata. Gunakan emoji secukupnya.
Konteks desa: ${konteks}
Riwayat percakapan:
${riwayat}
Pertanyaan warga: ${message}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return null;
  }
}

export async function jawabChat(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const jawaban = await jawabanGemini(message, history);
  if (jawaban) return jawaban;
  return "Mohon maaf, layanan AI sedang tidak tersedia. Silakan coba lagi beberapa saat lagi. 🙏";
}
