from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers import gestura_routers

load_dotenv()

app = FastAPI()

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
    return {"API Docs": "http://127.0.0.1:8000/docs#/"}