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
      <Button variant="outline" className="ml-5">
        {" "}
        + New Chat
      </Button>
    </nav>
  );
}

export default Navbar;
