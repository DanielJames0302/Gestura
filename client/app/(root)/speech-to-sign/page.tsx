import VideoContainer from "@/components/video/VideoContainer"
import { RecordVoiceOverOutlined, InfoOutlined } from "@mui/icons-material"

const SpeechToSign = () => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
        <div className="p-3 bg-gradient-to-r from-purple-1 to-pink-1 rounded-full">
          <RecordVoiceOverOutlined sx={{ fontSize: "32px", color: "white" }} />
        </div>
        <div>
          <h1 className="text-heading1-bold text-light-1">Speech to Sign</h1>
          <p className="text-light-2 text-body-normal">Convert your speech into sign language video</p>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-dark-2 rounded-xl p-6 border border-dark-1">
        <div className="flex items-start gap-3">
          <InfoOutlined sx={{ fontSize: "24px", color: "#7857FF", marginTop: "2px" }} />
          <div>
            <h3 className="text-heading4-bold text-light-1 mb-2">How it works</h3>
            <ol className="text-light-2 text-body-normal space-y-2 list-decimal list-inside">
              <li>Upload a video of yourself speaking</li>
              <li>Review the auto-generated captions</li>
              <li>Generate a sign language video based on your speech</li>
              <li>Download the final sign language video</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="bg-dark-2 rounded-xl p-6 border border-dark-1">
        <VideoContainer videoType="normal-video" />
      </div>
    </div>
  )
}

export default SpeechToSign
