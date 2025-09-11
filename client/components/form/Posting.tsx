"use client"

import { AddPhotoAlternateOutlined, CloudUploadOutlined, VideoFileOutlined, CheckCircleOutlined, ErrorOutlined, CloseOutlined } from "@mui/icons-material";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import axios from "axios";
import { useRouter } from "next/navigation";
import VideoContainer from "../video/VideoContainer";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import LoadingModal from "../modal/LoadingModal";

interface Post {
  creatorId: Id<"users">;
  caption: string;
  tag: string;
  postVideo: FileList | string | null;
  signVideo: FileList | string | null;
}

interface PostingProps {
  post: Post;
}

const Posting: React.FC<PostingProps> = ({ post }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: post,
  });
  const router = useRouter();
  const uploadPost = useMutation(api.posts.createPost);
  const {user} = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const uploadCloudinary = async (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "videos_preset");

      try {
        let resourceType = "video";
        let api = `https://api.cloudinary.com/v1_1/dgkyhspuf/${resourceType}/upload`;
        const res = await axios.post(api, formData);
        const { secure_url } = res.data;
        return secure_url;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePublish = async (data: Post) => {
    try {
      setIsLoading(true);
      const postForm = new FormData();

      postForm.append("creatorId", data.creatorId);
      postForm.append("caption", data.caption);
      postForm.append("tag", data.tag);
      let signVideoUrl;

      if (typeof data.signVideo !== "string" && data.signVideo) {
        signVideoUrl = await uploadCloudinary(data.signVideo[0]);
      } else {
        signVideoUrl = data.signVideo;
      }
      if (typeof data.postVideo !== "string" && data.postVideo) {
        const videoUrl = await uploadCloudinary(data.postVideo[0]);
        postForm.append("postPhoto", videoUrl);
        await uploadPost({
          creatorId: data.creatorId,
          caption: data.caption,
          postVideo: videoUrl,
          signVideo: signVideoUrl,
          tag: data.tag,
        }); 
       
      } else if (data.postVideo) {
        postForm.append("postPhoto", data.postVideo);
        await uploadPost({
          creatorId: data.creatorId,
          caption: data.caption,
          postVideo: data.postVideo,
          signVideo: signVideoUrl,
          tag: data.tag,
        }); 
      }
      setIsLoading(false);
      router.push(`/profile/${user?.id}/posts`)
    } catch (err) {
      console.log("Create post failed", err);
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(handlePublish)}
    >
      {/* Main Video Upload */}
      <div className="space-y-3">
        <label htmlFor="postVideo" className="block text-light-1 text-body-bold">
          Main Video *
        </label>
        <label
          htmlFor="postVideo"
          className={`relative block w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 hover:border-purple-1 ${
            watch("postVideo")?.length 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-light-3 hover:bg-dark-1'
          }`}
        >
          {watch("postVideo")?.length ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircleOutlined sx={{ fontSize: "20px" }} />
                <span className="text-small-bold">Video uploaded successfully!</span>
              </div>
              <div className="relative bg-dark-1 rounded-lg overflow-hidden">
                {typeof watch("postVideo") === "string" ? (
                  <video
                    width="100%"
                    height="200"
                    controls
                    className="w-full h-auto max-h-[200px] object-contain"
                  >
                    <source src={watch("postVideo") as string} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <video
                    width="100%"
                    height="200"
                    controls
                    className="w-full h-auto max-h-[200px] object-contain"
                  >
                    <source
                      src={URL.createObjectURL((watch("postVideo") as FileList)[0])}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <CloudUploadOutlined sx={{ fontSize: "48px", color: "#7857FF" }} />
              <div className="text-center">
                <p className="text-light-1 text-body-bold">Click to upload video</p>
                <p className="text-light-2 text-small-semibold">Supports MP4, MOV, AVI formats</p>
              </div>
            </div>
          )}
        </label>
        
        <input
          {...register("postVideo", {
            validate: (value) => {
              if (
                typeof value === null ||
                (Array.isArray(value) && value.length === 0) ||
                value === "underfined"
              ) {
                return "A video is required!";
              }
              return true;
            },
          })}
          id="postVideo"
          type="file"
          accept="video/*"
          style={{ display: "none" }}
        />
        
        {errors.postVideo && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <ErrorOutlined sx={{ fontSize: "16px", color: "#EF4444" }} />
            <p className="text-red-400 text-small-semibold">
              {typeof errors.postVideo.message === "string" && errors.postVideo.message}
            </p>
          </div>
        )}
      </div>

      {/* Sign Language Video Upload */}
      <div className="space-y-3">
        <label htmlFor="signVideo" className="block text-light-1 text-body-bold">
          Sign Language Video (Optional)
        </label>
        <label
          htmlFor="signVideo"
          className={`relative block w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 hover:border-purple-1 ${
            watch("signVideo")?.length 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-light-3 hover:bg-dark-1'
          }`}
        >
          {watch("signVideo")?.length ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircleOutlined sx={{ fontSize: "20px" }} />
                <span className="text-small-bold">Sign language video uploaded!</span>
              </div>
              <div className="relative bg-dark-1 rounded-lg overflow-hidden">
                {typeof watch("signVideo") === "string" ? (
                  <video
                    width="100%"
                    height="200"
                    controls
                    className="w-full h-auto max-h-[200px] object-contain"
                  >
                    <source src={watch("signVideo") as string} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <video
                    width="100%"
                    height="200"
                    controls
                    className="w-full h-auto max-h-[200px] object-contain"
                  >
                    <source
                      src={URL.createObjectURL((watch("signVideo") as FileList)[0])}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <VideoFileOutlined sx={{ fontSize: "48px", color: "#7857FF" }} />
              <div className="text-center">
                <p className="text-light-1 text-body-bold">Add sign language video</p>
                <p className="text-light-2 text-small-semibold">Optional - for accessibility</p>
              </div>
            </div>
          )}
        </label>
        
        <input
          {...register("signVideo")}
          id="signVideo"
          type="file"
          accept="video/*"
          style={{ display: "none" }}
        />
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <label htmlFor="caption" className="block text-light-1 text-body-bold">
          Caption *
        </label>
        <textarea
          {...register("caption", {
            required: "Caption is required",
            validate: (value: any) => {
              if (value.length < 3) {
                return "Caption must be more than 2 characters";
              }
            },
          })}
          rows={4}
          placeholder="What's on your mind? Share your thoughts..."
          className="w-full p-4 bg-dark-1 border border-dark-2 rounded-lg text-light-1 text-body-normal resize-none focus:outline-none focus:border-purple-1 transition-colors"
          id="caption"
        />
        {errors.caption && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <ErrorOutlined sx={{ fontSize: "16px", color: "#EF4444" }} />
            <p className="text-red-400 text-small-semibold">
              {typeof errors.caption.message === "string" && errors.caption.message}
            </p>
          </div>
        )}
      </div>

      {/* Tag */}
      <div className="space-y-2">
        <label htmlFor="tag" className="block text-light-1 text-body-bold">
          Tag
        </label>
        <input
          {...register("tag", { required: "Tag is required" })}
          type="text"
          placeholder="#accessibility #signlanguage #community"
          className="w-full p-4 bg-dark-1 border border-dark-2 rounded-lg text-light-1 text-body-normal focus:outline-none focus:border-purple-1 transition-colors"
          id="tag"
        />
        {errors.tag && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <ErrorOutlined sx={{ fontSize: "16px", color: "#EF4444" }} />
            <p className="text-red-400 text-small-semibold">
              {typeof errors.tag.message === "string" && errors.tag.message}
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-1 to-pink-1 hover:from-purple-1/80 hover:to-pink-1/80 text-light-1 text-body-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <AddPhotoAlternateOutlined sx={{ fontSize: "20px" }} />
          Publish Post
        </button>
      </div>

      {isLoading && <LoadingModal message="Post is uploading..." />}
    </form>
  );
};

export default Posting;
