import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './AudioUploader.css';

const AudioUploader = ({ onProtectionComplete }) => {
  const [file, setFile] = useState(null);
  const [artistName, setArtistName] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [protectionLevel, setProtectionLevel] = useState('medium');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [protectionLevels, setProtectionLevels] = useState(null);
  const [pythonAvailable, setPythonAvailable] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch protection levels on component mount
  useEffect(() => {
    fetchProtectionLevels();
  }, []);

  const fetchProtectionLevels = async () => {
    try {
      const response = await axios.get('/api/audio/protection-levels');
      setProtectionLevels(response.data.levels);
      setPythonAvailable(response.data.pythonServiceAvailable);

      // Set default to medium if available, otherwise metadata
      if (response.data.pythonServiceAvailable) {
        setProtectionLevel('medium');
      } else {
        setProtectionLevel('metadata');
      }
    } catch (err) {
      console.error('Failed to fetch protection levels:', err);
      setPythonAvailable(false);
      setProtectionLevel('metadata');
    }
  };

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

  const getLevelInfo = (levelKey) => {
    return protectionLevels?.[levelKey] || null;
  };

  const currentLevelInfo = getLevelInfo(protectionLevel);

  return (
    <section className="uploader-section">
      <h2>Protect Your Audio</h2>

      {!pythonAvailable && (
        <div className="warning-banner">
          ⚠️ Adversarial protection unavailable - Python service not running. Using metadata-only protection.
        </div>
      )}

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
              {protectionLevels && Object.entries(protectionLevels).map(([key, level]) => (
                <option key={key} value={key} disabled={!level.available}>
                  {level.name} {level.recommended ? '(Recommended)' : ''}
                  {!level.available ? ' (Unavailable)' : ''}
                </option>
              ))}
            </select>

            {currentLevelInfo && (
              <div className="protection-level-info">
                <p className="level-description">{currentLevelInfo.use_case}</p>
                <div className="level-stats">
                  <div className="stat">
                    <span className="stat-label">AI Degradation:</span>
                    <span className="stat-value">
                      {typeof currentLevelInfo.ai_degradation === 'object'
                        ? `${currentLevelInfo.ai_degradation.min}-${currentLevelInfo.ai_degradation.max}%`
                        : currentLevelInfo.ai_degradation}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Quality:</span>
                    <span className="stat-value">{currentLevelInfo.imperceptibility}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Processing:</span>
                    <span className="stat-value">{currentLevelInfo.processing_time}</span>
                  </div>
                </div>
              </div>
            )}
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
