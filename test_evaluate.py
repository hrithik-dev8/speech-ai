import requests

url = "http://localhost:8000/evaluate"
data = {
    "pdf_path": "static/uploads/7f810853-b780-4f54-9485-992b00d704a5.pdf",
    "audio_path": "static/audio/02cf9b00-d2ad-4dd1-a172-f7c025302d58.wav"
}

response = requests.post(url, data=data)
print("Status code:", response.status_code)
print("Response:", response.json())
