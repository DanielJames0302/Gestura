"use client";
import { SignIn } from "@clerk/clerk-react";

export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
