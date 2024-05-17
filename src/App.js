import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const API_URL = process.env.REACT_APP_API_URL;
const ACCESS_KEY_ID = process.env.REACT_APP_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;

const App = () => {
  const [bucketName, setBucketName] = useState('');
  const [files, setFiles] = useState([]);
  const [fileKey, setFileKey] = useState('');

  const createFolder = async () => {
    try {
      await axios.put(`${API_URL}/${bucketName}`, {}, {
        headers: {
          'x-access-key-id': ACCESS_KEY_ID,
          'x-secret-access-key': SECRET_ACCESS_KEY
        }
      });
      alert('Folder created successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to create folder');
    }
  };

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const uploadFile = async () => {
    if (files.length === 0) {
      alert('No file selected');
      return;
    }

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.put(`${API_URL}/${bucketName}/${file.name}`, formData, {
        headers: {
          'x-access-key-id': ACCESS_KEY_ID,
          'x-secret-access-key': SECRET_ACCESS_KEY,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to upload file');
    }
  };

  const downloadFile = async () => {
    try {
      const response = await axios.get(`${API_URL}/${bucketName}/${fileKey}`, {
        headers: {
          'x-access-key-id': ACCESS_KEY_ID,
          'x-secret-access-key': SECRET_ACCESS_KEY
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileKey);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
      alert('Failed to download file');
    }
  };

  return (
      <div className="App">
        <h1>OnePunchCloud S3 UI</h1>

        <div>
          <h2>Create Folder</h2>
          <input
              type="text"
              placeholder="Bucket Name"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
          />
          <button onClick={createFolder}>Create Folder</button>
        </div>

        <div>
          <h2>Upload File</h2>
          <div {...getRootProps()} style={{ border: '2px dashed #000', padding: '20px', width: '300px', margin: '20px auto' }}>
            <input {...getInputProps()} />
            <p>Drag & drop a file here, or click to select a file</p>
          </div>
          <button onClick={uploadFile}>Upload File</button>
        </div>

        <div>
          <h2>Download File</h2>
          <input
              type="text"
              placeholder="File Key"
              value={fileKey}
              onChange={(e) => setFileKey(e.target.value)}
          />
          <button onClick={downloadFile}>Download File</button>
        </div>
      </div>
  );
};

export default App;
