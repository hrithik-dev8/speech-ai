import requests

url = "http://localhost:8000/upload-pdf"
file_path = "test-sample.pdf"

with open(file_path, "rb") as f:
    files = {"file": (file_path, f, "application/pdf")}
    response = requests.post(url, files=files)

print("Status code:", response.status_code)
print("Response:", response.json())
