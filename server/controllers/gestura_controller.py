"""
Gestura Controller Module

This module contains the GesturaController class which handles the business logic
for sign language translation and video processing operations. It acts as an
intermediary between the API routes and the service layer.

The controller provides methods for:
- Translating sign language videos to text
- Extracting captions from regular videos
- Generating sign language videos from text
- Creating videos with text-to-speech audio

"""

from fastapi import HTTPException, UploadFile
from fastapi.responses import FileResponse

import services.gestura_services as gestura_services
import services.gestura_demo as gestura_demo_services
from schemas.request import RequestFeaturesSchmea


class GesturaController:
    """
    Controller class for handling sign language translation and video processing operations.
    
    This class provides methods to coordinate between the API layer and service layer
    for various video processing tasks including sign language recognition, caption
    extraction, and video generation.
    """
    
    @staticmethod
    async def translate_sign_language_to_text(file: UploadFile) -> dict[str, str]:
        """
        Translates sign language from a video file to text captions.
        
        This method processes uploaded video files to detect and translate sign language
        gestures into text captions. It supports both demo mode and production mode
        based on the filename.
        
        Args:
            file (UploadFile): The uploaded video file containing sign language content.
            
        Returns:
            dict[str, str]: A dictionary containing the generated captions.
                Format: {"captions": "translated_text"}
                
        Raises:
            HTTPException: If caption generation fails (status code 500).
        """
        if file.filename == "gestura-demo-input.mp4":
            captions = await gestura_demo_services.translate_sign_language_to_text_demo(video=file)
            return { "captions": captions }
        
        captions = await gestura_services.translate_sign_language_to_text(video=file)

        if not captions:
            raise HTTPException(500, "Failed to generate captions from sign language!")
        return { "captions": captions }
    
    @staticmethod
    async def extract_captions_from_video(file: UploadFile) -> dict[str, str]:
        """
        Extracts captions from a regular video file using speech recognition.
        
        This method processes uploaded video files to extract audio and generate
        text captions using speech recognition technology.
        
        Args:
            file (UploadFile): The uploaded video file to extract captions from.
            
        Returns:
            dict[str, str]: A dictionary containing the extracted captions.
                Format: {"captions": "extracted_text"}
                
        Raises:
            HTTPException: If caption extraction fails (status code 500).
        """
        audio_path = 'audio_output_path/extracted_audio.wav'

        gestura_services.extract_audio_from_video(file=file, audio_path=audio_path)
        captions = await gestura_services.extract_captions_from_video(audio_path)

        print("captions: " ,captions)
    
        if not captions:
            raise HTTPException(500, "Failed to generate captions from sign language")
        
        return { "captions": captions}
    
    @staticmethod
    async def generate_video(
        file: UploadFile,
        captions: str,
    ) -> FileResponse: 
        """
        Generates a video with text-to-speech audio from captions.
        
        This method creates a new video file that combines the original video
        with synthesized speech audio generated from the provided captions.
        
        Args:
            file (UploadFile): The original video file to process.
            captions (str): The text captions to convert to speech.
            
        Returns:
            FileResponse: The generated video file as a downloadable response.
            
        Raises:
            HTTPException: If speech generation or video creation fails (status code 500).
        """
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
    
    @staticmethod
    async def generate_sign_language_video(
        file: UploadFile,
        captions: str,
    ) -> FileResponse: 
        """
        Generates a sign language video from text captions.
        
        This method creates a video file that displays sign language gestures
        corresponding to the provided text captions.
        
        Args:
            file (UploadFile): The base video file to use as reference.
            captions (str): The text captions to convert to sign language.
            
        Returns:
            FileResponse: The generated sign language video file as a downloadable response.
            
        Raises:
            HTTPException: If sign language video generation fails (status code 500).
        """
        generated_video_file_path = await gestura_services.generate_sign_language_video(
            file=file,
            captions=captions
        )

        if not generated_video_file_path:
            raise HTTPException(500, "Failed to generate video!")
        
        return FileResponse(generated_video_file_path)
    
    
  

