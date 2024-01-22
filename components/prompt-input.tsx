import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

function PromptInput({
  handlePromptSubmit,
  prompt,
  setPrompt,
  loading,
  className,
}: Readonly<{
  handlePromptSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  className?: ClassValue;
}>) {
  return (
    <form
      className={cn("flex flex-row p-4  justify-center ", className)}
      onSubmit={handlePromptSubmit}
    >
      <div className="flex h-[80vh] flex-col items-right w-full pb-10 px-10 py-5 max-w-2xl gap-3 rounded-sm justify-center  ">
        <Textarea
          id="prompt"
          placeholder="Prompt"
          name="prompt"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          autoComplete="off"
          required
          className="h-full"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-foreground "
        >
          Generate
        </Button>
      </div>
    </form>
  );
}

export default PromptInput;
