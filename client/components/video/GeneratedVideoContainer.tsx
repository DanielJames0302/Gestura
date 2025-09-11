"use client"

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useDownloader from "react-use-downloader";
import { DownloadOutlined, PlayArrowOutlined, CheckCircleOutlined, RefreshOutlined, ErrorOutlined } from "@mui/icons-material";
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
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  function blobToMp4File(blob: any, fileName = 'video.mp4') {
    const mp4File = new File([blob], fileName, {
      type: 'video/mp4',
      lastModified: Date.now(),
    });
    return mp4File;
  }

  useEffect(() => {
    if (!generatedVideo) return;
    
    const generatedVideoObjectUrl = URL.createObjectURL(generatedVideo);
  
    
    setGeneratedVideoSource(generatedVideoObjectUrl);
    setGeneratedVideoObjectUrl(generatedVideoObjectUrl);

    return () => {
      // Clean up the object URL to prevent memory leaks
      URL.revokeObjectURL(generatedVideoObjectUrl);
    };
  }, [generatedVideo]);

  const { download, error } = useDownloader();
  const handleDownloadGeneratedVideo = () => {
    const fileExtension = originalVideo?.type.split("/")[1];
    const fileName = `${originalVideo?.name.split(".")[0]}-gestura.${fileExtension}`;
    download(generatedVideoObjectUrl, fileName);
  };

  useEffect(() => {
    if (error) toast.error("Failed to download video");
  }, [error]);

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <CheckCircleOutlined sx={{ fontSize: "24px", color: "#10B981" }} />
        <div>
          <h2 className="text-heading3-bold text-light-1">Video Generated Successfully!</h2>
          <p className="text-light-2 text-small-semibold">Your sign language video is ready for download</p>
        </div>
      </div>

      {/* Video Display */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-heading3-bold text-light-1">Generated Video</h3>
          <div className="px-2 py-1 bg-purple-1/20 text-purple-1 text-small-semibold rounded-full">
            Ready
          </div>
        </div>
        
        {generatedVideoSource && (
          <div className="relative bg-dark-1 rounded-lg overflow-hidden border border-dark-2">
            {videoError ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <ErrorOutlined sx={{ fontSize: "48px", color: "#EF4444", marginBottom: "16px" }} />
                <h3 className="text-heading4-bold text-light-1 mb-2">Video Playback Error</h3>
                <p className="text-light-2 text-body-normal mb-4">
                  The generated video cannot be played in your browser. This might be due to:
                </p>
                <ul className="text-light-3 text-small-semibold text-left mb-6 space-y-1">
                  <li>• Unsupported video codec</li>
                  <li>• Browser compatibility issues</li>
                  <li>• Corrupted video file</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href={generatedVideoSource} 
                    download={`${originalVideo?.name?.split('.')[0] || 'video'}-gestura.mp4`}
                    className="px-6 py-3 bg-gradient-to-r from-purple-1 to-pink-1 text-light-1 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    <DownloadOutlined sx={{ fontSize: "20px", marginRight: "8px" }} />
                    Download Video
                  </a>
                  <button
                    onClick={() => {
                      setVideoError(false);
                      setIsVideoLoading(true);
                    }}
                    className="px-6 py-3 border border-purple-1 text-purple-1 rounded-lg font-semibold hover:bg-purple-1 hover:text-light-1 transition-colors"
                  >
                    <RefreshOutlined sx={{ fontSize: "20px", marginRight: "8px" }} />
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-1/80 z-10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-1"></div>
                      <p className="text-light-2 text-small-semibold">Loading video...</p>
                    </div>
                  </div>
                )}
                <video
                  width="100%"
                  height="400"
                  controls
                  preload="metadata"
                  className="w-full h-auto max-h-[400px] object-contain"
                  onError={(e) => {
                    console.error('Video playback error:', e);
                    setVideoError(true);
                    setIsVideoLoading(false);
                    toast.error('Failed to load video. Please try downloading it instead.');
                  }}
                  onLoadStart={() => {
                    setIsVideoLoading(true);
                  }}
                  onCanPlay={() => {
                    setIsVideoLoading(false);
                  }}
                  onLoadedData={() => {
                    setIsVideoLoading(false);
                  }}
                  onLoadedMetadata={() => {
                    setIsVideoLoading(false);
                  }}
                >
                  <source src={generatedVideoSource} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                  <source src={generatedVideoSource} type='video/mp4' />
                  <p className="text-center p-4 text-light-2">
                    Your browser does not support the video tag or the video format is not supported.
                    <br />
                    <a 
                      href={generatedVideoSource} 
                      download={`${originalVideo?.name?.split('.')[0] || 'video'}-gestura.mp4`}
                      className="text-purple-1 hover:text-pink-1 underline mt-2 inline-block"
                    >
                      Click here to download the video instead
                    </a>
                  </p>
                </video>
              </>
            )}
          </div>
        )}

        {/* Video Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-dark-2 rounded-lg">
          <div className="space-y-2">
            <h4 className="text-body-bold text-light-1">Original File</h4>
            <p className="text-light-2 text-small-semibold">
              {originalVideo?.name || 'Unknown'}
            </p>
            <p className="text-light-3 text-small-semibold">
              {(originalVideo?.size ? (originalVideo.size / (1024 * 1024)).toFixed(2) : '0')} MB
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-body-bold text-light-1">Generated File</h4>
            <p className="text-light-2 text-small-semibold">
              {originalVideo?.name?.split('.')[0]}-gestura.mp4
            </p>
            <p className="text-light-3 text-small-semibold">
              {generatedVideo ? (generatedVideo.size / (1024 * 1024)).toFixed(2) : '0'} MB
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-1 to-pink-1 hover:from-purple-1/80 hover:to-pink-1/80 text-light-1 text-body-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          onClick={handleDownloadGeneratedVideo}
        >
          <DownloadOutlined sx={{ fontSize: "20px" }} />
          <span className="hidden sm:inline">Download Video</span>
          <span className="sm:hidden">Download</span>
        </button>
        <button
          className="flex-1 px-6 py-3 bg-dark-1 hover:bg-dark-2 text-light-1 text-body-bold rounded-lg border border-dark-2 hover:border-light-3 transition-all duration-200 flex items-center justify-center gap-2"
          onClick={() => window.location.reload()}
        >
          <RefreshOutlined sx={{ fontSize: "20px" }} />
          <span className="hidden sm:inline">Generate Another</span>
          <span className="sm:hidden">New Video</span>
        </button>
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-1/10 border border-blue-1/20 rounded-lg">
        <h4 className="text-body-bold text-light-1 mb-2">💡 Tips</h4>
        <ul className="text-light-2 text-small-semibold space-y-1 list-disc list-inside">
          <li>Make sure to test the video before sharing</li>
          <li>For best results, use well-lit environments</li>
          <li>Keep your hands visible throughout the video</li>
        </ul>
      </div>
    </div>
  );
};

export default GeneratedVideoContainer;
