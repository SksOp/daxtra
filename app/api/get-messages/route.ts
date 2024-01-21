import { openai } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { thread } = data as { thread: string };
  const messages = await openai.beta.threads.messages.list(thread);
  return NextResponse.json({ messages: messages.data });
}
