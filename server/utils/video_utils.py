"""
Video Utilities Module

This module provides utility functions for video processing operations.
It includes functions for reading video files and extracting frames
for further processing.

The module uses OpenCV for video operations and provides:
- Video file reading and frame extraction
- Frame-by-frame video processing capabilities

"""

import cv2

def read_video(video_path: str) -> list:
    """
    Reads a video file and extracts all frames as a list.
    
    This function uses OpenCV to read a video file and extract all frames
    into a list of numpy arrays. Each frame is stored as a separate array
    in the returned list.
    
    Args:
        video_path (str): The path to the video file to read.
        
    Returns:
        list: List of numpy arrays, where each array represents a video frame.
    """
    cap = cv2.VideoCapture(video_path)
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    return frames