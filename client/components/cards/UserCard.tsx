"use client";

import { useUser } from "@clerk/nextjs";
import Loader from "../Loader";
import { PersonAddAlt, PersonRemove } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
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

  const isFollowing = userInfo !== undefined && userInfo?.followingList?.find(
    (item: any) => item._id === userData._id
  );


  const handleFollow = async () => {
    const response = await fetch(
      `/api/user/${user?.id}/follow/${userData._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setUserInfo(data);
    update();
  };



  return loading || !isLoaded ? (
    <Loader />
  ) : (
    <div className="flex justify-between items-center">
      <Link className="flex gap-4 items-center" href={`/profile/${userData._id}/posts`}>
        <Image
          loader={myLoader}
          src={userData.profilePhoto}
          alt="profile photo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="flex flex-col gap-1">
          <p className="text-small-semibold text-light-1">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-subtle-medium text-light-3">
            @{userData.username}
          </p>
        </div>
      </Link>

      {user?.id !== userData.clerkId &&
        (isFollowing ? (
          <PersonRemove
            sx={{ color: "#7857FF", cursor: "pointer" }}
            onClick={() => handleFollow()}
          />
        ) : (
          <PersonAddAlt
            sx={{ color: "#7857FF", cursor: "pointer" }}
            onClick={() => {
              handleFollow();
            }}
          />
        ))}
    </div>
  );
};

export default UserCard;