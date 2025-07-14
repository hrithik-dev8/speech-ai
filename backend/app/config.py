import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class Settings:
    UPLOAD_FOLDER = Path("static/uploads")
    AUDIO_FOLDER = Path("static/audio")
    ALLOWED_EXTENSIONS = {'pdf'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
    AUDIO_FOLDER.mkdir(parents=True, exist_ok=True)

settings = Settings()