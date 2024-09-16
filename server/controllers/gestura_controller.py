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
  
  async def extract_captions_from_video(file=UploadFile) -> dict[str,str]:
    audio_path = 'audio_output_path/extracted_audio.wav'

    gestura_services.extract_audio_from_video(file=file, audio_path=audio_path)
    captions = await gestura_services.extract_captions_from_video(audio_path)

    print("captions: " ,captions)
  
    if not captions:
      raise HTTPException(500, "Failed to generate captions from sign language")
    
    return { "captions": captions}
    
  

  async def generate_video(
    file: UploadFile,
    captions: str,
  ) -> FileResponse: 
    
    

    # Text to Speech Feature
    speech_audio_file_path = await gestura_services.generate_text_to_speech(captions=captions)
    print(speech_audio_file_path)
    if not speech_audio_file_path:
      raise HTTPException(500, "Failed to generate speech from captions!")
  
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
  
  async def generate_sign_language_video(
      file: UploadFile,
      captions: str,
  )->FileResponse: 
    generated_video_file_path = await gestura_services.generate_sign_language_video(
      file=file,
      captions=captions
    )

    if not generated_video_file_path:
        raise HTTPException(500, "Failed to generate video!")
    
    return FileResponse(generated_video_file_path)
    
    
  

