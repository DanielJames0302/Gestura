"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/Loader";
import PostCard from "@/components/cards/PostCard";
import ProfileCard from "@/components/cards/ProfileCard";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProfilePosts = () => {
  const { user, isLoaded } = useUser();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const getUserMutation = useMutation(api.users.getUserInfo);

  const fetchUser = async () => {
    if (typeof id === 'string') {
      const response = await getUserMutation({id: id});
      setUserData(response);
      setLoading(false);
    }

  };


  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);
 

  return loading || !isLoaded ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-9">
      <ProfileCard userData={userData} activeTab="Posts" update={fetchUser} /> 

      <div className="flex flex-col gap-9">
        {userData?.posts?.map((post: any) => (
          <PostCard key={post._id} post={post} loggedInUser={user} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePosts;