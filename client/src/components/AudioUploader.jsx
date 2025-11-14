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
  const [loadingLevels, setLoadingLevels] = useState(true);
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
    } finally {
      setLoadingLevels(false);
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
      setError('Artist name is required');
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

  if (loadingLevels) {
    return (
      <section className="uploader-section">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading protection options...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="uploader-section">
      <div className="section-header">
        <h3>Protect audio file</h3>
        <p className="section-description">
          Upload your audio file to add adversarial protection that prevents unauthorized AI training
        </p>
      </div>

      {!pythonAvailable && (
        <div className="alert alert-warning">
          <strong>Limited protection mode:</strong> Advanced adversarial protection unavailable. Only metadata protection is active.
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
            aria-label="Audio file upload"
          />

          {file ? (
            <div className="file-selected">
              <svg className="file-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13M9 13l12-2"/>
              </svg>
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="drop-zone-content">
              <svg className="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <p className="drop-zone-text">Drag and drop your audio file here</p>
              <p className="drop-zone-or">or</p>
              <button type="button" className="btn btn-secondary btn-sm">Choose file</button>
              <p className="supported-formats">Supports MP3, FLAC, WAV, M4A, AAC, OGG (max 100MB)</p>
            </div>
          )}
        </div>

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="artistName">
              Artist name <span className="required">*</span>
            </label>
            <input
              id="artistName"
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Enter artist or band name"
              required
              className={error && !artistName.trim() ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="trackTitle">Track title</label>
            <input
              id="trackTitle"
              type="text"
              value={trackTitle}
              onChange={(e) => setTrackTitle(e.target.value)}
              placeholder="Enter track name (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="protectionLevel">Protection level</label>
            <select
              id="protectionLevel"
              value={protectionLevel}
              onChange={(e) => setProtectionLevel(e.target.value)}
            >
              {protectionLevels && Object.entries(protectionLevels).map(([key, level]) => (
                <option key={key} value={key} disabled={!level.available}>
                  {level.name}
                  {level.recommended ? ' (Recommended)' : ''}
                  {!level.available ? ' (Unavailable)' : ''}
                </option>
              ))}
            </select>

            {currentLevelInfo && (
              <div className="protection-level-info">
                <p className="level-description">{currentLevelInfo.use_case}</p>
                <div className="level-stats">
                  <div className="stat">
                    <span className="stat-label">AI degradation</span>
                    <span className="stat-value">
                      {typeof currentLevelInfo.ai_degradation === 'object'
                        ? `${currentLevelInfo.ai_degradation.min}-${currentLevelInfo.ai_degradation.max}%`
                        : currentLevelInfo.ai_degradation}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Audio quality</span>
                    <span className="stat-value">{currentLevelInfo.imperceptibility}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Processing time</span>
                    <span className="stat-value">{currentLevelInfo.processing_time}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">Additional information</label>
            <textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Optional: Add licensing details or usage restrictions"
              rows="3"
            />
            <p className="field-help">This information will be embedded in the file metadata</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={uploading || !file}
        >
          {uploading ? (
            <>
              <span className="spinner spinner-sm"></span>
              Processing file...
            </>
          ) : (
            'Protect file'
          )}
        </button>
      </form>
    </section>
  );
};

export default AudioUploader;
