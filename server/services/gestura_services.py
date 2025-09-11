"""
Gestura Services Module

This module contains the core business logic for sign language translation and
video processing operations. It provides services for:
- Sign language to text translation using MediaPipe
- Text-to-speech generation
- Video processing and caption overlay
- Audio extraction from videos
- Speech recognition for caption extraction
- Sign language video generation

The module uses various technologies including:
- MediaPipe for gesture recognition
- OpenCV for video processing
- Google Text-to-Speech (gTTS) for audio synthesis
- SpeechRecognition for audio-to-text conversion
- MoviePy for video editing

"""

from fastapi import UploadFile
from utils.file_handler import save_file_to_local, retrieve_full_file_path_from_local, save_audio_to_local,generate_captioned_video_filepath, save_video
from utils.caption_formatting import process_timestamps , clean_repeated_words
from gtts import gTTS # For text to speech conversion
import uuid
import cv2
import datetime
import json
from fastapi import HTTPException
from utils.video_utils import read_video
from moviepy.editor import VideoFileClip
import speech_recognition as sr
from utils.tokenize_text import tokenize_text
from moviepy.editor import VideoFileClip, concatenate_videoclips
import os
from .pose_visualization_service import pose_visualization_service

async def translate_sign_language_to_text(video: UploadFile) -> str:
    """
    Translates sign language gestures from a video file to text captions.
    
    This function uses MediaPipe's gesture recognition model to detect and
    translate sign language gestures in video frames. It processes the video
    frame by frame, detects gestures, and formats the results into captions.
    
    Args:
        video (UploadFile): The video file containing sign language content.
        
    Returns:
        str: JSON string containing formatted captions with timestamps.
            Format: {"timestamp": "gesture_text", ...}
            
    Raises:
        HTTPException: If MediaPipe import fails or processing fails.
    """
    try:
        print("Starting sign language translation process...")
        print(f"Video filename: {video.filename}")
        print(f"Video content type: {video.content_type}")
        
        import mediapipe as mp
        from mediapipe.tasks import python
        from mediapipe.tasks.python import vision
        print(f"MediaPipe version: {mp.__version__}")
    except ImportError as e:
        print(f"Failed to import mediapipe: {e}")
        print("This is likely due to protobuf version compatibility issues.")
        print("Please run: python fix_mediapipe.py")
        raise HTTPException(500, "MediaPipe not properly installed. Please run fix_mediapipe.py to resolve compatibility issues.")
    except Exception as e:
        print(f"Unexpected error importing mediapipe: {e}")
        raise HTTPException(500, "Server error. Please try again later. Please use the demo video input if you would like to AiSL in action.")
    
    try:
        print("Saving video file to local storage...")
        full_file_path = save_file_to_local(video=video)
        print(f"Video saved to: {full_file_path}")
    except Exception as e:
        print(f"Error saving video file: {e}")
        raise HTTPException(500, f"Failed to save video file: {str(e)}")

    try:
        #set up model
        print("Loading gesture recognition model...")
        model_path = os.path.join(os.path.dirname(__file__), 'gesture_recognizer_9.task')
        print(f"Model path: {model_path}")
        
        if not os.path.exists(model_path):
            print(f"ERROR: Model file not found at {model_path}")
            raise HTTPException(500, "Gesture recognition model not found!")
        
        base_options = python.BaseOptions(model_asset_path=model_path)
        options = vision.GestureRecognizerOptions(base_options=base_options)
        recognizer = vision.GestureRecognizer.create_from_options(options=options)
        print("Model loaded successfully")

        # Create a VideoCapture object
        print("Opening video file...")
        cap = cv2.VideoCapture(full_file_path)
        
        if not cap.isOpened():
            print("ERROR: Could not open video file")
            raise HTTPException(500, "Could not open video file for processing!")

        print("Video opened successfully, processing frames...")
        captions={}
        frame_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_count += 1
            timestamp = cap.get(cv2.CAP_PROP_POS_MSEC)

            # Convert the frame to RGB
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image)

            # Process the image and detect hands
            try:
                results = recognizer.recognize(mp_image)
                if len(results.gestures)>0:
                    top_gesture = results.gestures[0][0]
                    
                    timestamp_time = str(datetime.timedelta(milliseconds=timestamp))
                    if top_gesture.category_name:
                        captions[timestamp_time]=top_gesture.category_name
                        print(f"Frame {frame_count}: detected {top_gesture.category_name}")
            except Exception as e:
                print(f"Error processing frame {frame_count}: {e}")
                continue

            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            
        cap.release()
        print(f"Processed {frame_count} frames")
        print(f"Total gestures detected: {len(captions)}")

        if not captions:
            print("WARNING: No gestures detected in the video")
            return json.dumps({"0:00:00": "No gestures detected"})
        
        # format captions
        print("Formatting captions...")
        processed_captions = process_timestamps(captions)
        processed_cleaned_captions = clean_repeated_words(processed_captions)
        processed_cleaned_captions_json = json.dumps(processed_cleaned_captions)
        print("formatted_captions",processed_cleaned_captions_json)
        
        return str(processed_cleaned_captions_json)
        
    except HTTPException as e:
        print(f"HTTPException in video processing: {e.detail}")
        raise e
    except Exception as e:
        print(f"Unexpected error in video processing: {e}")
        print(f"Error type: {type(e).__name__}")
        raise HTTPException(500, f"Error processing video: {str(e)}")


