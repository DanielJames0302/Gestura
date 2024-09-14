import { BorderColor } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { SignLanguage } from "@mui/icons-material";
import { useFloating, offset, shift, autoPlacement } from '@floating-ui/react-dom';
import { useEffect, useRef, useState } from "react";

interface PostCardProps {
  post: any;
  loggedInUser: any;
}

const PostCard: React.FC<PostCardProps> = ({ post, loggedInUser }) => {
  const [isSignVisible, setIsSignVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const signLanguageRef = useRef<HTMLVideoElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(10), shift()],
    placement: 'right-start',
    strategy: 'absolute',
  });


  const myLoader = ({ src }: any) => {
    return src;
  };

  useEffect(() => {
    const mainVideo = mainVideoRef.current;
    const signVideo = signLanguageRef.current;

    if (isSignVisible && mainVideo && signVideo) {
      if (isPlaying) {
        signVideo.currentTime = mainVideo.currentTime;
        signVideo.play();
      } else {
        signVideo.pause();
      }

      const syncVideos = () => {
        signVideo.currentTime = mainVideo.currentTime;
      };

      mainVideo.addEventListener('timeupdate', syncVideos);

      return () => {
        mainVideo.removeEventListener('timeupdate', syncVideos);
      };
    }
  }, [isSignVisible, isPlaying]);
  const toggleSignLanguage = () => {
    setIsSignVisible(!isSignVisible);
  };

  return (
    <div  ref={refs.setReference} className="w-full max-w-xl rounded-lg flex flex-col gap-4 bg-dark-1 p-5 max-sm:gap-2">
      <div  className="flex justify-between">
        <Link href={`/profile/${post?.creator?.externalId}/posts`}>
          <div className="flex gap-3 items-center">
            <Image
              loader={myLoader}
              src={post?.creator?.profilePhoto}
              alt="profile photo"
              width={50}
              height={50}
              className="rounded-lg"
            />

            <div className="flex flex-col gap-1">
              <p className="text-small-semibold text-light-1">
                {post?.creator?.firstName} {post?.creator?.lastName}
              </p>
              <p className="text-subtle-medium text-light-3">
                @{post?.creator?.username}
              </p>
            </div>
          </div>
        </Link>
        <div>
          {loggedInUser.id === post?.creator?.externalId && (
            <Link href={`/edit-post/${post._id}`}>
              <BorderColor sx={{ color: "white", cursor: "pointer" }} />
            </Link>
          )}

          {post?.signVideo && (
            <button onClick={toggleSignLanguage}>
                   <SignLanguage className="ml-2" sx={{ color: "white", cursor: "pointer" }} />
            </button>
         
          )}
        </div>
      </div>

      <p className="text-body-normal text-light-1 max-sm:text-small-normal">
        {post.caption}
      </p>

      <video
        ref={mainVideoRef}
        width="500"
        height="500"
        controls
        className="object-cover rounded-lg"
      >
        <source src={post.postVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="text-base-semibold text-purple-1 max-sm:text-small-normal">
        {post.tag}
      </p>

      {isSignVisible && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
        >
          <video ref={signLanguageRef} width="400" controls>
            <source src={post.signVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default PostCard;
