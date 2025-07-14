import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AudioRecorder from './components/AudioRecorder';
import Results from './components/Results';
import axios from 'axios';

function App() {
  const [pdfPath, setPdfPath] = useState('');
  const [audioPath, setAudioPath] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState('');

  const handleEvaluate = async () => {
    if (!pdfPath || !audioPath) {
      setError('Please upload both a PDF and a recording before evaluating');
      return;
    }

    setIsEvaluating(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/evaluate', {
        pdf_path: pdfPath,
        audio_path: audioPath,
      });
      setEvaluation(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Evaluation failed');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Speech Evaluation App
        </h1>
        
        <div className="space-y-6">
          <FileUpload onUploadSuccess={setPdfPath} />
          <AudioRecorder onRecordingComplete={setAudioPath} />
          
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || !pdfPath || !audioPath}
              className={`w-full py-2 px-4 rounded-md text-white ${isEvaluating || !pdfPath || !audioPath ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isEvaluating ? 'Evaluating...' : 'Get Feedback'}
            </button>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>
          
          {evaluation && <Results evaluation={evaluation} />}
        </div>
      </div>
    </div>
  );
}

export default App;