import librosa
import numpy as np
from typing import Tuple
from .config import settings
import logging

logger = logging.getLogger(__name__)

def analyze_audio(audio_path: str) -> Tuple[float, float]:
    try:
        y, sr = librosa.load(audio_path, sr=None)
        duration = librosa.get_duration(y=y, sr=sr)
        if duration == 0:
            return 0, 0
        
        intervals = librosa.effects.split(y, top_db=20)
        pause_count = len(intervals) - 1
        pause_frequency = pause_count / duration
        
        rms = librosa.feature.rms(y=y)[0]
        energy_variance = np.var(rms)
        
        return pause_frequency, energy_variance
    except Exception as e:
        logger.error(f"Audio analysis failed: {e}")
        return 0, 0

def transcribe_audio(audio_path: str) -> str:
    try:
        import whisper
        model = whisper.load_model("base")
        result = model.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        import traceback
        logger.error(f"Transcription failed: {e}\n{traceback.format_exc()}")
        return ""
