"use client";

import UserCard from "@/components/cards/UserCard";
import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ArticleOutlined, PersonSearchOutlined, ArrowBack, GroupOutlined } from "@mui/icons-material";

const SearchPeople = () => {
  const { query } = useParams();

  const [loading, setLoading] = useState(true);
  const [searchedPeople, setSearchedPeople] = useState<any>([]);
  const searchPeopleMutation = useMutation(api.search.searchPeople);

  const getSearchedPeople = async () => {
    if (typeof query === "string") {
      const response = await searchPeopleMutation({ queryStr: query });
      setSearchedPeople(response);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getSearchedPeople();
  }, [query]);

  const { user, isLoaded } = useUser();

  if (loading || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <p className="text-light-2 text-body-normal">Searching people...</p>
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
            href="/people"
            className="p-2 rounded-lg hover:bg-dark-1 transition-colors"
            title="Back to people"
          >
            <ArrowBack sx={{ color: "light-2", fontSize: "24px" }} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-1 to-pink-1 rounded-full">
              <PersonSearchOutlined sx={{ fontSize: "32px", color: "white" }} />
            </div>
            <div>
              <h1 className="text-heading1-bold text-light-1">Search Results</h1>
              <p className="text-light-2 text-body-normal">
                People matching "{query}"
              </p>
            </div>
          </div>
        </div>

        {/* Search Tabs */}
        <div className="flex gap-2 mb-6">
          <Link 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-1 text-light-2 hover:bg-dark-2 transition-colors"
            href={`/search/posts/${query}`}
          >
            <ArticleOutlined sx={{ fontSize: "20px" }} />
            Posts
          </Link>
          <Link 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-1 text-light-1 font-semibold"
            href={`/search/people/${query}`}
          >
            <PersonSearchOutlined sx={{ fontSize: "20px" }} />
            People ({searchedPeople.length})
          </Link>
        </div>
      </div>

      {/* Results */}
      {searchedPeople.length === 0 ? (
        <div className="bg-dark-2 rounded-xl p-8 border border-dark-1 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-1/20 to-pink-1/20 rounded-full flex items-center justify-center">
            <GroupOutlined sx={{ fontSize: "48px", color: "#7857FF" }} />
          </div>
          <h2 className="text-heading3-bold text-light-1 mb-2">No people found</h2>
          <p className="text-light-2 text-body-normal mb-6">
            No people match your search for "{query}". Try different keywords or check your spelling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/people"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-1 to-pink-1 text-light-1 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <ArrowBack />
              Back to People
            </Link>
            <Link 
              href="/"
              className="flex items-center gap-2 border border-purple-1 text-purple-1 px-6 py-3 rounded-lg font-semibold hover:bg-purple-1 hover:text-light-1 transition-colors"
            >
              Browse Feed
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-dark-2 rounded-xl border border-dark-1 overflow-hidden">
          <div className="divide-y divide-dark-1">
            {searchedPeople.map((person: any) => (
              <div key={person._id} className="p-4 hover:bg-dark-1 transition-colors duration-200">
                <UserCard userData={person} update={getSearchedPeople} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {searchedPeople.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-light-3 text-small-normal">
            Found {searchedPeople.length} {searchedPeople.length === 1 ? 'person' : 'people'} for "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPeople;
