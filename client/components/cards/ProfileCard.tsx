import { useUser } from "@clerk/nextjs";
import Loader from "../Loader";
import { PersonAddAlt, PersonRemove } from "@mui/icons-material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { tabs } from "@/constants";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ProfileCardProps {
  userData: any,
  activeTab: any,
  update: any,
}

const ProfileCard:React.FC<ProfileCardProps> = ({ userData, activeTab, update }) => {
  const { user, isLoaded } = useUser();

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>({});

  const getUser = useMutation(api.users.getCurrentUserInfo);
  const followMutation = useMutation(api.relationship.follow);


  const isFollowing = useQuery(api.relationship.isFollowing, 
    userData?.user?._id ? { targetUserId: userData.user._id } : "skip"
  );
  console.log(userData?.user?._id)
  const followCounts = useQuery(api.relationship.getFollowCounts, 
    userData?.user?._id ? { userId: userData.user._id } : "skip"
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
      await followMutation({followedId: userData.user._id, followerId: user.id});
      // The UI will automatically update due to reactive queries
    }
  };

  return loading || !isLoaded ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-9">
      <div className="flex justify-between items-start">
        <div className="flex gap-5 items-start">
          <Image
            loader={myLoader}
            src={userData.user.profilePhoto}
            alt="profile photo"
            width={100}
            height={100}
            className="rounded-full md:max-lg:hidden"
          />

          <div className="flex flex-col gap-3">
            <p className="text-light-1 text-heading3-bold max-sm:text-heading4-bold">
              {userData.user?.firstName} {userData.user?.lastName}
            </p>
            <p className="text-light-3 text-subtle-semibold">
              {userData.user?.username}
            </p>
            <div className="flex gap-7 text-small-bold max-sm:gap-4">
              <div className="flex max-sm:flex-col gap-2 items-center max-sm:gap-0.5">
                <p className="text-purple-1">{userData.posts?.length || 0}</p>
                <p className="text-light-1">Posts</p>
              </div>
              <div className="flex max-sm:flex-col gap-2 items-center max-sm:gap-0.5">
                <p className="text-purple-1">{followCounts?.followersCount || 0}</p>
                <p className="text-light-1">Followers</p>
              </div>
              <div className="flex max-sm:flex-col gap-2 items-center max-sm:gap-0.5">
                <p className="text-purple-1">{followCounts?.followingCount || 0}</p>
                <p className="text-light-1">Following</p>
              </div>
            </div>
          </div>
        </div>

        {userInfo?.user.externalId !== userData.user.externalId &&
          (isFollowing ? (
            <PersonRemove
              sx={{ color: "#7857FF", cursor: "pointer", fontSize: "40px" }}
              onClick={() => handleFollow()}
            />
          ) : (
            <PersonAddAlt
              sx={{ color: "#7857FF", cursor: "pointer", fontSize: "40px" }}
              onClick={() => handleFollow()}
            />
          ))}
      </div>

      <div className="flex gap-6">
        {tabs.map((tab, index) => (
          <Link
            key={index}
            className={`tab ${
              activeTab === tab.name ? "bg-purple-1" : "bg-dark-2"
            }`}
            href={`/profile/${userData.user.externalId}/${tab.link}`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;