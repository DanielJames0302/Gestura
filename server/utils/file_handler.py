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
    Saves File Locally.

    Returns:
        file_path: str
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

def save_audio_to_local(gttsObject: gTTS, file_name: str):
    # Create upload directory if it does not exist
    if not os.path.exists(generated_audio_directory):
        os.makedirs(generated_audio_directory)

    # Destination File Path
    file_path = os.path.join(generated_audio_directory, file_name)

    # Save
    gttsObject.save(file_path)
    return file_path

def retrieve_full_file_path_from_local(relative_file_path: str):
    file_path = os.path.join(upload_directory, relative_file_path)
    return file_path

def generate_captioned_video_filepath(full_file_path):
    # Create upload directory if it does not exist
    if not os.path.exists(generated_video_directory):
        os.makedirs(generated_video_directory)
    file_name = os.path.basename(full_file_path)

    # Destination File Path
    file_path = os.path.join(generated_video_directory, file_name)

    return file_path

def save_video(ouput_video_frames,output_video_path):
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(output_video_path, fourcc, 24, (ouput_video_frames[0].shape[1], ouput_video_frames[0].shape[0]))
    for frame in ouput_video_frames:
        out.write(frame)
    out.release()
    print("output_video_path: ", output_video_path)
    return output_video_path