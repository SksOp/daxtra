import { openai } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { run, thread } = data as { run: string; thread: string };
  const resp = await openai.beta.threads.runs.retrieve(thread, run);

  return NextResponse.json({ run: resp });
}
