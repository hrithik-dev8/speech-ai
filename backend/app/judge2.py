from .models import MetricScore, JudgeResponse
from .pdf_processor import extract_text_from_pdf
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import OpenAI
from .config import settings
import logging

logger = logging.getLogger(__name__)

def evaluate_content(pdf_path: str, transcript: str) -> JudgeResponse:
    if not settings.OPENAI_API_KEY:
        raise ValueError("OpenAI API key not configured")

    try:
        pdf_text = extract_text_from_pdf(pdf_path)
        embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        docsearch = FAISS.from_texts([pdf_text], embeddings)
        
        llm = OpenAI(
            temperature=0,
            openai_api_key=settings.OPENAI_API_KEY,
            max_tokens=500
        )
        
        coverage = evaluate_metric("coverage", transcript, pdf_text, llm)
        relevance = evaluate_metric("relevance", transcript, pdf_text, llm)
        accuracy = evaluate_metric("accuracy", transcript, pdf_text, llm)
        depth = evaluate_metric("depth", transcript, pdf_text, llm)
        
        metrics = [
            MetricScore(name="Coverage", score=coverage, feedback=f"Coverage score: {coverage}/10"),
            MetricScore(name="Relevance", score=relevance, feedback=f"Relevance score: {relevance}/10"),
            MetricScore(name="Accuracy", score=accuracy, feedback=f"Accuracy score: {accuracy}/10"),
            MetricScore(name="Depth", score=depth, feedback=f"Depth score: {depth}/10")
        ]
        
        return JudgeResponse(
            judge_name="Content Coverage & Relevance",
            overall_score=sum(m.score for m in metrics) / len(metrics),
            metrics=metrics
        )
    except Exception as e:
        logger.error(f"Content evaluation failed: {e}")
        raise

def evaluate_metric(metric: str, transcript: str, reference: str, llm) -> int:
    prompt = f"""
    Evaluate the {metric} of this speech transcript compared to the reference material.
    Reference: {reference[:2000]}
    Transcript: {transcript[:2000]}
    
    Score from 1-10 where 1 is poor and 10 is excellent.
    Respond only with the number.
    """
    try:
        response = llm(prompt)
        return min(10, max(1, int(response.strip())))
    except:
        return 5