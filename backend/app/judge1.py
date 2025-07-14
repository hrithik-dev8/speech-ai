from .models import MetricScore, JudgeResponse
from .audio_analysis import analyze_audio, transcribe_audio
import re

def evaluate_delivery(audio_path: str) -> JudgeResponse:
    pause_freq, energy_var = analyze_audio(audio_path)
    transcript = transcribe_audio(audio_path)
    
    clarity = min(10, max(1, 10 - transcript.count(" ") / 100))
    fluency = evaluate_fluency(transcript, pause_freq)
    confidence = evaluate_confidence(energy_var, pause_freq)
    structure = evaluate_structure(transcript)
    
    metrics = [
        MetricScore(name="Clarity", score=int(clarity), feedback=f"Clarity score: {int(clarity)}/10"),
        MetricScore(name="Fluency", score=fluency, feedback=f"Fluency score: {fluency}/10"),
        MetricScore(name="Confidence", score=confidence, feedback=f"Confidence score: {confidence}/10"),
        MetricScore(name="Structure", score=structure, feedback=f"Structure score: {structure}/10")
    ]
    
    return JudgeResponse(
        judge_name="Delivery & Communication",
        overall_score=sum(m.score for m in metrics) / len(metrics),
        metrics=metrics
    )

def evaluate_fluency(transcript: str, pause_freq: float) -> int:
    filler_words = len(re.findall(r'\b(um|uh|ah|er|like)\b', transcript, re.IGNORECASE))
    return max(1, min(10, 10 - filler_words // 2 - int(pause_freq * 5)))

def evaluate_confidence(energy_var: float, pause_freq: float) -> int:
    return max(1, min(10, int(energy_var * 100) + (10 - int(pause_freq * 10)) // 2))

def evaluate_structure(transcript: str) -> int:
    transitions = len(re.findall(r'\b(first|next|then|finally|in conclusion)\b', transcript, re.IGNORECASE))
    return min(10, 5 + transitions)