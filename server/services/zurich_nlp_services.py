"""
ZurichNLP Spoken-to-Signed Translation Services Module

This module provides integration with the ZurichNLP spoken-to-signed translation
model for generating sign language videos from text. It uses the pose-based
approach to create more realistic and accurate sign language videos.

The module provides services for:
- Text to pose generation using ZurichNLP models
- Pose to video conversion using pose-to-video models
- End-to-end text to sign language video generation

"""

import os
import tempfile
import subprocess
import json
from typing import Optional
from fastapi import HTTPException
from fastapi import UploadFile
from utils.text_utils import validate_and_crop_text
from config.zurich_nlp_config import (
    LEXICON_PATH, SPOKEN_LANGUAGE, SIGNED_LANGUAGE, GLOSSER,
    MAX_TEXT_LENGTH, ENABLE_FALLBACK, VERBOSE_LOGGING,
    RETRY_ATTEMPTS, TIMEOUT_SECONDS
)

# Simple English to German translation for dummy lexicon
ENGLISH_TO_GERMAN_MAPPING = {
    "hello": "hallo",
    "how": "wie",
    "are": "sind",
    "you": "du",
    "good": "gut",
    "morning": "morgen",
    "evening": "abend",
    "night": "nacht",
    "day": "tag",
    "week": "woche",
    "month": "monat",
    "year": "jahr",
    "time": "zeit",
    "today": "heute",
    "tomorrow": "morgen",
    "yesterday": "gestern",
    "now": "jetzt",
    "here": "hier",
    "there": "dort",
    "this": "dies",
    "that": "das",
    "yes": "ja",
    "no": "nein",
    "please": "bitte",
    "thank": "danke",
    "you": "du",
    "me": "mich",
    "my": "mein",
    "your": "dein",
    "our": "unser",
    "their": "ihr",
    "the": "der",
    "a": "ein",
    "an": "ein",
    "and": "und",
    "or": "oder",
    "but": "aber",
    "with": "mit",
    "without": "ohne",
    "for": "für",
    "from": "von",
    "to": "zu",
    "in": "in",
    "on": "auf",
    "at": "bei",
    "by": "durch",
    "is": "ist",
    "are": "sind",
    "was": "war",
    "were": "waren",
    "be": "sein",
    "have": "haben",
    "has": "hat",
    "had": "hatte",
    "do": "tun",
    "does": "tut",
    "did": "tat",
    "will": "werden",
    "would": "würde",
    "can": "kann",
    "could": "könnte",
    "should": "sollte",
    "must": "muss",
    "may": "darf",
    "might": "könnte",
    "talk": "sprechen",
    "about": "über",
    "daily": "täglich",
    "routines": "routinen",
    "routine": "routine",
    "my": "mein",
    "small": "kleine",
    "children": "kinder",
    "eat": "essen",
    "pizza": "pizza"
}


