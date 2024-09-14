"use client"

import Posting from "@/components/form/Posting"
import Loader from "@/components/Loader";
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";

const CreatePost = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const getUser = useMutation(api.users.current);

  const fetchUser = async () => {
    const response = await getUser();
    setUserData(response);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  const postData = {
    creatorId: userData?._id,
    caption: "",
    tag: "",
    signVideo: null,
    postVideo: null,
  }
  return loading || !isLoaded ? <Loader /> : (
    <div className="pt-6">
      <Posting post={postData}  />
      
    </div>
  )
}

export default CreatePost
