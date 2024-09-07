"use client"

import PostCard from "@/components/cards/PostCard";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";


export default function Home() {
  const {user, isLoaded} = useUser();
  const [loading, setIsLoading] = useState<boolean>(true);
  const feedPost = useQuery(api.posts.feedPost);

  return feedPost == undefined || !isLoaded ? <Loader /> : (
    <div className="flex flex-col gap-10">
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
