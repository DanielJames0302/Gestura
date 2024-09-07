"use client";

import UserCard from "@/components/cards/UserCard";
import Loader from "@/components/Loader";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  return loading || !isLoaded ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-10">
      <div className="flex gap-6">
        <Link className="tab bg-dark-2" href={`/search/posts/${query}`}>
          Posts
        </Link>
        <Link className="tab bg-purple-1" href={`/search/people/${query}`}>
          People
        </Link>
      </div>

      {searchedPeople.map((person: any) => (
        <UserCard
          key={person._id}
          userData={person}
          update={getSearchedPeople}
        />
      ))}
    </div>
  );
};

export default SearchPeople;
