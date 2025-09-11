"use client";
import { ClerkProvider } from "@clerk/nextjs";
import LeftSideBar from "@/components/layout/LeftSideBar";
import MainContainer from "@/components/layout/MainContainer";
import BottomBar from "@/components/layout/BottomBar";
import ConvexClientProvider from "../ConvexClientProvider";
import { Authenticated } from "convex/react";
import {Toaster} from 'react-hot-toast'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <div className="bg-purple-2">
        <Authenticated>
          <main className="flex flex-row">
            <Toaster position="top-right"/>
            <LeftSideBar />
            <MainContainer>{children}</MainContainer>
          </main>
          <BottomBar />
        </Authenticated>
      </div>
    </ConvexClientProvider>
  );
}
