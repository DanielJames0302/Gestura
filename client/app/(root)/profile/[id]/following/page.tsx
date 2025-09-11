"use client"

import { api } from "@/convex/_generated/api";
import Loader from "@/components/Loader";
import ProfileCard from "@/components/cards/ProfileCard";
import UserCard from "@/components/cards/UserCard";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Following = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const getUserMutation = useMutation(api.users.getUserInfo);

  // Get following list using the new relationship query
  const following = useQuery(api.relationship.getFollowing, 
    userData?.user?._id ? { userId: userData.user._id } : "skip"
  );

  const fetchUser = async () => {
    if (typeof id === 'string') {
      const response = await getUserMutation({id: id});
      setUserData(response);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-9">
      <ProfileCard userData={userData} activeTab="Following" update={fetchUser} />

      <div className="flex flex-col gap-9">
        {following?.filter((person: any) => person && person._id).map((person: any) => (
          <UserCard key={person._id} userData={person} update={fetchUser}/>
        ))}
      </div>
    </div>
  );
};

export default Following;