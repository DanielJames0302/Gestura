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


@router.post("/generate", tags=["AiSL"])
async def generate_video(file: UploadFile, captions: Annotated[str, Form()], features: Annotated[str, Form()]) -> FileResponse:
    # Parse `features` json
    features_json = json.loads(features)
    features: RequestFeaturesSchmea =  RequestFeaturesSchmea(
        sign_to_emoji=features_json["sign_to_emoji"],
        sign_to_speech=features_json["sign_to_speech"]
    )
    
    print(file.filename)
    print(captions)
    print(features)
    
    return await GesturaController.generate_video(
        file=file,
        captions=captions,
        features=features
    )