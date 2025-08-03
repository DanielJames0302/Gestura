"""
File Handler Utility Module

This module provides utility functions for file operations in the Gestura application.
It handles saving, retrieving, and managing various file types including videos,
audio files, and generated content.

The module manages different directories:
- upload_directory: For temporary storage of uploaded files
- generated_directory: For storing generated content
- generated_audio_directory: For audio files
- generated_video_directory: For video files
- demo_directory: For demo files

"""

from fastapi import UploadFile
import os
import shutil
from gtts import gTTS # For text to speech conversion
import cv2

upload_directory = os.path.join(os.getcwd(), "uploads")
generated_directory = os.path.join(os.getcwd(), "generated-files")
generated_audio_directory = os.path.join(generated_directory, "audio")
generated_video_directory = os.path.join(generated_directory, "video")
demo_directory = os.path.join(os.getcwd(), "demo")

def save_file_to_local(video: UploadFile) -> str:
    """
    Saves an uploaded file to the local upload directory.
    
    This function creates the upload directory if it doesn't exist and
    saves the uploaded file with its original filename.
    
    Args:
        video (UploadFile): The uploaded file to save.
        
    Returns:
        str: The full file path where the file was saved.
    """
    # Create upload directory if it does not exist
    if not os.path.exists(upload_directory):
        os.makedirs(upload_directory)

    # Destination File Path
    file_path = os.path.join(upload_directory, video.filename)

    # Copy the file contents
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    return file_path

def save_audio_to_local(gttsObject: gTTS, file_name: str) -> str:
    """
    Saves a gTTS audio object to the local audio directory.
    
    This function creates the generated audio directory if it doesn't exist
    and saves the audio file with the specified filename.
    
    Args:
        gttsObject (gTTS): The gTTS object containing the audio data.
        file_name (str): The filename to save the audio as.
        
    Returns:
        str: The full file path where the audio file was saved.
    """
    # Create upload directory if it does not exist
    if not os.path.exists(generated_audio_directory):
        os.makedirs(generated_audio_directory)

    # Destination File Path
    file_path = os.path.join(generated_audio_directory, file_name)

    # Save
    gttsObject.save(file_path)
    return file_path

def retrieve_full_file_path_from_local(relative_file_path: str) -> str:
    """
    Constructs the full file path from a relative path in the upload directory.
    
    Args:
        relative_file_path (str): The relative file path within the upload directory.
        
    Returns:
        str: The full absolute file path.
    """
    file_path = os.path.join(upload_directory, relative_file_path)
    return file_path

def generate_captioned_video_filepath(full_file_path: str) -> str:
    """
    Generates a file path for a captioned video in the generated video directory.
    
    This function creates the generated video directory if it doesn't exist
    and constructs a path for the captioned video using the original filename.
    
    Args:
        full_file_path (str): The original video file path.
        
    Returns:
        str: The full file path for the captioned video.
    """
    # Create upload directory if it does not exist
    if not os.path.exists(generated_video_directory):
        os.makedirs(generated_video_directory)
    file_name = os.path.basename(full_file_path)

    # Destination File Path
    file_path = os.path.join(generated_video_directory, file_name)

    return file_path

def save_video(ouput_video_frames: list, output_video_path: str) -> str:
    """
    Saves a list of video frames as a video file.
    
    This function uses OpenCV to write video frames to a file with XVID codec
    at 24 FPS. The video dimensions are determined by the first frame.
    
    Args:
        ouput_video_frames (list): List of numpy arrays representing video frames.
        output_video_path (str): The path where the video should be saved.
        
    Returns:
        str: The path where the video was saved.
    """
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(output_video_path, fourcc, 24, (ouput_video_frames[0].shape[1], ouput_video_frames[0].shape[0]))
    for frame in ouput_video_frames:
        out.write(frame)
    out.release()
    print("output_video_path: ", output_video_path)
    return output_video_path