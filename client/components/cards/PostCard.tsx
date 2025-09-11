import { BorderColor, Close } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { SignLanguage } from "@mui/icons-material";
import { useFloating, offset, shift, flip } from '@floating-ui/react-dom';
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
    middleware: [
      offset(10), 
      shift({ padding: 20 }),
      flip()
    ],
    placement: 'right-start',
    strategy: 'fixed',
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

  // Close sign video when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSignVisible && refs.floating.current && !refs.floating.current.contains(event.target as Node)) {
        setIsSignVisible(false);
      }
    };

    if (isSignVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isSignVisible, refs.floating]);
  const toggleSignLanguage = () => {
    setIsSignVisible(!isSignVisible);
  };

  return (
    <div ref={refs.setReference} className="w-full bg-dark-2 rounded-xl border border-dark-1 overflow-hidden hover:border-purple-1/30 transition-colors duration-200">
      {/* Header */}
      <div className="flex justify-between items-start p-6 pb-4">
        <Link href={`/profile/${post?.creator?.externalId}/posts`} className="flex gap-3 items-center hover:opacity-80 transition-opacity">
          <div className="relative">
            <Image
              loader={myLoader}
              src={post?.creator?.profilePhoto}
              alt="profile photo"
              width={48}
              height={48}
              className="rounded-full border-2 border-purple-1/20"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-2"></div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-small-semibold text-light-1">
              {post?.creator?.firstName} {post?.creator?.lastName}
            </p>
            <p className="text-subtle-medium text-light-3">
              @{post?.creator?.username}
            </p>
          </div>
        </Link>
        
        <div className="flex items-center gap-2">
          {loggedInUser.id === post?.creator?.externalId && (
            <Link 
              href={`/edit-post/${post._id}`}
              className="p-2 rounded-lg hover:bg-dark-1 transition-colors"
              title="Edit post"
            >
              <BorderColor sx={{ color: "light-2", fontSize: "20px" }} />
            </Link>
          )}

          {post?.signVideo && (
            <button 
              onClick={toggleSignLanguage}
              className={`p-2 rounded-lg transition-colors ${
                isSignVisible 
                  ? 'bg-purple-1 text-light-1' 
                  : 'hover:bg-dark-1 text-light-2'
              }`}
              title={isSignVisible ? "Hide sign language" : "Show sign language"}
            >
              <SignLanguage sx={{ fontSize: "20px" }} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-body-normal text-light-1 max-sm:text-small-normal leading-relaxed">
          {post.caption}
        </p>
      </div>

      {/* Video */}
      <div className="px-6 pb-4">
        <div className="relative rounded-lg overflow-hidden bg-dark-1">
          <video
            ref={mainVideoRef}
            width="100%"
            height="auto"
            controls
            className="w-full h-auto max-h-[500px] object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={post.postVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Tag */}
      {post.tag && (
        <div className="px-6 pb-4">
          <span className="inline-block bg-gradient-to-r from-purple-1/20 to-pink-1/20 text-purple-1 px-3 py-1 rounded-full text-small-semibold border border-purple-1/30">
            #{post.tag}
          </span>
        </div>
      )}

      {/* Sign Language Video Overlay */}
      {isSignVisible && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-50 bg-dark-2 rounded-lg border border-purple-1/30 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-1 to-pink-1 text-light-1 text-small-semibold">
            <span>Sign Language Translation</span>
            <button
              onClick={toggleSignLanguage}
              className="p-1 rounded hover:bg-white/20 transition-colors"
              title="Close sign language video"
            >
              <Close sx={{ fontSize: "16px" }} />
            </button>
          </div>
          <div className="relative w-[400px] h-[300px]">
            <video 
              ref={signLanguageRef} 
              width="400" 
              height="300"
              controls
              className="w-full h-full object-cover"
            >
              <source src={post.signVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
