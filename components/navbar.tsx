import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

function Navbar() {
  return (
    <nav className="w-full px-5 flex flex-row justify-start items-center bg-background-muted/20">
      <Image
        alt="profile"
        src="/assets/logo.png"
        width={100}
        height={100}
        className="rounded-full"
      />
      <div className="flex-grow" />
      <a href="/">
        <Button
          variant="outline"
          className="ml-5 hover:bg-[#5b9e35] hover:text-white"
        >
          + New Chat
        </Button>
      </a>
    </nav>
  );
}

export default Navbar;
