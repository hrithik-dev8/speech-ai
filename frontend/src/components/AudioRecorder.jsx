import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import axios from 'axios';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: 'audio/wav' }
  });

  const handleUpload = async () => {
    if (!mediaBlobUrl) {
      setError('Please record audio first');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Fetch the blob from the mediaBlobUrl
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('file', blob, 'recording.wav');

      const uploadResponse = await axios.post(
        'http://localhost:8000/upload-audio', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      onRecordingComplete(uploadResponse.data.path);
      clearBlobUrl();
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Record Your Speech</h2>
      <p className="text-sm text-gray-600 mb-3">
        Click 'Start Recording' and begin your speech.
      </p>
      
      <div className="flex flex-col space-y-4 items-center">
        <div className="w-full flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Status: <span className="capitalize">{status}</span>
          </span>
          <div className="flex space-x-2">
            <button
              onClick={startRecording}
              disabled={status === 'recording'}
              className={`px-3 py-1 rounded-md text-sm text-white ${status === 'recording' ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              Start
            </button>
            <button
              onClick={stopRecording}
              disabled={status !== 'recording'}
              className={`px-3 py-1 rounded-md text-sm text-white ${status !== 'recording' ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
            >
              Stop
            </button>
          </div>
        </div>
        
        {mediaBlobUrl && (
          <div className="w-full">
            <audio
              src={mediaBlobUrl}
              controls
              className="w-full mb-2"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`px-4 py-2 rounded-md text-white ${isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isUploading ? 'Uploading...' : 'Save Recording'}
              </button>
              <button
                onClick={clearBlobUrl}
                className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default AudioRecorder;