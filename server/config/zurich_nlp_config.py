"""
Configuration file for ZurichNLP spoken-to-signed translation model.

This file contains configuration settings for the ZurichNLP model integration,
including language settings, model paths, and other parameters.

"""

import os
from pathlib import Path

# Base paths
SERVER_DIR = Path(__file__).parent.parent
ZURICH_NLP_DIR = SERVER_DIR / "spoken-to-signed-translation"

# Language configuration
DEFAULT_SPOKEN_LANGUAGE = "de"  # German (required for dummy lexicon)
DEFAULT_SIGNED_LANGUAGE = "sgg"  # Swiss German Sign Language

# Alternative language options
# Note: Dummy lexicon only supports German (de) -> Swiss German Sign Language (sgg)
SUPPORTED_LANGUAGES = {
    "de": "German (supported by dummy lexicon)",
    "en": "English (requires full lexicon)",
    "fr": "French (requires full lexicon)",
    "es": "Spanish (requires full lexicon)"
}

SUPPORTED_SIGN_LANGUAGES = {
    "sgg": "Swiss German Sign Language (supported by dummy lexicon)",
    "asl": "American Sign Language (requires full lexicon)",
    "bsl": "British Sign Language (requires full lexicon)"
}

# Lexicon configuration
DEFAULT_LEXICON_PATH = ZURICH_NLP_DIR / "assets" / "dummy_lexicon"
FULL_LEXICON_PATH = SERVER_DIR / "lexicon"

# Model configuration
DEFAULT_GLOSSER = "simple"
POSE_TO_VIDEO_MODEL = "pix_to_pix"

# Output configuration
DEFAULT_OUTPUT_DIR = SERVER_DIR / "video_output_path"
DEFAULT_POSE_DIR = SERVER_DIR / "pose_output_path"

# Ensure output directories exist
DEFAULT_OUTPUT_DIR.mkdir(exist_ok=True)
DEFAULT_POSE_DIR.mkdir(exist_ok=True)

# Environment variables (can be overridden)
LEXICON_PATH = os.getenv("ZURICH_NLP_LEXICON_PATH", str(DEFAULT_LEXICON_PATH))
SPOKEN_LANGUAGE = os.getenv("ZURICH_NLP_SPOKEN_LANGUAGE", DEFAULT_SPOKEN_LANGUAGE)
SIGNED_LANGUAGE = os.getenv("ZURICH_NLP_SIGNED_LANGUAGE", DEFAULT_SIGNED_LANGUAGE)
GLOSSER = os.getenv("ZURICH_NLP_GLOSSER", DEFAULT_GLOSSER)

# Model performance settings
MAX_TEXT_LENGTH = 500  # Maximum characters for text input
ENABLE_FALLBACK = True  # Enable fallback to original method if ZurichNLP fails
VERBOSE_LOGGING = True  # Enable detailed logging

# Video generation settings
VIDEO_QUALITY = "medium"  # low, medium, high
VIDEO_FPS = 30
VIDEO_RESOLUTION = (256, 256)  # Width, Height

# Error handling
RETRY_ATTEMPTS = 3
TIMEOUT_SECONDS = 300  # 5 minutes timeout for video generation
