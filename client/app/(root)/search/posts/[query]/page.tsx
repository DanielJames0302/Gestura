"use client";

import PostCard from "@/components/cards/PostCard";
import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ArticleOutlined, PersonSearchOutlined, ArrowBack } from "@mui/icons-material";

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

  if (loading || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <p className="text-light-2 text-body-normal">Searching posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/"
            className="p-2 rounded-lg hover:bg-dark-1 transition-colors"
            title="Back to home"
          >
            <ArrowBack sx={{ color: "light-2", fontSize: "24px" }} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-1 to-pink-1 rounded-full">
              <Search sx={{ fontSize: "32px", color: "white" }} />
            </div>
            <div>
              <h1 className="text-heading1-bold text-light-1">Search Results</h1>
              <p className="text-light-2 text-body-normal">
                Posts matching "{query}"
              </p>
            </div>
          </div>
        </div>

        {/* Search Tabs */}
        <div className="flex gap-2 mb-6">
          <Link 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-1 text-light-1 font-semibold"
            href={`/search/posts/${query}`}
          >
            <ArticleOutlined sx={{ fontSize: "20px" }} />
            Posts ({searchedPosts.length})
          </Link>
          <Link 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-1 text-light-2 hover:bg-dark-2 transition-colors"
            href={`/search/people/${query}`}
          >
            <PersonSearchOutlined sx={{ fontSize: "20px" }} />
            People
          </Link>
        </div>
      </div>

      {/* Results */}
      {searchedPosts.length === 0 ? (
        <div className="bg-dark-2 rounded-xl p-8 border border-dark-1 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-1/20 to-pink-1/20 rounded-full flex items-center justify-center">
            <Search sx={{ fontSize: "48px", color: "#7857FF" }} />
          </div>
          <h2 className="text-heading3-bold text-light-1 mb-2">No posts found</h2>
          <p className="text-light-2 text-body-normal mb-6">
            No posts match your search for "{query}". Try different keywords or check your spelling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-1 to-pink-1 text-light-1 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <ArrowBack />
              Back to Feed
            </Link>
            <Link 
              href="/create-post"
              className="flex items-center gap-2 border border-purple-1 text-purple-1 px-6 py-3 rounded-lg font-semibold hover:bg-purple-1 hover:text-light-1 transition-colors"
            >
              Create Post
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {searchedPosts.map((post: any) => (
            <PostCard
              key={post._id}
              post={post}
              loggedInUser={user}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      {searchedPosts.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-light-3 text-small-normal">
            Found {searchedPosts.length} {searchedPosts.length === 1 ? 'post' : 'posts'} for "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPost;
