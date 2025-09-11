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
import { Logout, Settings, Person, MoreVert } from "@mui/icons-material";
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
    <div className="h-screen left-0 top-0 sticky bg-dark-2 border-r border-dark-1 max-md:hidden">
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    </div>
  ) : (
    <div className="h-screen left-0 top-0 sticky overflow-y-scroll custom-scrollbar bg-dark-2 border-r border-dark-1 max-md:hidden w-64 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Header with Logo/Brand */}
        <div className="p-6 border-b border-dark-1">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-1 to-pink-1 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-light-1 text-heading4-bold">Gestura</span>
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-dark-1">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Profile Picture */}
            <Link href={`/profile/${userData?.externalId}/posts`} className="group">
              <div className="relative">
                <Image
                  loader={myLoader}
                  src={userData?.profilePhoto ? userData.profilePhoto : "/assets/default-avatar.jpg"}
                  width={80}
                  height={80}
                  alt="Profile"
                  className="rounded-full border-2 border-dark-1 group-hover:border-purple-1 transition-all duration-200"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-dark-2"></div>
              </div>
            </Link>

            {/* User Name */}
            <div className="space-y-1">
              <h3 className="text-light-1 text-body-bold">
                {userData?.firstName} {userData?.lastName}
              </h3>
              <p className="text-light-3 text-small-semibold">@{userData?.username || 'user'}</p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6 w-full">
              <div className="flex flex-col items-center space-y-1">
                <p className="text-light-1 text-body-bold">{userData?.posts?.length || 0}</p>
                <p className="text-light-3 text-small-semibold">Posts</p>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <p className="text-light-1 text-body-bold">{userData?.followers?.length || 0}</p>
                <p className="text-light-3 text-small-semibold">Followers</p>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <p className="text-light-1 text-body-bold">{userData?.following?.length || 0}</p>
                <p className="text-light-3 text-small-semibold">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4">
          <Menu />
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-dark-1 space-y-2">
          {/* Account Management */}
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-1 transition-colors duration-200 cursor-pointer group">
            <div className="p-2 bg-dark-1 group-hover:bg-purple-1/20 rounded-lg transition-colors duration-200">
              <UserButton />
            </div>
            <div className="flex-1">
              <p className="text-light-1 text-small-bold">Manage Account</p>
              <p className="text-light-3 text-xs">Settings & Profile</p>
            </div>
            <MoreVert sx={{ fontSize: "16px", color: "#626067" }} />
          </div>

          {/* Logout Button */}
          <SignedIn>
            <SignOutButton>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 transition-colors duration-200 cursor-pointer group">
                <div className="p-2 bg-red-500/20 group-hover:bg-red-500/30 rounded-lg transition-colors duration-200">
                  <Logout sx={{ fontSize: "20px", color: "#EF4444" }} />
                </div>
                <div className="flex-1">
                  <p className="text-red-400 text-small-bold">Sign Out</p>
                  <p className="text-light-3 text-xs">End your session</p>
                </div>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
