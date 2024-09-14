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

async def translate_sign_language_to_text(video: UploadFile) -> str:
    try:
        import mediapipe as mp
        from mediapipe.tasks import python
        from mediapipe.tasks.python import vision
    except:
        print("Failed to import mediapipe")
        raise HTTPException(500, "Server error. Please try again later. Please use the demo video input if you would like to AiSL in action.")
    full_file_path = save_file_to_local(video=video)

   
    #set up model
    model_path = os.path.join(os.path.dirname(__file__), 'gesture_recognizer.task')
    base_options = python.BaseOptions(model_asset_path=model_path)
 
  
    options = vision.GestureRecognizerOptions(base_options=base_options)

    recognizer = vision.GestureRecognizer.create_from_options(options=options)


    # Create a VideoCapture object
    cap = cv2.VideoCapture(full_file_path)

    captions={}
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        timestamp = cap.get(cv2.CAP_PROP_POS_MSEC)

        # Convert the frame to RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image)

        # Process the image and detect hands
        results = recognizer.recognize(mp_image)
        if len(results.gestures)>0:
            top_gesture = results.gestures[0][0]
            
            timestamp_time = str(datetime.timedelta(milliseconds=timestamp))
            if top_gesture.category_name:
                captions[timestamp_time]=top_gesture.category_name
                print("detected",top_gesture.category_name)
        
        

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    cap.release()

    
    # format captions
    processed_captions = process_timestamps(captions)
    processed_cleaned_captions = clean_repeated_words(processed_captions)
    processed_cleaned_captions_json = json.dumps(processed_cleaned_captions)
    print("formatted_captions",processed_cleaned_captions_json)
    
    return str(processed_cleaned_captions_json)


async def generate_text_to_speech(captions: str) -> str:
    """
    Returns the full file path to the audio file.
    """
    # Passing the text and language to the engine, here we have marked slow=False. Which tells 
    # the module that the converted audio should have a high speed
    gTTsObject = gTTS(text=captions, lang='en', slow=False)

    # Saving the converted audio in a mp3 file named
    file_name = str(uuid.uuid4())
    file_path = save_audio_to_local(gTTsObject, f"{file_name}.mp3")

    return file_path



async def generate_final_video(video: UploadFile, captions: str, speech_audio_file_path: str):

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
    # Load the video file
    temp_video_path = f"temp_videos/{file.filename}"

    with open(temp_video_path, "wb") as f:
        f.write(file.file.read())

    video = VideoFileClip(temp_video_path)
    video.audio.write_audiofile(audio_path)

    video.close()
    os.remove(temp_video_path)

async def extract_captions_from_video(audio_file) -> str:
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
    tokens = tokenize_text(captions)
    print(tokens)

    clips = []
    for token in tokens[3:5]:
        video_path = f'wlasl/{token}.mp4'
        if os.path.exists(video_path):
            clips.append(VideoFileClip(video_path))
    
    if clips:
        # Concatenate the clips into one video
        final_clip = concatenate_videoclips(clips, method="compose")
        output_path = f"video_output_path/{file.filename}-sign-version.mp4"
        final_clip.write_videofile(output_path)
        return output_path
    else:
        return None
  
