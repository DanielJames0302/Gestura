"""
Gestura API Routes Module

This module defines the FastAPI routes for the Gestura application.
It provides endpoints for video upload, sign language translation, caption extraction,
and video generation functionality.

The routes include:
- POST /upload: Upload sign language video for translation
- POST /upload-normal-video: Upload regular video for caption extraction
- POST /generate-asl: Generate sign language video from text
- POST /generate: Generate video with text-to-speech audio

"""

from typing import Annotated
from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import FileResponse

from controllers.gestura_controller import GesturaController
from schemas.request import RequestFeaturesSchmea
from schemas.response import UploadVideoResponseSchema

import json

router = APIRouter()


@router.post("/upload", tags=["Gestura"], response_model=UploadVideoResponseSchema)
async def upload_video(file: UploadFile) -> dict[str, str]:
    """
    Upload a sign language video for translation to text.
    
    This endpoint accepts a video file containing sign language gestures and
    returns the translated text captions.
    
    Args:
        file (UploadFile): The video file containing sign language content.
        
    Returns:
        dict[str, str]: A dictionary containing the translated captions.
            Format: {"captions": "translated_text"}
            
    Raises:
        HTTPException: If translation fails or file is invalid.
    """
    print(file.filename)
    print(file.file)
    return await GesturaController.translate_sign_language_to_text(file=file)

@router.post("/upload-normal-video", tags=["Gestura"], response_model=UploadVideoResponseSchema)
async def upload_normal_video(file: UploadFile) -> dict[str, str]:
    """
    Upload a regular video for caption extraction.
    
    This endpoint accepts a video file and extracts captions using speech
    recognition technology.
    
    Args:
        file (UploadFile): The video file to extract captions from.
        
    Returns:
        dict[str, str]: A dictionary containing the extracted captions.
            Format: {"captions": "extracted_text"}
            
    Raises:
        HTTPException: If caption extraction fails or file is invalid.
    """
    print(file)
    return await GesturaController.extract_captions_from_video(file=file)


@router.post("/generate-asl", tags=["Gestura"])
async def generate_asl_video(file: UploadFile, captions: Annotated[str, Form()]) -> FileResponse:
    """
    Generate a sign language video from text captions.
    
    This endpoint creates a video file that displays sign language gestures
    corresponding to the provided text captions.
    
    Args:
        file (UploadFile): The base video file to use as reference.
        captions (str): The text captions to convert to sign language.
        
    Returns:
        FileResponse: The generated sign language video file as a downloadable response.
        
    Raises:
        HTTPException: If sign language video generation fails.
    """
    return await GesturaController.generate_sign_language_video(file=file, captions=captions)
   

@router.post("/generate", tags=["Gestura"])
async def generate_video(file: UploadFile, captions: Annotated[str, Form()]) -> FileResponse:
    """
    Generate a video with text-to-speech audio from captions.
    
    This endpoint creates a new video file that combines the original video
    with synthesized speech audio generated from the provided captions.
    
    Args:
        file (UploadFile): The original video file to process.
        captions (str): The text captions to convert to speech.
        
    Returns:
        FileResponse: The generated video file with audio as a downloadable response.
        
    Raises:
        HTTPException: If speech generation or video creation fails.
    """
    # Parse `features` json
    print(file.filename)
    print(captions)
    
    return await GesturaController.generate_video(
        file=file,
        captions=captions
    )