async def generate_text_to_speech(captions: str) -> str:
    """
    Generates speech audio from text captions using Google Text-to-Speech.
    
    This function converts text captions into speech audio using the gTTS
    (Google Text-to-Speech) library and saves the audio to a local file.
    
    Args:
        captions (str): The text captions to convert to speech.
        
    Returns:
        str: The full file path to the generated audio file.
    """
    # Passing the text and language to the engine, here we have marked slow=False. Which tells 
    # the module that the converted audio should have a high speed
    gTTsObject = gTTS(text=captions, lang='en', slow=False)

    # Saving the converted audio in a mp3 file named
    file_name = str(uuid.uuid4())
    file_path = save_audio_to_local(gTTsObject, f"{file_name}.mp3")

    return file_path



async def generate_final_video(video: UploadFile, captions: str, speech_audio_file_path: str):
    """
    Generates a final video with captions overlaid on the original video.
    
    This function creates a new video file that combines the original video
    with text captions overlaid at the bottom. The captions are positioned
    and formatted for optimal readability.
    
    Args:
        video (UploadFile): The original video file to process.
        captions (str): JSON string containing captions with timestamps.
        speech_audio_file_path (str): Path to the speech audio file (currently unused).
        
    Returns:
        str: The file path to the generated video with captions.
    """
    # Edit the Video
    full_file_path = save_file_to_local(video=video)
    video_path = full_file_path
    output_path = generate_captioned_video_filepath(full_file_path)
    cap = cv2.VideoCapture(video_path)



    # Get the frame rate and frame size of the video
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Define the codec and create VideoWriter object
    
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))
    frame_count=0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_count+=1
        current_time = frame_count / fps
        timestamp_str = '0'+str(datetime.timedelta(seconds=int(current_time)))
        
        processed_cleaned_captions = json.loads(captions)
        
        if timestamp_str in processed_cleaned_captions.keys():
                text=processed_cleaned_captions[timestamp_str]
                # Get the text size
                font = cv2.FONT_HERSHEY_PLAIN
                font_scale = 2
                thickness = 2
                text_size, _ = cv2.getTextSize(text, font, font_scale, thickness)
                text_width, text_height = text_size

                # Calculate the position to center the text at the bottom
                x = (frame_width - text_width) // 2
                y = frame_height - 30  # 30 pixels from the bottom
                cv2.putText(frame, text, (x, y), font, font_scale, (255, 255, 255), thickness, cv2.LINE_AA)
                out.write(frame)
      
     

    cap.release()
    out.release()
    print(f"completed writing to {output_path}")

    if speech_audio_file_path:
        # TODO: Add Audio to video
        pass

    # Return generated video file path
    generated_video_file_path = output_path
    return output_path

def extract_audio_from_video(file, audio_path):
    """
    Extracts audio from a video file and saves it as a WAV file.
    
    This function temporarily saves the uploaded video file, extracts its
    audio track using MoviePy, and saves the audio to the specified path.
    
    Args:
        file: The uploaded video file.
        audio_path (str): The path where the extracted audio should be saved.
    """
    # Load the video file
    temp_video_path = f"temp_videos/{file.filename}"

    with open(temp_video_path, "wb") as f:
        f.write(file.file.read())

    video = VideoFileClip(temp_video_path)
    video.audio.write_audiofile(audio_path)

    video.close()
    os.remove(temp_video_path)

