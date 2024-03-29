import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  MessageContentImageFile,
  MessageContentText,
  ThreadMessage,
} from "openai/resources/beta/threads/index.mjs";
import React from "react";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remrkMath from "remark-math";
import Markdown from "react-markdown";
import { Skeleton } from "./ui/skeleton";

function ChatMessages({
  messages,
  isLoading,
}: {
  messages: ThreadMessage[];
  isLoading: boolean;
}) {
  const reversedMessages = [...messages].reverse();
  return (
    <div
      id="chat-messages"
      className="flex flex-col gap-4 px-4 w-full items-center"
    >
      {reversedMessages.map((message) => {
        const isUser = message.role === "user";
        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 p-5 py-10 max-w-4xl rounded-sm w-full ",
              // isUser ? "justify-end" : "justify-start",
              // isUser ? "flex-row-reverse" : "flex-row",
              isUser ? "" : "bg-gray-200",
              isUser ? "border-2 border-gray-200" : ""
            )}
          >
            <div className="flex-shrink-0">
              <Image
                alt="profile"
                src={isUser ? "/assets/logo.png" : "/assets/robot.jpeg"}
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <div>
              <p
                // // for all list items in the markdown add a pd left
                // className="[&>ul>li]:pl-4 [&>ul>li]:py-2"
                // // for all list items in the markdown add a bullet
                className={cn(
                  "[&>ul>li]:before:content-['•'] [&>ul>li]:pl-4 [&>ul>li]:py-2 ",
                  isUser ? "font-bold" : ""
                )}
              >
                {message.content.map((content) => (
                  <Content content={content} />
                ))}
              </p>
            </div>
          </div>
        );
      })}
      {isLoading && (
        <Skeleton className="w-full max-w-4xl rounded-sm p-5 h-36">
          Processing ...
        </Skeleton>
      )}
    </div>
  );
}

export default ChatMessages;

function Content({
  content,
}: {
  content: MessageContentImageFile | MessageContentText;
}) {
  if (content.type === "image_file") {
    return (
      <Image
        alt="image"
        src={content["image_file"].file_id}
        width={200}
        height={200}
      />
    );
  } else {
    var data = content["text"].value;
    console.log(data);
    return (
      <Markdown
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        remarkPlugins={[remarkGfm, remarkParse, remarkStringify, remrkMath]}
      >
        {data}
      </Markdown>
    );
  }
}
