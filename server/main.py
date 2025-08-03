"""
Gestura FastAPI Server

This module serves as the main entry point for the Gestura FastAPI application.
It sets up the FastAPI app with CORS middleware and includes the gestura routers.

The application provides APIs for:
- Sign language to text translation
- Video caption extraction
- Sign language video generation
- Text-to-speech video generation

"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers import gestura_routers

load_dotenv()

app = FastAPI(
    title="Gestura API",
    description="A FastAPI server for sign language translation and video processing",
    version="1.0.0"
)

# CORS
origins = [
  "http://localhost:3000",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gestura_routers.router)

@app.get("/")
def read_root():
    """
    Root endpoint that provides API documentation link.
    
    Returns:
        dict: A dictionary containing the API documentation URL.
    """
    return {"API Docs": "http://127.0.0.1:8000/docs#/"}