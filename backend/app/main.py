from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .models import EvaluationResponse
from .judge1 import evaluate_delivery
from .judge2 import evaluate_content
from .audio_analysis import transcribe_audio
from .config import settings
import os
from pathlib import Path
import uuid
import logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Speech Evaluation App",
    description="AI-powered speech evaluation with two virtual judges",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None
)

from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path

@app.get("/")
async def root():
    return JSONResponse(content={"message": "Welcome to the Speech Evaluation API"})

from fastapi.responses import Response

@app.get("/favicon.ico")
async def favicon():
    favicon_path = Path("static/favicon.ico")
    if favicon_path.exists():
        return FileResponse(favicon_path)
    return Response(status_code=204)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Helper function for file uploads
async def handle_upload(file: UploadFile, allowed_ext: set, folder: Path):
    ext = Path(file.filename).suffix.lower()
    if ext not in allowed_ext:
        raise HTTPException(400, f"Only {', '.join(allowed_ext)} files allowed")
    
    file_id = str(uuid.uuid4())
    filename = f"{file_id}{ext}"
    file_path = folder / filename
    
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        return {"filename": filename, "path": str(file_path)}
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(500, "File upload failed")

# Endpoints
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload PDF presentation/reference material"""
    return await handle_upload(file, {'.pdf'}, settings.UPLOAD_FOLDER)

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    """Upload speech recording"""
    return await handle_upload(file, {'.wav', '.webm', '.mp3', '.ogg'}, settings.AUDIO_FOLDER)

@app.post("/evaluate")
async def evaluate(
    pdf_path: str = Form(...),
    audio_path: str = Form(...),
    generate_questions: Optional[bool] = Form(False)
):
    """Evaluate speech against PDF content"""
    logger.info(f"Evaluating with pdf_path={pdf_path}, audio_path={audio_path}")

    # Resolve paths relative to backend working directory
    base_dir = Path(__file__).parent.parent.resolve()
    resolved_pdf_path = (base_dir / pdf_path).resolve()
    resolved_audio_path = (base_dir / audio_path).resolve()

    if not all(p.exists() for p in [resolved_pdf_path, resolved_audio_path]):
        logger.error(f"File not found: pdf_path exists? {resolved_pdf_path.exists()}, audio_path exists? {resolved_audio_path.exists()}")
        raise HTTPException(400, "Required files not found")
    
    try:
        transcript = transcribe_audio(str(resolved_audio_path)) or ""
        return EvaluationResponse(
            delivery=evaluate_delivery(str(resolved_audio_path)),
            content=evaluate_content(str(resolved_pdf_path), transcript),
            questions=["Sample question 1", "Sample question 2"] if generate_questions else None
        )
    except Exception as e:
        logger.error(f"Evaluation failed: {e}")
        raise HTTPException(500, f"Evaluation failed: {e}")

@app.get("/health")
async def health_check():
    """Service health check"""
    return {"status": "healthy", "services": ["whisper", "evaluation"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)