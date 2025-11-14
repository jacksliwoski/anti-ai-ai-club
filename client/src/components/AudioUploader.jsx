import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AudioUploader.css';

const AudioUploader = ({ onProtectionComplete }) => {
  const [file, setFile] = useState(null);
  const [artistName, setArtistName] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [protectionLevel, setProtectionLevel] = useState('metadata');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/flac', 'audio/wav',
                          'audio/x-m4a', 'audio/aac', 'audio/ogg'];
    const allowedExtensions = /\.(mp3|flac|wav|m4a|aac|ogg)$/i;

    if (allowedTypes.includes(selectedFile.type) || allowedExtensions.test(selectedFile.name)) {
      setFile(selectedFile);
      setError(null);

      // Auto-fill track title from filename if not set
      if (!trackTitle) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTrackTitle(nameWithoutExt);
      }
    } else {
      setError('Please select a valid audio file (MP3, FLAC, WAV, M4A, AAC, or OGG)');
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select an audio file');
      return;
    }

    if (!artistName.trim()) {
      setError('Please enter artist name');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audioFile', file);
      formData.append('artistName', artistName);
      formData.append('trackTitle', trackTitle || file.name);
      formData.append('protectionLevel', protectionLevel);
      formData.append('additionalInfo', additionalInfo);

      const response = await axios.post('/api/audio/protect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onProtectionComplete(response.data);

        // Reset form
        setFile(null);
        setArtistName('');
        setTrackTitle('');
        setAdditionalInfo('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to protect audio file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="uploader-section">
      <h2>Protect Your Audio</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        <div
          className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.flac,.wav,.m4a,.aac,.ogg,audio/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />

          {file ? (
            <div className="file-selected">
              <span className="file-icon">🎵</span>
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="drop-zone-content">
              <span className="upload-icon">⬆️</span>
              <p>Drag & drop your audio file here</p>
              <p className="or-text">or click to browse</p>
              <p className="supported-formats">Supports: MP3, FLAC, WAV, M4A, AAC, OGG</p>
            </div>
          )}
        </div>

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="artistName">Artist Name *</label>
            <input
              id="artistName"
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Your artist or band name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="trackTitle">Track Title</label>
            <input
              id="trackTitle"
              type="text"
              value={trackTitle}
              onChange={(e) => setTrackTitle(e.target.value)}
              placeholder="Song or track name (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="protectionLevel">Protection Level</label>
            <select
              id="protectionLevel"
              value={protectionLevel}
              onChange={(e) => setProtectionLevel(e.target.value)}
            >
              <option value="metadata">Metadata Only (Recommended)</option>
              <option value="watermark">Metadata + Watermark (Coming Soon)</option>
              <option value="full">Full Protection (Coming Soon)</option>
            </select>
            <p className="field-help">
              Metadata protection embeds rights information without affecting audio quality
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information (Optional)</label>
            <textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any additional rights or licensing information"
              rows="3"
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          className="protect-button"
          disabled={uploading || !file}
        >
          {uploading ? '🔒 Protecting...' : '🛡️ Protect Audio File'}
        </button>
      </form>
    </section>
  );
};

export default AudioUploader;
