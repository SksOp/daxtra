"use client";
import ChatMessages from "@/components/chat-messages";
import Introduction from "@/components/introduction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ThreadMessage } from "@/lib/openai";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [thread, setThread] = useState<string | null>(null);
  const [run, setRun] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);

  // get messages
  const getMessages = async (thread: string) => {
    if (!thread) {
      return;
    }
    const response = await fetch("/api/get-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ thread }),
    });

    const data = await response.json();
    const allMessages = data.messages as ThreadMessage[];
    setMessages(allMessages);
    setLoading(false);
  };

  // scroll to bottom on messages change or loading change
  useEffect(() => {
    window.scrollTo({
      top: document.body.offsetHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // lishen for run to complete periodically
  useEffect(() => {
    if (!run) return;
    const interval = setInterval(async () => {
      const response = await fetch("/api/retrieve-run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thread, run }),
      });

      const data = await response.json();
      const runStatus = data.run;
      const isComplete = runStatus.status === "completed";
      if (isComplete) {
        // get messages and set run to null
        setPrompt("");
        if (!thread) return;
        getMessages(thread);
        setRun(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [run]);

  // use effect to get messages on thread change on 1st render
  useEffect(() => {
    // get thread from query string
    setLoading(true);
    const url = new URL(window.location.href);
    const thread = url.searchParams.get("thread");
    if (!thread) {
      setLoading(false);
      return;
    }
    setThread(thread);
    getMessages(thread);
  }, [thread]);

  // Handle prompt submit
  const handlePromptSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ thread, message: prompt }),
    });

    const data = await response.json();
    setThread(data.thread);
    setRun(data.run);
    setPrompt("");
    // add thread id to query string
    const url = new URL(window.location.href);
    url.searchParams.set("thread", data.thread);
    // url.searchParams.set("run", data.run);
    window.history.replaceState({}, "", url.href);
  };

  return (
    <div>
      <div className="pb-36">
        {messages.length || loading ? (
          <ChatMessages messages={messages} isLoading={loading} />
        ) : (
          <Introduction />
        )}
      </div>

      <form
        className="flex flex-row fixed bottom-0 p-4 w-full justify-center "
        onSubmit={handlePromptSubmit}
      >
        <div className="flex flex-row items-center w-full pb-10 px-10 py-5 max-w-2xl gap-3 rounded-sm justify-center shadow-md border-2 bg-muted-foreground/20">
          <Input
            id="prompt"
            placeholder="Prompt"
            name="prompt"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            type="text"
            autoComplete="off"
            required
          />
          <Button type="submit" disabled={loading}>
            Generate
          </Button>
        </div>
      </form>
    </div>
  );
}
