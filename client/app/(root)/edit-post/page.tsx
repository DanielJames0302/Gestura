import Posting from '@/components/form/Posting'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const EditPost = () => {
  const {id} = useParams()
  const [postData, setPostData] = useState()

 /* const postInfo = {
    creatorId: postData?.creator?._id,
    caption: postData?.caption,
    tag: postData?.tag,
    postPhoto: postData?.postPhoto
  }*/
  return (
    <div className='pt-6'>
     {/* <Posting post={postInfo} /> */}
      
    </div>
  )
}

export default EditPost
