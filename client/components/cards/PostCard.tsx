import { BorderColor } from "@mui/icons-material"
import Image from "next/image"
import Link from "next/link"

interface PostCardProps {
  post: any,
  loggedInUser: any,
}

const PostCard:React.FC<PostCardProps> = ({post, loggedInUser}) => {
  const myLoader = ({ src }: any) => {
    return src;
  };

  return (
    <div className="w-full max-w-xl rounded-lg flex flex-col gap-4 bg-dark-1 p-5 max-sm:gap-2">
      <div className="flex justify-between">
        <Link href={`/profile/${post?.creator?.externalId}/posts`}> 
          <div className="flex gap-3 items-center">
            <Image loader={myLoader} src={post?.creator?.profilePhoto} alt="profile photo" width={50} height={50} className="rounded-lg" />

            <div className="flex flex-col gap-1">
              <p className="text-small-semibold text-light-1">{post?.creator?.firstName} {post?.creator?.lastName}</p>
              <p className="text-subtle-medium text-light-3">
                @{post?.creator?.username}
              </p>
            </div>

          </div>
        </Link> 
        {loggedInUser.id === post?.creator?.externalId && (
          <Link href={`/edit-post/${post._id}`}>
          <BorderColor sx={{color:"white", cursor:"pointer"}} />
          </Link>
        ) }


      </div>

      <p className="text-body-normal text-light-1 max-sm:text-small-normal">{post.caption}</p>

      
      <video
            width="500"
            height="500"
            controls
            className="object-cover rounded-lg"
    
          >
            <source src={post.postVideo} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
      <p className="text-base-semibold text-purple-1 max-sm:text-small-normal">{post.tag}</p>
    </div>
  )
}

export default PostCard
