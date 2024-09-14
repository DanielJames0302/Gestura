"use client"

import { useState } from 'react';
import UploadVideoContainer from './UploadVideoContainer';
import GeneratedVideoContainer from './GeneratedVideoContainer';

interface VideoContainerProps {
  videoType: string
}

const VideoContainer:React.FC<VideoContainerProps> = ({videoType}) => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>();
  const [generatedVideo, setGeneratedVideo] = useState<Blob | null>();
  return (
    <div>
         <UploadVideoContainer uploadedVideo={uploadedVideo} setUploadedVideo={setUploadedVideo} setGeneratedVideo={setGeneratedVideo} videoType={videoType}/>
         {uploadedVideo && generatedVideo && <GeneratedVideoContainer originalVideo={uploadedVideo} generatedVideo={generatedVideo} />}
    </div>
  )
}

export default VideoContainer
