"use client";
import ChatMessages from "@/components/chat-messages";
import Introduction from "@/components/introduction";
import PromptInput from "@/components/prompt-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ThreadMessage } from "@/lib/openai";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [thread, setThread] = useState<string | null>(null);
  const [run, setRun] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);

  const ref = useRef<HTMLDivElement>(null);

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
    // window.scrollTo({
    //   top: document.body.offsetHeight,
    //   behavior: "smooth",
    // });
    if (!ref.current) return;
    ref.current.scrollTop = ref.current.scrollHeight;
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

  const renderMessages =
    messages.length || loading ? (
      <ChatMessages messages={messages} isLoading={loading} />
    ) : (
      <Introduction />
    );

  return (
    <div className="flex relative flex-row">
      <PromptInput
        handlePromptSubmit={handlePromptSubmit}
        prompt={prompt}
        setPrompt={setPrompt}
        loading={loading}
        className="sticky w-[50%] flex-grow top-0 left-0 right-0 z-10 border-r-2"
      />
      <div ref={ref} className="flex-grow w-[50%] max-h-[80vh] overflow-auto ">
        {renderMessages}
      </div>
    </div>
  );
}