async def extract_captions_from_video(audio_file) -> str:
    """
    Extracts text captions from an audio file using speech recognition.
    
    This function uses Google's Speech Recognition API to convert speech
    in an audio file to text captions.
    
    Args:
        audio_file (str): Path to the audio file to process.
        
    Returns:
        str: The extracted text captions from the audio.
        
    Note:
        Returns None if speech recognition fails or cannot understand the audio.
    """
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio_data = recognizer.record(source)
    try:
        text =  recognizer.recognize_google(audio_data)
        return text
    except sr.UnknownValueError:
        print("Speech Recognition could not understand the audio")
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")


async def generate_sign_language_video(file, captions):
    """
    Generates a sign language pose video from text captions using ZurichNLP model.
    
    This function uses the ZurichNLP spoken-to-signed translation model to convert
    text captions into pose-based sign language videos (GIF or MP4).
    
    Args:
        file: The base video file (used for naming the output file).
        captions (str): The text captions to convert to sign language.
        
    Returns:
        str: The file path to the generated sign language video, or None if
             generation fails.
    """
    # Parse captions if it's a JSON string, otherwise use as plain text
    try:
        captions_data = json.loads(captions)
        # Extract text from JSON captions (assuming it's a dict with timestamp: text format)
        if isinstance(captions_data, dict):
            # Join all caption texts into a single string
            caption_text = " ".join(captions_data.values())
        else:
            caption_text = captions
    except (json.JSONDecodeError, AttributeError):
        # If it's not JSON, use as plain text
        caption_text = captions
    
    print("Processing captions with ZurichNLP pose model:", caption_text)
    
    try:
        # Generate output path for MP4
        output_path = f"video_output_path/{file.filename}-sign-version.mp4"
        
        # Use pose visualization service to generate sign language video
        generated_video_path = await pose_visualization_service.text_to_pose_mp4(
            text=caption_text,
            output_path=output_path,
            width=256,
            height=256,
            fps=30
        )
        
        if generated_video_path and os.path.exists(generated_video_path):
            print(f"Successfully generated sign language pose video: {generated_video_path}")
            return generated_video_path
        else:
            print("Failed to generate sign language pose video")
            return None
            
    except Exception as e:
        print(f"Error generating sign language pose video: {e}")
        # Fallback to the original method if pose generation fails
        print("Falling back to original video concatenation method...")
        return await generate_sign_language_video_fallback(file, captions)


async def generate_sign_language_video_fallback(file, captions):
    """
    Fallback method for generating sign language video using the original approach.
    
    This function uses the original token-based video concatenation method as a
    fallback when the ZurichNLP model is not available or fails.
    
    Args:
        file: The base video file (used for naming the output file).
        captions (str): The text captions to convert to sign language.
        
    Returns:
        str: The file path to the generated sign language video, or None if
             no matching sign language clips are found.
    """
    # Parse captions if it's a JSON string, otherwise use as plain text
    try:
        captions_data = json.loads(captions)
        # Extract text from JSON captions (assuming it's a dict with timestamp: text format)
        if isinstance(captions_data, dict):
            # Join all caption texts into a single string
            caption_text = " ".join(captions_data.values())
        else:
            caption_text = captions
    except (json.JSONDecodeError, AttributeError):
        # If it's not JSON, use as plain text
        caption_text = captions
    
    print("Processing captions with fallback method:", caption_text)
    tokens = tokenize_text(caption_text)
    print("Tokenized text:", tokens)

    clips = []
    try:
        for token in tokens[3:20]:  # Limit to first 17 tokens to avoid too long videos
            video_path = f'wlasl/{token}.mp4'
            if os.path.exists(video_path):
                clips.append(VideoFileClip(video_path))
        
        if clips:
            # Concatenate the clips into one video
            final_clip = concatenate_videoclips(clips, method="compose")
            output_path = f"video_output_path/{file.filename}-sign-version.mp4"
            final_clip.write_videofile(output_path)
            
            # Clean up individual clips
            for clip in clips:
                clip.close()
            
            return output_path
        else:
            print("No matching sign language clips found for tokens:", tokens)
            return None
    except Exception as e:
        print(f"Error generating sign language video with fallback method: {e}")
        # Clean up clips if there was an error
        for clip in clips:
            try:
                clip.close()
            except:
                pass
        return None
  
