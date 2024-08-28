"use client"

import { useState } from 'react';
import UploadVideoContainer from './UploadVideoContainer';
import GeneratedVideoContainer from './GeneratedVideoContainer';

const VideoContainer = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>();
  const [generatedVideo, setGeneratedVideo] = useState<Blob | null>();
  return (
    <div>
         <UploadVideoContainer uploadedVideo={uploadedVideo} setUploadedVideo={setUploadedVideo} setGeneratedVideo={setGeneratedVideo}/>
         {uploadedVideo && generatedVideo && <GeneratedVideoContainer originalVideo={uploadedVideo} generatedVideo={generatedVideo} />}
    </div>
  )
}

export default VideoContainer
