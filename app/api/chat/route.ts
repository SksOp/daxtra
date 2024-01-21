import { openai } from "@/lib/openai";
import { NextApiHandler } from "next";
import { NextRequest, NextResponse } from "next/server";
import { Thread } from "openai/resources/beta/index.mjs";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const threadIncoming = data.thread as string;
  var thread: string;
  if (!threadIncoming) {
    const threadData = await openai.beta.threads.create();
    thread = threadData.id;
  } else {
    thread = threadIncoming;
  }
  const message = await openai.beta.threads.messages.create(thread, {
    role: "user",
    content: data.message,
  });
  const run = await openai.beta.threads.runs.create(thread, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID as string,
  });

  return NextResponse.json({ run: run.id, thread: thread });
}
