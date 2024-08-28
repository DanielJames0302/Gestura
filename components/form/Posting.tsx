"use client"

import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import axios from "axios";
import { useRouter } from "next/navigation";
import VideoContainer from "../video/VideoContainer";

interface Post {
  creatorId: Id<"users">;
  caption: string;
  tag: string;
  postVideo: FileList | string | null;
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
      const postForm = new FormData();

      postForm.append("creatorId", data.creatorId);
      postForm.append("caption", data.caption);
      postForm.append("tag", data.tag);

      if (typeof data.postVideo !== "string" && data.postVideo) {
        const videoUrl = await uploadCloudinary(data.postVideo[0]);
        postForm.append("postPhoto", videoUrl);
        await uploadPost({
          creatorId: data.creatorId,
          caption: data.caption,
          postVideo: videoUrl,
          tag: data.tag,
        }); 
       
      } else if (data.postVideo) {
        postForm.append("postPhoto", data.postVideo);
        await uploadPost({
          creatorId: data.creatorId,
          caption: data.caption,
          postVideo: data.postVideo,
          tag: data.tag,
        }); 
      }
      router.push(`/profile/${data.creatorId}`)
    } catch (err) {
      console.log("Create post failed", err);
    }
  };

  return (
    <form
      className="flex flex-col gap-7 pb-24"
      onSubmit={handleSubmit(handlePublish)}
    >
      <label
        htmlFor="photo"
        className="flex gap-4 items-center text-light-1 cursor-pointer"
      >
        {watch("postVideo")?.length ? (
          // Check profile photo is a string or a file
          typeof watch("postVideo") === "string" ? (
            <video
              width="250"
              height="200"
              controls
              className="object-cover rounded-lg"
            >
              <source src={watch("postVideo") as string} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <video
              width="500"
              height="500"
              controls
              className="object-cover rounded-lg"
            >
              <source
                src={URL.createObjectURL((watch("postVideo") as FileList)[0])}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )
        ) : (
          <AddPhotoAlternateOutlined
            sx={{ fontSize: "100px", color: "white" }}
          />
        )}
        <p>Upload a video</p>
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
        id="photo"
        type="file"
        accept="video/*"
        style={{ display: "none" }}
      />
      {errors.postVideo && (
        <p className="text-red-500">
          {" "}
          {typeof errors.postVideo.message === "string" &&
            errors.postVideo.message}
        </p>
      )}
      <div>
        <label htmlFor="caption" className="text-light-1">
          {" "}
          Caption
        </label>
        <textarea
          {...register("caption", {
            required: "caption is required",
            validate: (value: any) => {
              if (value.length < 3) {
                return "Caption must be more than 2 characters";
              }
            },
          })}
          typeof="text"
          rows={3}
          placeholder="what's on your mind ?"
          className="w-full input"
          id="caption"
        />

        {errors.caption && (
          <p className="text-red-500">
            {" "}
            {typeof errors.caption.message === "string" &&
              errors.caption.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="caption" className="text-light-1">
          {" "}
          Tag
        </label>
        <input
          {...register("tag", { required: "caption is required" })}
          typeof="text"
          placeholder="#tag"
          className="w-full input"
          id="tag"
        />

        {errors.tag && (
          <p className="text-red-500">
            {" "}
            {typeof errors.tag.message === "string" && errors.tag.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="py-2.5 rounded-lg mt-10 bg-purple-1 hover:bg-pink-1 text-light-1"
      >
        Publish
      </button>
    </form>
  );
};

export default Posting;
