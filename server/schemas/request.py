"""
Request Schema Module

This module defines Pydantic models for request validation in the Gestura API.
It contains schemas for various request types including feature selection
for video processing operations.

The schemas include:
- Sign to speech feature selection
- Sign to emoji feature selection
- Combined request features schema

"""

from pydantic import BaseModel

class _SignToSpeechSchema(BaseModel):
    """
    Schema for sign-to-speech feature selection.
    
    This schema defines the structure for enabling or disabling
    the sign-to-speech feature in video processing requests.
    """
    selected: bool

class _SignToEmojiSchema(BaseModel):
    """
    Schema for sign-to-emoji feature selection.
    
    This schema defines the structure for enabling or disabling
    the sign-to-emoji feature in video processing requests.
    """
    selected: bool

class RequestFeaturesSchmea(BaseModel):
    """
    Schema for request features configuration.
    
    This schema combines multiple feature selection options
    for video processing requests, allowing clients to specify
    which features should be enabled or disabled.
    """
    sign_to_speech: _SignToSpeechSchema
    sign_to_emoji: _SignToEmojiSchema