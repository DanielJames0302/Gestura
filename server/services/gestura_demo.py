"""
Gestura Demo Services Module

This module provides demo functionality for the Gestura application.
It contains mock implementations that simulate the behavior of the main
services for demonstration and testing purposes.

The demo services include:
- Mock sign language translation with predefined captions
- Demo video generation with different feature combinations
- Simulated processing delays to mimic real-world scenarios

"""

from fastapi import UploadFile
from utils.file_handler import demo_directory

import os
import time

async def get_demo_input_video() -> str:
    """
    Retrieves the demo input video file path.
    
    This function simulates a delay and returns the path to a predefined
    demo video file for testing purposes.
    
    Returns:
        str: The file path to the demo input video.
    """
    time.sleep(5)
    file_path = os.path.join(demo_directory, "aisl-demo-input.mp4")
    return file_path

async def translate_sign_language_to_text_demo(video: UploadFile) -> str:
    """
    Provides mock sign language translation for demo purposes.
    
    This function returns predefined captions that simulate the output
    of a sign language translation service. It's used for demonstration
    and testing without requiring actual gesture recognition processing.
    
    Args:
        video (UploadFile): The uploaded video file (unused in demo mode).
        
    Returns:
        str: JSON string containing predefined demo captions with timestamps.
            Format: {"timestamp": "demo_text", ...}
    """
    processed_cleaned_captions_json = '{"00:00:00": "I", "00:00:01-00:00:02": "eat", "00:00:03-00:00:04": "apple","00:00:05":"before","00:00:06":"bed"}'
    return processed_cleaned_captions_json

async def generate_video_demo(speech: bool, emoji: bool) -> str:
    """
    Generates a demo video file based on feature flags.
    
    This function simulates video generation with different feature combinations
    (speech and emoji). It returns the path to a predefined demo video file
    that corresponds to the requested features.
    
    Args:
        speech (bool): Whether to include speech audio in the demo video.
        emoji (bool): Whether to include emoji overlays in the demo video.
        
    Returns:
        str: The file path to the appropriate demo video file based on features.
    """
    time.sleep(10)
    file_name = ""
    if speech and emoji:
        file_name = "aisl-demo-output-captions-speech-emoji.mp4"
    elif speech:
        file_name = "aisl-demo-output-captions-speech.mp4"
    elif emoji:
        file_name = "aisl-demo-output-captions-emoji.mp4"
    else:
        file_name = "aisl-demo-output-captions.mp4"
    
    file_path = os.path.join(demo_directory, file_name)
    return file_path