import { AddPhotoAlternateOutlined, CloudUploadOutlined, PlayArrowOutlined, CheckCircleOutlined, ErrorOutlined } from "@mui/icons-material";
import { useState } from "react";
import toast from "react-hot-toast";
import { translateToSignApi } from "@/api/translateToSignApi";
import Loader from "../Loader";
import { useRouter } from "next/navigation";
import ReactPlayer from 'react-player';
import LoadingModal from "../modal/LoadingModal";

interface UploadVideoContainerProps {
  uploadedVideo: File | null | undefined;
  setUploadedVideo: React.Dispatch<
    React.SetStateAction<File | null | undefined>
  >;
  setGeneratedVideo: React.Dispatch<
    React.SetStateAction<Blob | null | undefined>
  >;
  videoType: string
}
export interface VideoUploadResponseSchema {
  captions: string;
}
const UploadVideoContainer: React.FC<UploadVideoContainerProps> = ({
  uploadedVideo,
  setUploadedVideo,
  setGeneratedVideo,
  videoType
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const acceptedfileTypes = ["video/mp4", "video/mpeg"];
  const [generatedCaptions, setGeneratedCaptions] = useState("");
  const [originalVideoSource, setOriginalVideoSource] = useState("");
  const [isTextCropped, setIsTextCropped] = useState(false);
  const [originalTextLength, setOriginalTextLength] = useState(0);
  const [originalText, setOriginalText] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const router = useRouter();
  
  // Maximum text length (should match backend config)
  const MAX_TEXT_LENGTH = 500;

  // Function to crop text to maximum length
  const cropTextToLimit = (text: string): string => {
    if (text.length <= MAX_TEXT_LENGTH) {
      return text;
    }
    
    // Find the last complete word within the limit
    const croppedText = text.substring(0, MAX_TEXT_LENGTH);
    const lastSpaceIndex = croppedText.lastIndexOf(' ');
    
    if (lastSpaceIndex > MAX_TEXT_LENGTH * 0.8) { // If we can find a good word boundary
      return croppedText.substring(0, lastSpaceIndex).trim();
    } else {
      // If no good word boundary, just cut at the limit
      return croppedText.trim();
    }
  };

  // Handle caption changes with automatic cropping
  const handleCaptionChange = (newText: string) => {
    setOriginalTextLength(newText.length);
    
    if (newText.length > MAX_TEXT_LENGTH) {
      const croppedText = cropTextToLimit(newText);
      setOriginalText(newText); // Store original text
      setGeneratedCaptions(croppedText);
      setIsTextCropped(true);
      setShowOriginal(false);
      
      // Show notification about cropping
      toast.success(`Text automatically cropped to ${MAX_TEXT_LENGTH} characters`, {
        duration: 3000,
      });
    } else {
      setGeneratedCaptions(newText);
      setIsTextCropped(false);
      setOriginalText("");
      setShowOriginal(false);
    }
  };

  const handleFileChange = async (event: any) => {
    event.preventDefault();
    const selectedFile = event.target.files && event.target.files[0];
    if (!selectedFile)
      return setErrorMessage("Please select a video file (.mp4)!");
    const originalVideoObjectUrl = URL.createObjectURL(selectedFile);
    setOriginalVideoSource(originalVideoObjectUrl);

    if (!acceptedfileTypes.includes(selectedFile.type)) {
      toast.error("File format not accepted!");
      setErrorMessage("Please upload valid video format (.mp4)!");
      return;
    }
    setLoadingMessage("Please wait for extracting captions");

    setIsLoading(true);

    // Call the API to upload the video
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {

      let response;
      if (videoType==='normal-video') {
        response = await translateToSignApi.uploadNormalVideo(formData);
      } else {
        response = await translateToSignApi.uploadSignVideo(formData);
      }
     
      // Apply text cropping to the generated captions
      const rawCaptions = response.data.captions;
      const croppedCaptions = cropTextToLimit(rawCaptions);
      setGeneratedCaptions(croppedCaptions);
      
      if (rawCaptions.length > MAX_TEXT_LENGTH) {
        setOriginalText(rawCaptions); // Store original text
        setIsTextCropped(true);
        setOriginalTextLength(rawCaptions.length);
        setShowOriginal(false);
        toast.success(`Auto-generated captions cropped to ${MAX_TEXT_LENGTH} characters`, {
          duration: 3000,
        });
      }
      
      setErrorMessage("");

      toast.success("Video uploaded successfully!");

      setUploadedVideo(selectedFile);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      // Extract more detailed error information
      let errorMessage = "Failed to upload video!";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.detail) {
        errorMessage = error.detail;
      }
      
      toast.error(errorMessage);
      setErrorMessage(errorMessage);

      setUploadedVideo(null);
    }
    setErrorMessage("");
    setIsLoading(false);
  };

  const handleConfirmGenerateVideo = async () => {
    if (!uploadedVideo) return toast.error("Please upload a video!");
    setLoadingMessage("Please wait for generating video");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", uploadedVideo);
    formData.append("captions", generatedCaptions);
    let response;
    try {
      if (videoType === 'normal-video') {
        response = await translateToSignApi.generateAslVideo(formData)
      } else {
        response = await translateToSignApi.generateVideo(formData);
      }
      
      // Create blob with proper MIME type
      const generatedVideoBlob = new Blob([response.data], {
        type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
      });
      
      // Verify the blob
      console.log("Video generated successfully:", generatedVideoBlob);
      console.log("Blob type:", generatedVideoBlob.type);
      console.log("Blob size:", generatedVideoBlob.size);
      
      // Test if the blob is valid by creating an object URL
      const testUrl = URL.createObjectURL(generatedVideoBlob);
      console.log("Test object URL:", testUrl);
      
      setGeneratedVideo(generatedVideoBlob);
      toast.success("Video generated successfully!");
      
      // Clean up test URL
      URL.revokeObjectURL(testUrl);
    } catch (error) {
      console.error("Error generating video:", error);
      toast.error("Failed to generate video!");

      setGeneratedVideo(null);
    }

    setIsLoading(false);
  };
  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="space-y-4">
        <h2 className="text-heading3-bold text-light-1">Upload Video</h2>
        
        {/* Upload Area */}
        <label
          htmlFor="photo"
          className={`relative block w-full p-4 sm:p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 hover:border-purple-1 ${
            originalVideoSource.length > 0 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-light-3 hover:bg-dark-1'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            {originalVideoSource.length > 0 ? (
              <>
                <CheckCircleOutlined sx={{ fontSize: "48px", color: "#10B981" }} />
                <div className="text-center">
                  <p className="text-light-1 text-body-bold">Video Uploaded Successfully!</p>
                  <p className="text-light-2 text-small-semibold">Click to upload a different video</p>
                </div>
              </>
            ) : (
              <>
                <CloudUploadOutlined sx={{ fontSize: "48px", color: "#7857FF" }} />
                <div className="text-center">
                  <p className="text-light-1 text-body-bold">Click to upload video</p>
                  <p className="text-light-2 text-small-semibold">Supports MP4, MPEG formats</p>
                </div>
              </>
            )}
          </div>
        </label>
        
        <input
          id="photo"
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={(event) => {
            event.persist();
            handleFileChange(event);
          }}
        />

        {/* Video Preview */}
        {originalVideoSource.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-heading4-bold text-light-1">Video Preview</h3>
            <div className="relative bg-dark-1 rounded-lg overflow-hidden">
              <video
                preload="auto"
                width="100%"
                height="400"
                controls
                className="w-full h-auto max-h-[400px] object-contain"
              >
                <source src={originalVideoSource} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>

      {/* Captions Section */}
      {originalVideoSource.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-heading3-bold text-light-1">Generated Captions</h3>
            <div className="px-2 py-1 bg-purple-1/20 text-purple-1 text-small-semibold rounded-full">
              Review & Edit
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-light-2 text-small-semibold">
              Please review the auto-generated captions. You can edit them if needed, but keep the formatting consistent.
            </p>
            <textarea
              className={`w-full h-32 p-4 bg-dark-1 border rounded-lg text-light-1 text-body-normal resize-none focus:outline-none transition-colors ${
                generatedCaptions.length > MAX_TEXT_LENGTH * 0.9 
                  ? 'border-yellow-500 focus:border-yellow-500' 
                  : 'border-dark-2 focus:border-purple-1'
              }`}
              value={showOriginal ? originalText : generatedCaptions}
              onChange={(e) => handleCaptionChange(e.target.value)}
              placeholder="Captions will appear here after video processing..."
              maxLength={MAX_TEXT_LENGTH + 100} // Allow slightly more for better UX
            />
            <div className="flex justify-between items-center text-small-semibold">
              <div className="flex items-center gap-2">
                <span className={`${
                  (showOriginal ? originalText.length : generatedCaptions.length) > MAX_TEXT_LENGTH * 0.9 
                    ? 'text-yellow-400' 
                    : (showOriginal ? originalText.length : generatedCaptions.length) > MAX_TEXT_LENGTH 
                      ? 'text-red-400' 
                      : 'text-light-3'
                }`}>
                  {showOriginal ? originalText.length : generatedCaptions.length}/{MAX_TEXT_LENGTH} characters
                </span>
                {isTextCropped && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xs bg-yellow-400/20 px-2 py-1 rounded-full">
                      Cropped
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowOriginal(!showOriginal)}
                      className="text-blue-400 hover:text-blue-300 text-xs underline"
                    >
                      {showOriginal ? 'Show Cropped' : 'Show Original'}
                    </button>
                  </div>
                )}
              </div>
              <span className="text-light-3">Keep formatting consistent</span>
            </div>
          </div>
        </div>
      )}

      {/* Text Cropping Notification */}
      {isTextCropped && (
        <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <ErrorOutlined sx={{ fontSize: "20px", color: "#F59E0B" }} />
          <div>
            <p className="text-yellow-400 text-small-semibold">
              Text was automatically cropped to fit the {MAX_TEXT_LENGTH} character limit
            </p>
            <p className="text-yellow-300 text-xs mt-1">
              Original length: {originalTextLength} characters → Cropped to: {generatedCaptions.length} characters
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <ErrorOutlined sx={{ fontSize: "20px", color: "#EF4444" }} />
          <p className="text-red-400 text-small-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          className="flex-1 px-6 py-3 bg-dark-1 hover:bg-dark-2 text-light-1 text-body-bold rounded-lg border border-dark-2 hover:border-light-3 transition-all duration-200"
          onClick={() => router.push("/")}
        >
          Cancel
        </button>
        <button
          className={`flex-1 px-6 py-3 text-light-1 text-body-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            originalVideoSource.length > 0 && generatedCaptions.length > 0
              ? 'bg-gradient-to-r from-purple-1 to-pink-1 hover:from-purple-1/80 hover:to-pink-1/80'
              : 'bg-light-3 cursor-not-allowed'
          }`}
          onClick={handleConfirmGenerateVideo}
          disabled={!(originalVideoSource.length > 0 && generatedCaptions.length > 0)}
        >
          <PlayArrowOutlined sx={{ fontSize: "20px" }} />
          <span className="hidden sm:inline">Generate Video</span>
          <span className="sm:hidden">Generate</span>
        </button>
      </div>

      {isLoading && <LoadingModal message={loadingMessage} />}
    </div>
  );
};

export default UploadVideoContainer;
