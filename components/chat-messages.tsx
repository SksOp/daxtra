import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  MessageContentImageFile,
  MessageContentText,
  ThreadMessage,
} from "openai/resources/beta/threads/index.mjs";
import React from "react";

function ChatMessages({ messages }: { messages: ThreadMessage[] }) {
  const reversedMessages = [...messages].reverse();
  console.log(reversedMessages);
  return (
    <div className="flex flex-col gap-4 w-full items-center">
      {reversedMessages.map((message) => {
        const isUser = message.role === "user";
        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 p-5 py-10 max-w-xl rounded-sm w-full ",
              // isUser ? "justify-end" : "justify-start",
              // isUser ? "flex-row-reverse" : "flex-row",
              isUser ? "" : "bg-gray-200",
              isUser ? "border-2 border-gray-200" : ""
            )}
          >
            <div className="flex-shrink-0">
              <Image
                alt="profile"
                src={isUser ? "/assets/user.png" : "/assets/robot.jpeg"}
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <>
              {message.content.map((content) => (
                <Content content={content} />
              ))}
            </>
          </div>
        );
      })}
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
    return <p>{content["text"].value}</p>;
  }
}
