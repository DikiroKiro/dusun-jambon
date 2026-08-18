import { NextRequest } from "next/server";
import { z } from "zod";
import { jawabChat, type ChatMessage } from "@/lib/chatbot";

const schema = z.object({
  message: z.string().min(1).max(500),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(1000),
      })
    )
    .max(20)
    .default([]),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Pesan tidak valid" }, { status: 400 });
  }

  const { message, history } = parsed.data as {
    message: string;
    history: ChatMessage[];
  };

  const reply = await jawabChat(message, history);
  return Response.json({ reply });
}
