"use client";

import { SignedIn, SignOutButton, useUser } from "@clerk/clerk-react";
import { Add, Logout, Search, PersonSearch } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, KeyboardEvent } from "react";

const TopBar = () => {
  const router = useRouter();
  const { user } = useUser();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/search/posts/${encodeURIComponent(search.trim())}`);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-dark-2 rounded-xl p-4 border border-dark-1 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Section */}
        <div className="flex-1 max-w-2xl w-full">
          <div className="relative">
            <Search 
              sx={{ 
                position: "absolute", 
                left: "12px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "#626067",
                fontSize: "20px"
              }} 
            />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-dark-1 border border-dark-2 rounded-lg text-light-1 text-body-normal focus:outline-none focus:border-purple-1 transition-colors placeholder:text-light-3"
              placeholder="Search posts by caption or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSearch}
              disabled={!search.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-purple-1 text-light-1 hover:bg-pink-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Search posts"
            >
              <Search sx={{ fontSize: "16px" }} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/people"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-1/30 text-purple-1 hover:bg-purple-1/10 transition-colors"
            title="Search people"
          >
            <PersonSearch sx={{ fontSize: "20px" }} />
            <span className="hidden sm:inline text-small-semibold">People</span>
          </Link>

          <button
            className="create-post-btn"
            onClick={() => router.push("/create-post")}
          >
            <Add sx={{ fontSize: "20px" }} />
            <span className="hidden sm:inline">Create Post</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
