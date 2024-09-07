"use client";

import PostCard from "@/components/cards/PostCard";
import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchPost = () => {
  const { query } = useParams();

  const [loading, setLoading] = useState(true);

  const [searchedPosts, setSearchedPosts] = useState<any>([]);
  const searchPostMutation = useMutation(api.search.searchPost);

  const getSearchedPosts = async () => {
    if (typeof query === "string") {
      const response = await searchPostMutation({ queryStr: query });
      setSearchedPosts(response);
      setLoading(false);
    }
  };
  useEffect(() => {
    getSearchedPosts();
  }, [query]);

  const { user, isLoaded } = useUser();
  return loading || !isLoaded ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-10">
      <div className="flex gap-6">
        <Link className="tab bg-purple-1" href={`/search/posts/${query}`}>
          Posts
        </Link>
        <Link className="tab bg-dark-2" href={`/search/people/${query}`}>
          People
        </Link>
      </div>

      {searchedPosts.map((post: any) => (
        <PostCard
          key={post._id}
          post={post}
          loggedInUser={user}
        />
      ))}
    </div>
  );
};

export default SearchPost;
