"""
Pose Visualization Service

This service focuses on generating pose files from text and converting them
to visual formats (GIF/MP4) using the ZurichNLP model and pose-format library.

"""

import os
import tempfile
import subprocess
import json
from typing import Optional, Union
from fastapi import HTTPException
from utils.text_utils import validate_and_crop_text
from config.zurich_nlp_config import (
    LEXICON_PATH, SPOKEN_LANGUAGE, SIGNED_LANGUAGE, GLOSSER,
    MAX_TEXT_LENGTH, VERBOSE_LOGGING, TIMEOUT_SECONDS
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


class PoseVisualizationService:
    """
    Service for generating pose files and converting them to visual formats.
    
    This service uses the ZurichNLP model to generate pose files from text
    and then converts them to GIF or MP4 using the pose-format library.
    """
    
    def __init__(self):
        """Initialize the pose visualization service."""
        self.lexicon_path = LEXICON_PATH
        self.spoken_language = SPOKEN_LANGUAGE
        self.signed_language = SIGNED_LANGUAGE
        self.glosser = GLOSSER
        self.max_text_length = MAX_TEXT_LENGTH
        self.verbose_logging = VERBOSE_LOGGING
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
            # Validate and auto-crop text if necessary
            text, was_cropped = validate_and_crop_text(text, self.max_text_length, self.verbose_logging)
            
            if was_cropped and self.verbose_logging:
                print(f"Text was automatically cropped to fit the {self.max_text_length} character limit")
            
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
            
            if self.verbose_logging:
                print(f"Running pose generation command: {' '.join(cmd)}")
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                check=True,
                timeout=self.timeout_seconds
            )
            if self.verbose_logging:
                print(f"Pose generation output: {result.stdout}")
            
            if not os.path.exists(output_path):
                raise HTTPException(500, "Failed to generate pose file")
            
            return output_path
            
        except subprocess.TimeoutExpired as e:
            print(f"Pose generation timeout after {self.timeout_seconds} seconds: {e}")
            raise HTTPException(408, f"Pose generation timed out after {self.timeout_seconds} seconds")
        except subprocess.CalledProcessError as e:
            print(f"Pose generation error: {e}")
            print(f"Error output: {e.stderr}")
            raise HTTPException(500, f"Pose generation failed: {e.stderr}")
        except FileNotFoundError as e:
            print(f"ZurichNLP command not found: {e}")
            raise HTTPException(500, "ZurichNLP model not properly installed. Please run setup_zurich_nlp.py")
        except Exception as e:
            print(f"Unexpected error in pose generation: {e}")
            raise HTTPException(500, f"Pose generation failed: {str(e)}")
    
    async def pose_to_gif(
        self, 
        pose_path: str, 
        output_path: str,
        width: int = 256,
        height: int = 256
    ) -> str:
        """
        Convert pose file to GIF using pose-format library.
        
        Args:
            pose_path (str): Path to the input pose file.
            output_path (str): Path where the GIF will be saved.
            width (int): Width of the output GIF.
            height (int): Height of the output GIF.
        
        Returns:
            str: Path to the generated GIF file.
        """
        try:
            from pose_format import Pose
            from pose_format.pose_visualizer import PoseVisualizer
            
            # Read the pose file
            with open(pose_path, "rb") as f:
                p = Pose.read(f.read())
            
            # Resize to specified dimensions for visualization speed
            scale = p.header.dimensions.width / width
            p.header.dimensions.width = int(p.header.dimensions.width / scale)
            p.header.dimensions.height = int(p.header.dimensions.height / scale)
            p.body.data = p.body.data / scale
            
            # Generate GIF
            v = PoseVisualizer(p)
            v.save_gif(output_path, v.draw())
            
            if not os.path.exists(output_path):
                raise HTTPException(500, "Failed to generate GIF file")
            
            if self.verbose_logging:
                print(f"Successfully generated GIF: {output_path}")
            
            return output_path
            
        except ImportError as e:
            print(f"Failed to import pose-format: {e}")
            raise HTTPException(500, "pose-format library not installed. Please install it with: pip install pose-format")
        except Exception as e:
            print(f"Error generating GIF: {e}")
            raise HTTPException(500, f"GIF generation failed: {str(e)}")
    
    async def pose_to_mp4(
        self, 
        pose_path: str, 
        output_path: str,
        width: int = 256,
        height: int = 256,
        fps: int = 30
    ) -> str:
        """
        Convert pose file to MP4 using pose-format library.
        
        Args:
            pose_path (str): Path to the input pose file.
            output_path (str): Path where the MP4 will be saved.
            width (int): Width of the output MP4.
            height (int): Height of the output MP4.
            fps (int): Frames per second for the output MP4.
        
        Returns:
            str: Path to the generated MP4 file.
        """
        try:
            from pose_format import Pose
            from pose_format.pose_visualizer import PoseVisualizer
            import cv2
            import numpy as np
            
            # Read the pose file
            with open(pose_path, "rb") as f:
                p = Pose.read(f.read())
            
            # Resize to specified dimensions
            scale = p.header.dimensions.width / width
            p.header.dimensions.width = int(p.header.dimensions.width / scale)
            p.header.dimensions.height = int(p.header.dimensions.height / scale)
            p.body.data = p.body.data / scale
            
            # Generate frames
            v = PoseVisualizer(p)
            frames = v.draw()
            
            # Convert frames to MP4
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
            for frame in frames:
                # Convert PIL image to OpenCV format
                frame_cv = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
                out.write(frame_cv)
            
            out.release()
            
            if not os.path.exists(output_path):
                raise HTTPException(500, "Failed to generate MP4 file")
            
            if self.verbose_logging:
                print(f"Successfully generated MP4: {output_path}")
            
            return output_path
            
        except ImportError as e:
            print(f"Failed to import required libraries: {e}")
            raise HTTPException(500, "Required libraries not installed. Please install pose-format and opencv-python")
        except Exception as e:
            print(f"Error generating MP4: {e}")
            raise HTTPException(500, f"MP4 generation failed: {str(e)}")
    
    async def text_to_pose_gif(
        self, 
        text: str, 
        output_path: str,
        width: int = 256,
        height: int = 256,
        lexicon_path: Optional[str] = None
    ) -> str:
        """
        Convert text directly to pose GIF.
        
        Args:
            text (str): Input text to convert.
            output_path (str): Path where the GIF will be saved.
            width (int): Width of the output GIF.
            height (int): Height of the output GIF.
            lexicon_path (str, optional): Path to the lexicon file.
        
        Returns:
            str: Path to the generated GIF file.
        """
        # Create pose file in server directory instead of temp directory
        import uuid
        pose_filename = f"temp_pose_{uuid.uuid4().hex}.pose"
        pose_output_dir = os.path.join(os.getcwd(), "pose_output_path")
        os.makedirs(pose_output_dir, exist_ok=True)
        temp_pose_path = os.path.join(pose_output_dir, pose_filename)
        
        try:
            # Generate pose file
            await self.text_to_pose(text, temp_pose_path, lexicon_path)
            
            # Convert to GIF
            gif_path = await self.pose_to_gif(temp_pose_path, output_path, width, height)
            
            return gif_path
            
        finally:
            # Clean up temporary pose file
            if os.path.exists(temp_pose_path):
                os.unlink(temp_pose_path)
    
    async def text_to_pose_mp4(
        self, 
        text: str, 
        output_path: str,
        width: int = 256,
        height: int = 256,
        fps: int = 30,
        lexicon_path: Optional[str] = None
    ) -> str:
        """
        Convert text directly to pose MP4.
        
        Args:
            text (str): Input text to convert.
            output_path (str): Path where the MP4 will be saved.
            width (int): Width of the output MP4.
            height (int): Height of the output MP4.
            fps (int): Frames per second for the output MP4.
            lexicon_path (str, optional): Path to the lexicon file.
        
        Returns:
            str: Path to the generated MP4 file.
        """
        # Create pose file in server directory instead of temp directory
        import uuid
        pose_filename = f"temp_pose_{uuid.uuid4().hex}.pose"
        pose_output_dir = os.path.join(os.getcwd(), "pose_output_path")
        os.makedirs(pose_output_dir, exist_ok=True)
        temp_pose_path = os.path.join(pose_output_dir, pose_filename)
        
        try:
            # Generate pose file
            await self.text_to_pose(text, temp_pose_path, lexicon_path)
            
            # Convert to MP4
            mp4_path = await self.pose_to_mp4(temp_pose_path, output_path, width, height, fps)
            
            return mp4_path
            
        finally:
            # Clean up temporary pose file
            if os.path.exists(temp_pose_path):
                os.unlink(temp_pose_path)


# Global instance for easy access
pose_visualization_service = PoseVisualizationService()