class ZurichNLPService:
    """
    Service class for ZurichNLP spoken-to-signed translation functionality.
    
    This class provides methods to convert text to sign language videos using
    the ZurichNLP model pipeline: text -> gloss -> pose -> video.
    """
    
    def __init__(self):
        """Initialize the ZurichNLP service with configurations from config file."""
        self.lexicon_path = LEXICON_PATH
        self.spoken_language = SPOKEN_LANGUAGE
        self.signed_language = SIGNED_LANGUAGE
        self.glosser = GLOSSER
        self.max_text_length = MAX_TEXT_LENGTH
        self.enable_fallback = ENABLE_FALLBACK
        self.verbose_logging = VERBOSE_LOGGING
        self.retry_attempts = RETRY_ATTEMPTS
        self.timeout_seconds = TIMEOUT_SECONDS
    
    def translate_english_to_german(self, text: str) -> str:
        """
        Simple English to German translation for dummy lexicon compatibility.
        
        Args:
            text (str): English text to translate
            
        Returns:
            str: German text (or original if no translation available)
        """
        words = text.lower().split()
        translated_words = []
        
        for word in words:
            # Remove punctuation for lookup
            clean_word = word.strip('.,!?;:')
            if clean_word in ENGLISH_TO_GERMAN_MAPPING:
                translated_words.append(ENGLISH_TO_GERMAN_MAPPING[clean_word])
            else:
                # Keep original word if no translation available
                translated_words.append(clean_word)
        
        return ' '.join(translated_words)
        
    async def text_to_sign_video(
        self, 
        text: str, 
        output_path: str,
        lexicon_path: Optional[str] = None
    ) -> str:
        """
        Convert text to sign language video using ZurichNLP model.
        
        This method uses the complete pipeline:
        1. Text -> Gloss conversion
        2. Gloss -> Pose generation
        3. Pose -> Video synthesis
        
        Args:
            text (str): The input text to convert to sign language.
            output_path (str): Path where the output video will be saved.
            lexicon_path (str, optional): Path to the lexicon file. 
                                        Uses default if not provided.
        
        Returns:
            str: Path to the generated sign language video.
            
        Raises:
            HTTPException: If the conversion process fails.
        """
        try:
            # Validate and auto-crop text if necessary
            text, was_cropped = validate_and_crop_text(text, self.max_text_length, self.verbose_logging)
            
            if was_cropped and self.verbose_logging:
                print(f"Text was automatically cropped to fit the {self.max_text_length} character limit")
            
            # Use provided lexicon or default
            lexicon = lexicon_path or self.lexicon_path
            
            # Check if we're using dummy lexicon and need to translate to German
            if "dummy_lexicon" in lexicon and self.spoken_language == "de":
                # Translate English text to German for dummy lexicon
                original_text = text
                text = self.translate_english_to_german(text)
                if self.verbose_logging and original_text != text:
                    print(f"Translated English to German for dummy lexicon:")
                    print(f"Original: {original_text}")
                    print(f"Translated: {text}")
            
            if self.verbose_logging:
                print(f"ZurichNLP: Converting text to sign language video")
                print(f"Text: {text[:100]}{'...' if len(text) > 100 else ''}")
                print(f"Output path: {output_path}")
                print(f"Lexicon: {lexicon}")
                print(f"Languages: {self.spoken_language} -> {self.signed_language}")
            
            # Create temporary pose file
            with tempfile.NamedTemporaryFile(suffix=".pose", delete=False) as temp_pose:
                temp_pose_path = temp_pose.name
            
            # Step 1: Text to Gloss to Pose
            pose_cmd = [
                "text_to_gloss_to_pose",
                "--text", text,
                "--glosser", self.glosser,
                "--lexicon", lexicon,
                "--spoken-language", self.spoken_language,
                "--signed-language", self.signed_language,
                "--pose", temp_pose_path
            ]
            
            if self.verbose_logging:
                print(f"Running pose generation command: {' '.join(pose_cmd)}")
            
            result = subprocess.run(
                pose_cmd, 
                capture_output=True, 
                text=True, 
                check=True,
                timeout=self.timeout_seconds
            )
            if self.verbose_logging:
                print(f"Pose generation output: {result.stdout}")
            
            # Step 2: Pose to Video
            video_cmd = [
                "text_to_gloss_to_pose_to_video",
                "--text", text,
                "--glosser", self.glosser,
                "--lexicon", lexicon,
                "--spoken-language", self.spoken_language,
                "--signed-language", self.signed_language,
                "--video", output_path
            ]
            
            if self.verbose_logging:
                print(f"Running video generation command: {' '.join(video_cmd)}")
            
            result = subprocess.run(
                video_cmd, 
                capture_output=True, 
                text=True, 
                check=True,
                timeout=self.timeout_seconds
            )
            if self.verbose_logging:
                print(f"Video generation output: {result.stdout}")
            
            # Clean up temporary pose file
            if os.path.exists(temp_pose_path):
                os.unlink(temp_pose_path)
            
            # Verify output file was created
            if not os.path.exists(output_path):
                raise HTTPException(500, "Failed to generate sign language video")
            
            return output_path
            
        except subprocess.TimeoutExpired as e:
            print(f"ZurichNLP process timeout after {self.timeout_seconds} seconds: {e}")
            raise HTTPException(408, f"Sign language video generation timed out after {self.timeout_seconds} seconds")
        except subprocess.CalledProcessError as e:
            print(f"ZurichNLP process error: {e}")
            print(f"Error output: {e.stderr}")
            raise HTTPException(500, f"ZurichNLP model processing failed: {e.stderr}")
        except FileNotFoundError as e:
            print(f"ZurichNLP command not found: {e}")
            raise HTTPException(500, "ZurichNLP model not properly installed. Please run setup_zurich_nlp.py")
        except Exception as e:
            print(f"Unexpected error in ZurichNLP service: {e}")
            raise HTTPException(500, f"Sign language video generation failed: {str(e)}")
    
    async def text_to_pose(
        self, 
        text: str, 
        output_path: str,
        lexicon_path: Optional[str] = None
    ) -> str:
        """
        Convert text to pose file using ZurichNLP model.
        
        Args:
            text (str): The input text to convert to pose.
            output_path (str): Path where the pose file will be saved.
            lexicon_path (str, optional): Path to the lexicon file.
        
        Returns:
            str: Path to the generated pose file.
        """
        try:
            lexicon = lexicon_path or self.lexicon_path
            
            # Check if we're using dummy lexicon and need to translate to German
            if "dummy_lexicon" in lexicon and self.spoken_language == "de":
                # Translate English text to German for dummy lexicon
                original_text = text
                text = self.translate_english_to_german(text)
                if self.verbose_logging and original_text != text:
                    print(f"Translated English to German for dummy lexicon:")
                    print(f"Original: {original_text}")
                    print(f"Translated: {text}")
            
            cmd = [
                "text_to_gloss_to_pose",
                "--text", text,
                "--glosser", self.glosser,
                "--lexicon", lexicon,
                "--spoken-language", self.spoken_language,
                "--signed-language", self.signed_language,
                "--pose", output_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            print(f"Pose generation output: {result.stdout}")
            
            if not os.path.exists(output_path):
                raise HTTPException(500, "Failed to generate pose file")
            
            return output_path
            
        except subprocess.CalledProcessError as e:
            print(f"Pose generation error: {e}")
            print(f"Error output: {e.stderr}")
            raise HTTPException(500, f"Pose generation failed: {e.stderr}")
        except Exception as e:
            print(f"Unexpected error in pose generation: {e}")
            raise HTTPException(500, f"Pose generation failed: {str(e)}")
    
    def set_language_config(self, spoken_lang: str, signed_lang: str):
        """
        Set the language configuration for the model.
        
        Args:
            spoken_lang (str): The spoken language code (e.g., 'en', 'de').
            signed_lang (str): The signed language code (e.g., 'sgg', 'asl').
        """
        self.spoken_language = spoken_lang
        self.signed_language = signed_lang
    
    def set_lexicon_path(self, lexicon_path: str):
        """
        Set the lexicon path for the model.
        
        Args:
            lexicon_path (str): Path to the lexicon directory.
        """
        self.lexicon_path = lexicon_path


# Global instance for easy access
zurich_nlp_service = ZurichNLPService()
