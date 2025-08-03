"""
Response Schema Module

This module defines Pydantic models for response validation in the Gestura API.
It contains schemas for various response types including video upload responses
and caption extraction results.

The schemas include:
- Upload video response schema with captions

"""

from pydantic import BaseModel

class UploadVideoResponseSchema(BaseModel):
    """
    Schema for video upload response.
    
    This schema defines the structure for responses to video upload requests,
    including the extracted or translated captions from the uploaded video.
    """
    captions: str