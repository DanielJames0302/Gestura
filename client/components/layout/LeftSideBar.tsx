"use client";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import {
  SignedIn,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Logout } from "@mui/icons-material";
import Loader from "../Loader";

const LeftSideBar = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const getUser = useMutation(api.users.current);

  const fetchUser = async () => {
    const response = await getUser();
    setUserData(response);
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

  return loading || !isLoaded ? (
    <Loader />
  ) : (
    <div className="h-screen left-0 top-0 sticky overflow-y-scroll custom-scrollbar px-10 py-6 flex flex-col gap-6 max-md:hidden">
      <Link href={"/"}></Link>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 items-center text-light-1">
          <Link href={`/profile/${userData?.externalId}/posts`}>
            <Image
              loader={myLoader}
              src={userData?.profilePhoto ? userData.profilePhoto : "/assets/default-avatar.jpg"}
              width={50}
              height={50}
              alt="missing"
              className="rounded-full"
            />
          </Link>
          <p className="text-small-bold">
            {userData?.firstName} {userData?.lastName}
          </p>
        </div>
        <div className="flex text-light-1 justify-between">
          <div className="flex flex-col items-center">
            <p className="text-base-bold">{userData?.posts?.length}</p>
            <p className="text-tiny-medium">Posts</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-base-bold">{userData?.followers?.length}</p>
            <p className="text-tiny-medium">Followers</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-base-bold">{userData?.following?.length}</p>
            <p className="text-tiny-medium">Following</p>
          </div>
        </div>
        <hr />
        <Menu />
        <hr />

        <div className="flex gap-4 items-center">
          <UserButton />
          <p className="text-light-1 text-body-bold">Manage Account</p>
        </div>

        <SignedIn>
          <SignOutButton>
            <div className="flex cursor-pointer gap-4 items-center">
              <Logout sx={{ color: "white", fontSize: "32px" }} />
              <p className="text-body-bold text-light-1">Log Out</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </div>
  );
};

export default LeftSideBar;
