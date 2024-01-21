import Image from "next/image";
import React from "react";

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
    </nav>
  );
}

export default Navbar;
