from fastapi import HTTPException, UploadFile
from fastapi.responses import FileResponse

import services.gestura_services as gestura_services
import services.gestura_demo as gestura_demo_services
from schemas.request import RequestFeaturesSchmea


class GesturaController:
  async def translate_sign_language_to_text(file: UploadFile) -> dict[str,str]:
 
    if file.filename == "gestura-demo-input.mp4":
      captions = await gestura_demo_services.translate_sign_language_to_text_demo(video=file)
      return { "captions": captions }
     

    captions = await gestura_services.translate_sign_language_to_text(video=file)

   

    if not captions:
     
      raise HTTPException(500, "Failed to generate captions from sign language!")
    return { "captions": captions }
  

  async def generate_video(
    file: UploadFile,
    captions: str,
    features: RequestFeaturesSchmea
  ) -> FileResponse: 
    # DEMO
    if file.filename == "gestura-demo-input.mp4":
      edited_video_file_path = await gestura_demo_services.generate_video_demo(speech=features.sign_to_speech.selected, emoji=features.sign_to_emoji.selected)
      return FileResponse(edited_video_file_path)
    

    speech_audio_file_path, emoji_captions = None, None

    # Text to Speech Feature
    if features.sign_to_speech.selected:
      speech_audio_file_path = await gestura_services.generate_text_to_speech(captions=captions)
      print(speech_audio_file_path)
      if not speech_audio_file_path:
        raise HTTPException(500, "Failed to generate speech from captions!")
  
    # Text to Emoji Feature
    if features.sign_to_emoji.selected:
      emoji_captions = await gestura_services.generate_text_to_emoji(captions=captions)
      print(emoji_captions)
      if not emoji_captions:
        raise HTTPException(500, "Failed to generate emojis from captions!")
      captions = emoji_captions # Overwrite the original captions with the emoji version
  
    # Generate Video
    edited_video_file_path = await gestura_services.generate_final_video(
      video=file,
      captions=captions,
      speech_audio_file_path=speech_audio_file_path
    )
    if not edited_video_file_path:
      raise HTTPException(500, "Failed to generate video!")
    
    print("edited file path + " ,edited_video_file_path)

    return FileResponse(edited_video_file_path)