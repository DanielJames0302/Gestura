import { AddPhotoAlternateOutlined } from "@mui/icons-material";
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
}
export interface VideoUploadResponseSchema {
  captions: string;
}
const UploadVideoContainer: React.FC<UploadVideoContainerProps> = ({
  uploadedVideo,
  setUploadedVideo,
  setGeneratedVideo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const acceptedfileTypes = ["video/mp4", "video/mpeg"];
  const [generatedCaptions, setGeneratedCaptions] = useState("");
  const [originalVideoSource, setOriginalVideoSource] = useState("");
  const router = useRouter();


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
    setLoadingMessage("Please wait for translating translating sign language to text");

    setIsLoading(true);

    // Call the API to upload the video
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await translateToSignApi.uploadVideo(formData);
      setGeneratedCaptions(response.data.captions);
      setErrorMessage("");

      console.log("File uploaded successfully:", response);
      toast.success("Video uploaded successfully!");

      setUploadedVideo(selectedFile);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload video!");
      toast.error(error.detail);

      setUploadedVideo(null);
    }
    setErrorMessage("");
    setIsLoading(false);
  };

  const handleConfirmGenerateVideo = async () => {
    if (!uploadedVideo) return toast.error("Please upload a video!");
    setLoadingMessage("Please wait for generating video");
    setIsLoading(true);
    const features = {
      sign_to_speech: {
        selected: true,
      },
      sign_to_emoji: {
        selected: false,
      },
    };
    const formData = new FormData();
    formData.append("file", uploadedVideo);
    formData.append("captions", generatedCaptions);
    formData.append("features", JSON.stringify(features));

    try {
      const response = await translateToSignApi.generateVideo(formData);
      const generatedVideoBlob = new Blob([response.data], {type:'video/mp4'})
  
      setGeneratedVideo(generatedVideoBlob);

      console.log("Video generated successfully:", generatedVideoBlob);
      toast.success("Video generated!");
    } catch (error) {
      console.error("Error generating video:", error);
      toast.error("Failed to generate video!");

      setGeneratedVideo(null);
    }

    setIsLoading(false);
  };
  return (
    <div>
      <label
        htmlFor="photo"
        className="flex gap-4 items-center text-light-1 cursor-pointer"
      >
     

        {originalVideoSource.length > 0 ? (
          <video
            preload="auto"
            width="500"
            height="500"
            controls
            className="object-cover rounded-lg"
          >
            <source src={originalVideoSource}  type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'  />
            Your browser does not support the video tag.
          </video>
        ) : (
          <AddPhotoAlternateOutlined
            sx={{ fontSize: "100px", color: "white" }}
          />
        )}
        <p>Upload a video</p>
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
      <div className="flex flex-col gap-1">
        <div className="font-bold text-white text-[18px]">
          Generated Captions
        </div>
        <div className="text-white text-[14px]">
          Please check the auto-generated captions from sign language detected
          in the video (Please keep the formatting the same).
        </div>
        <textarea
          className="h-[200px] rounded-md border-2 border-gray-300 border-dashed focus:outline-none"
          value={generatedCaptions}
          onChange={(e) => {
            setGeneratedCaptions(e.target.value);
          }}
          disabled={!(originalVideoSource.length > 0)}
        />
      </div>
      {errorMessage && (
        <p className="text-red-500">
          {" "}
          {errorMessage}
        </p>
      )}
      <div className="flex gap-2 mt-6">
        <button
          className="p-2.5 rounded-lg mt-10 bg-red-500 hover:bg-pink-1 text-light-1"
          onClick={() => router.push("/")}
        >
          Discard
        </button>
        <button
          className="p-2.5 rounded-lg mt-10 bg-green-500 hover:bg-pink-1 text-light-1"
          onClick={handleConfirmGenerateVideo}
        >
          Confirm
        </button>
      </div>
      {isLoading && <LoadingModal  message={loadingMessage}/>}
    </div>
  );
};

export default UploadVideoContainer;
