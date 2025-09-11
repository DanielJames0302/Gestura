"use client"

import Posting from "@/components/form/Posting"
import Loader from "@/components/Loader";
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { AddPhotoAlternateOutlined, VideoCallOutlined } from "@mui/icons-material";

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
    signVideo: "",
    postVideo: null,
  }

  return loading || !isLoaded ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>
  ) : (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-1 to-pink-1 rounded-full">
            <AddPhotoAlternateOutlined sx={{ fontSize: "32px", color: "white" }} />
          </div>
          <h1 className="text-heading1-bold text-light-1">Create New Post</h1>
        </div>
        <p className="text-light-2 text-body-normal">
          Share your thoughts and videos with the community
        </p>
      </div>

      {/* Post Form */}
      <div className="bg-dark-2 rounded-xl p-6 border border-dark-1">
        <Posting post={postData} />
      </div>
    </div>
  )
}

export default CreatePost
