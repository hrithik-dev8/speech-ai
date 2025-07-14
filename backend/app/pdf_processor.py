import pdfplumber
from typing import List
import re

def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def split_into_chunks(text: str, chunk_size: int = 1000) -> List[str]:
    words = text.split()
    chunks = [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
    return chunks