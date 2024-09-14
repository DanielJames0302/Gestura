"use client"

import PostCard from "@/components/cards/PostCard";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


export default function Home() {
  const {user, isLoaded} = useUser();
  const feedPost = useQuery(api.posts.feedPost);

  return feedPost == undefined || !isLoaded ? <Loader /> : (
    <div className="flex flex-col gap-10 items-center">
        {feedPost.map((post: any) => (
          <PostCard 
            key={post._id}
            post={post}
            loggedInUser={user}
          />
        ))}
      
    </div>
  );
}
