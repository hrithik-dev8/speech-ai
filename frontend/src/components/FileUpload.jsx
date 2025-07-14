import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8000/upload-pdf', formData);
      onUploadSuccess(response.data.path);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Upload Your PDF</h2>
      <p className="text-sm text-gray-600 mb-3">
        Please upload a PDF file containing your presentation or topic material.
      </p>
      
      <div className="flex flex-col space-y-3">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        
        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className={`px-4 py-2 rounded-md text-white ${isUploading || !file ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isUploading ? 'Uploading...' : 'Upload PDF'}
        </button>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default FileUpload;