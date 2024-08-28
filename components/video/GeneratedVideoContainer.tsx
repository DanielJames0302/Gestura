"use client"

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useDownloader from "react-use-downloader";
interface GeneratedVideoContainerProps {
  originalVideo: File | null | undefined;
  generatedVideo: Blob | null | undefined;
}

const GeneratedVideoContainer: React.FC<GeneratedVideoContainerProps> = ({
  originalVideo,
  generatedVideo,
}) => {
  const [generatedVideoSource, setGeneratedVideoSource] = useState("");
  const [generatedVideoObjectUrl, setGeneratedVideoObjectUrl] = useState("");

  function blobToMp4File(blob: any, fileName = 'video.mp4') {
    // Ensure the file has the correct MIME type for MP4
    const mp4File = new File([blob], fileName, {
      type: 'video/mp4',
      lastModified: Date.now(),
    });
    console.log(mp4File)
    return mp4File;
  }
  useEffect(() => {
    if (!generatedVideo) return;
    const generatedVideoObjectUrl = URL.createObjectURL(generatedVideo);
    console.log(generatedVideoObjectUrl)
    setGeneratedVideoSource(generatedVideoObjectUrl);
    setGeneratedVideoObjectUrl(generatedVideoObjectUrl);

    return () => {
      URL.revokeObjectURL(generatedVideoObjectUrl);
      URL.revokeObjectURL(generatedVideoObjectUrl);
    };
  }, [generatedVideo]);

  const { download, error } = useDownloader();
  const handleDownloadGeneratedVideo = () => {
    const fileExtension = originalVideo?.type.split("/")[1];
    const fileName = `${originalVideo?.name.split(".")[0]}-gestura.${fileExtension}`;
    console.log(generatedVideoObjectUrl)
    download(generatedVideoObjectUrl, fileName);
  };

  useEffect(() => {
    if (error) toast.error("Failed to download video");
  }, [error]);

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="font-bold text-[24px]">- Generated Video -</div>
        {generatedVideoSource && (
          <video
            width="500"
            height="500"
            controls
            className="object-cover rounded-lg"
    
          >
            <source src={generatedVideoSource} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Download Edited Video */}
        <button
          className="p-2.5 rounded-lg mt-10 bg-red-500 hover:bg-pink-1 text-light-1"
          onClick={handleDownloadGeneratedVideo}
        >
          Download Generated Video
        </button>
      </div>
    </div>
  );
};

export default GeneratedVideoContainer;
