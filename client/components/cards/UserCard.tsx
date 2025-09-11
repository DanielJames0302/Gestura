"use client";

import { useUser } from "@clerk/nextjs";
import Loader from "../Loader";
import { PersonAddAlt, PersonRemove } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface UserDataProps {
  userData: any,
  update: any,

}

const UserCard:React.FC<UserDataProps> = ({ userData, update }) => {
  const { user, isLoaded } = useUser();

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>();

  const getUser = useMutation(api.users.getCurrentUserInfo);
  const followMutation = useMutation(api.relationship.follow);

  // Use the new relationship query for real-time follow status
  const isFollowing = useQuery(api.relationship.isFollowing, 
    userData?._id ? { targetUserId: userData._id } : "skip"
  );

  const fetchUser = async () => {
    const response = await getUser();
    setUserInfo(response);
    setLoading(false);
  };
  
  const myLoader = ({ src }: any) => {
    return src;
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  const handleFollow = async () => {
    if (user) {
      await followMutation({followedId: userData._id, followerId: user.id});
      // The UI will automatically update due to reactive queries
    }
  };



  return loading || !isLoaded ? (
    <div className="flex items-center justify-center p-4">
      <Loader />
    </div>
  ) : (
    <div className="flex justify-between items-center group">
      <Link 
        className="flex gap-4 items-center flex-1 hover:opacity-80 transition-opacity duration-200" 
        href={`/profile/${userData._id}/posts`}
      >
        <div className="relative">
          <Image
            loader={myLoader}
            src={userData.profilePhoto || "/assets/default-avatar.jpg"}
            alt="profile photo"
            width={60}
            height={60}
            className="rounded-full border-2 border-dark-1 group-hover:border-purple-1 transition-colors duration-200"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-2"></div>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <p className="text-body-bold text-light-1">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-small-semibold text-light-3">
            @{userData.username || 'user'}
          </p>
          <p className="text-small-semibold text-light-2">
            {userData.email}
          </p>
        </div>
      </Link>

      {user?.id !== userData.externalId && (
        <div className="flex items-center gap-2">
          {isFollowing ? (
            <button
              onClick={() => handleFollow()}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-200 group"
            >
              <PersonRemove sx={{ fontSize: "18px" }} />
              <span className="text-small-bold">Unfollow</span>
            </button>
          ) : (
            <button
              onClick={() => handleFollow()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-1/20 hover:bg-purple-1/30 text-purple-1 rounded-lg transition-colors duration-200 group"
            >
              <PersonAddAlt sx={{ fontSize: "18px" }} />
              <span className="text-small-bold">Follow</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;