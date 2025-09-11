"use client"

import PostCard from "@/components/cards/PostCard";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { HomeOutlined, AddCircleOutlined, PeopleOutlined } from "@mui/icons-material";
import Link from "next/link";

export default function Home() {
  const {user, isLoaded} = useUser();
  const feedPost = useQuery(api.posts.feedPost);

  // Debug logging
  console.log("User loaded:", isLoaded);
  console.log("User:", user);
  console.log("Feed posts:", feedPost);
  console.log("Feed posts length:", feedPost?.length);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <p className="text-light-2 text-body-normal">Loading your feed...</p>
        </div>
      </div>
    );
  }

  if (feedPost === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-1"></div>
        <p className="text-light-2 text-body-normal">Loading posts...</p>
      </div>
    );
  }

  if (feedPost.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-1 to-pink-1 rounded-full">
              <HomeOutlined sx={{ fontSize: "32px", color: "white" }} />
            </div>
            <h1 className="text-heading1-bold text-light-1">Welcome to Gestura</h1>
          </div>
          <p className="text-light-2 text-body-normal">
            Hello {user?.firstName}! Ready to explore the world of sign language?
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-dark-2 rounded-xl p-8 border border-dark-1 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-1 to-pink-1 rounded-full flex items-center justify-center">
              <PeopleOutlined sx={{ fontSize: "48px", color: "white" }} />
            </div>
            <h2 className="text-heading3-bold text-light-1 mb-2">No posts yet</h2>
            <p className="text-light-2 text-body-normal mb-6">
              The community is waiting for your first post! Share your thoughts, videos, or sign language content.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-post" className="flex items-center gap-2 bg-gradient-to-r from-purple-1 to-pink-1 text-light-1 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              <AddCircleOutlined />
              Create Your First Post
            </Link>
            <Link href="/people" className="flex items-center gap-2 border border-purple-1 text-purple-1 px-6 py-3 rounded-lg font-semibold hover:bg-purple-1 hover:text-light-1 transition-colors">
              <PeopleOutlined />
              Explore Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-1 to-pink-1 rounded-full">
            <HomeOutlined sx={{ fontSize: "32px", color: "white" }} />
          </div>
          <h1 className="text-heading1-bold text-light-1">Your Feed</h1>
        </div>
        <p className="text-light-2 text-body-normal">
          Hello {user?.firstName}! Here's what's happening in the community.
        </p>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {feedPost.map((post: any) => (
          <PostCard 
            key={post._id}
            post={post}
            loggedInUser={user}
          />
        ))}
      </div>

      {/* Load More Section */}
      <div className="text-center mt-8">
        <p className="text-light-3 text-small-normal">
          You're all caught up! Check back later for new posts.
        </p>
      </div>
    </div>
  );
}
