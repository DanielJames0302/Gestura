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
from services.pose_visualization_service import pose_visualization_service

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


@router.post("/generate-pose-gif", tags=["Pose Generation"])
async def generate_pose_gif(text: Annotated[str, Form()]) -> FileResponse:
    """
    Generate a pose GIF from text using ZurichNLP model.
    
    This endpoint creates a GIF file showing sign language poses
    corresponding to the provided text.
    
    Args:
        text (str): The text to convert to sign language poses.
        
    Returns:
        FileResponse: The generated pose GIF file as a downloadable response.
        
    Raises:
        HTTPException: If pose generation fails.
    """
    import uuid
    output_path = f"video_output_path/pose_{uuid.uuid4().hex}.gif"
    
    generated_gif_path = await pose_visualization_service.text_to_pose_gif(
        text=text,
        output_path=output_path,
        width=256,
        height=256
    )
    
    if not generated_gif_path:
        raise HTTPException(500, "Failed to generate pose GIF")
    
    return FileResponse(generated_gif_path)


@router.post("/generate-pose-mp4", tags=["Pose Generation"])
async def generate_pose_mp4(text: Annotated[str, Form()]) -> FileResponse:
    """
    Generate a pose MP4 from text using ZurichNLP model.
    
    This endpoint creates an MP4 file showing sign language poses
    corresponding to the provided text.
    
    Args:
        text (str): The text to convert to sign language poses.
        
    Returns:
        FileResponse: The generated pose MP4 file as a downloadable response.
        
    Raises:
        HTTPException: If pose generation fails.
    """
    import uuid
    output_path = f"video_output_path/pose_{uuid.uuid4().hex}.mp4"
    
    generated_mp4_path = await pose_visualization_service.text_to_pose_mp4(
        text=text,
        output_path=output_path,
        width=256,
        height=256,
        fps=30
    )
    
    if not generated_mp4_path:
        raise HTTPException(500, "Failed to generate pose MP4")
    
    return FileResponse(generated_mp4_path)


@router.post("/generate-pose-file", tags=["Pose Generation"])
async def generate_pose_file(text: Annotated[str, Form()]) -> FileResponse:
    """
    Generate a pose file from text using ZurichNLP model.
    
    This endpoint creates a .pose file containing sign language pose data
    corresponding to the provided text.
    
    Args:
        text (str): The text to convert to sign language poses.
        
    Returns:
        FileResponse: The generated pose file as a downloadable response.
        
    Raises:
        HTTPException: If pose generation fails.
    """
    import uuid
    output_path = f"video_output_path/pose_{uuid.uuid4().hex}.pose"
    
    generated_pose_path = await pose_visualization_service.text_to_pose(
        text=text,
        output_path=output_path
    )
    
    if not generated_pose_path:
        raise HTTPException(500, "Failed to generate pose file")
    
    return FileResponse(generated_pose_path)