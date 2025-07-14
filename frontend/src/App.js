import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import FileUpload from './components/FileUpload';
import Results from './components/Results';

function App() {
  const [audioPath, setAudioPath] = useState(null);
  const [pdfPath, setPdfPath] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState('');

  const handleRecordingComplete = (path) => {
    setAudioPath(path);
    setError('');
  };

  const handleUploadSuccess = (path) => {
    setPdfPath(path);
    setError('');
  };

  const handleEvaluate = async () => {
    if (!audioPath || !pdfPath) {
      setError('Please upload both audio and PDF files before evaluation.');
      return;
    }
    setError('');
    try {
      const formData = new FormData();
      formData.append('audio_path', audioPath);
      formData.append('pdf_path', pdfPath);

      const response = await fetch('http://localhost:8000/evaluate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Evaluation failed');
      }

      const data = await response.json();
      setEvaluation(data);
    } catch (err) {
      setError(err.message || 'Evaluation error');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Speech Evaluator</h1>
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      <div className="mb-4">
        <strong>Debug Info:</strong>
        <p>Audio Path: {audioPath}</p>
        <p>PDF Path: {pdfPath}</p>
      </div>
      <button
        onClick={handleEvaluate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Evaluate Speech
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <Results evaluation={evaluation} />
    </div>
  );
}

export default App;
