"use client";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { Inter } from "next/font/google";
import LeftSideBar from "@/components/layout/LeftSideBar";
import MainContainer from "@/components/layout/MainContainer";
import RightSideBar from "@/components/layout/RightSideBar";
import BottomBar from "@/components/layout/BottomBar";
import ConvexClientProvider from "../ConvexClientProvider";
import { Authenticated } from "convex/react";
import {Toaster} from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body className={`${inter.className} bg-purple-2`}>
          <Authenticated>
            <main className="flex flew-row">
              <Toaster position="top-right"/>
              <LeftSideBar />
              <MainContainer>{children}</MainContainer>
              <RightSideBar />
            </main>
            <BottomBar />
          </Authenticated>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
