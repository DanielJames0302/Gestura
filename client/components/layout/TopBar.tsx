"use client";

import { SignedIn, SignOutButton } from "@clerk/clerk-react";
import { Add, Logout, Search } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TopBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  return (
    <div className="flex justify-between items-center mt-6">
      <div className="relative">
        <input
          type="text"
          className="search-bar"
          placeholder="Search a posts, people, ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="search-icon" onClick={() => router.push(`/search/posts/${search}`)} />
      </div>
      <button
        className="create-post-btn"
        onClick={() => router.push("/create-post")}
      >
        <Add />
        <p>Create A Post</p>
      </button>
      <div className="flex gap-3">
        <SignedIn>
          <SignOutButton>
            <div className="flex cursor-pointer items-center md:hidden">
              <Logout sx={{ color: "white", fontSize: "32px" }} />
              <p className="text-body-bold text-light-1">Log Out</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
      <Link href="/">
        <Image
          src={"/assets/default-avatar.jpg"}
          alt="profile photo"
          width={50}
          height={50}
          className="rounded-full md:hidden"
        />
      </Link>
    </div>
  );
};

export default TopBar;
