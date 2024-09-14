from typing import Annotated
from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import FileResponse

from controllers.gestura_controller import GesturaController
from schemas.request import RequestFeaturesSchmea
from schemas.response import UploadVideoResponseSchema

import json

router = APIRouter()


@router.post("/upload", tags=["Gestura"], response_model=UploadVideoResponseSchema)
async def upload_video(file: UploadFile) -> dict[str, str]:
  print(file.filename)
  print(file.file)
  return await GesturaController.translate_sign_language_to_text(file=file)

@router.post("/upload-normal-video", tags=["Gestura"], response_model=UploadVideoResponseSchema)
async def upload_normal_video(file: UploadFile) -> dict[str,str]:
   print(file)
   return await GesturaController.extract_captions_from_video(file=file)


@router.post("/generate-asl", tags=["Gestura"])
async def generate_asl_video(file: UploadFile, captions: Annotated[str, Form()]) -> FileResponse:
   return await GesturaController.generate_sign_language_video(file=file, captions=captions)
   


@router.post("/generate", tags=["Gestura"])
async def generate_video(file: UploadFile, captions: Annotated[str, Form()]) -> FileResponse:
    # Parse `features` json
    print(file.filename)
    print(captions)
    
    return await GesturaController.generate_video(
        file=file,
        captions=captions
    )