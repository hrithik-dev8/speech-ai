from pydantic import BaseModel
from typing import List, Optional

class PDFUpload(BaseModel):
    filename: str
    content_type: str
    size: int

class AudioRecording(BaseModel):
    filename: str
    duration: float

class EvaluationRequest(BaseModel):
    pdf_path: str
    audio_path: str

class MetricScore(BaseModel):
    name: str
    score: int
    feedback: str

class JudgeResponse(BaseModel):
    judge_name: str
    overall_score: float
    metrics: List[MetricScore]

class EvaluationResponse(BaseModel):
    delivery: JudgeResponse
    content: JudgeResponse
    questions: Optional[List[str]] = None