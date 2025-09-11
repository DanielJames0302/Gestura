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
    <div className="space-y-8">
         <UploadVideoContainer uploadedVideo={uploadedVideo} setUploadedVideo={setUploadedVideo} setGeneratedVideo={setGeneratedVideo} videoType={videoType}/>
         {uploadedVideo && generatedVideo && (
           <div className="border-t border-dark-2 pt-8">
             <GeneratedVideoContainer originalVideo={uploadedVideo} generatedVideo={generatedVideo} />
           </div>
         )}
    </div>
  )
}

export default VideoContainer
