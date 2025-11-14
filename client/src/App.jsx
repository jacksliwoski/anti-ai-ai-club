import React, { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import ProtectionInfo from './components/ProtectionInfo';
import './App.css';

function App() {
  const [protectedFiles, setProtectedFiles] = useState([]);

  const handleProtectionComplete = (result) => {
    setProtectedFiles(prev => [result, ...prev]);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Audio Protection Platform</h1>
          <p className="tagline">Protect your music from unauthorized AI training</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <section className="hero-section">
            <h2>Safeguard your artistic rights</h2>
            <p>
              Add adversarial protection to your audio files that actively disrupts unauthorized
              AI training while maintaining perfect audio quality.
            </p>
          </section>

          <AudioUploader onProtectionComplete={handleProtectionComplete} />

          <ProtectionInfo />

          {protectedFiles.length > 0 && (
            <section className="protected-files-section">
              <h3>Protected files</h3>
              <div className="protected-files-list">
                {protectedFiles.map((file, index) => (
                  <div key={index} className="protected-file-card">
                    <div className="file-info">
                      <div className="file-details">
                        <h4>{file.originalFilename}</h4>
                        <p className="file-meta">
                          <span className="protection-status">Protected</span>
                          <span className="file-meta-divider">•</span>
                          <span className="file-timestamp">
                            {new Date(file.protection.timestamp).toLocaleString()}
                          </span>
                        </p>
                        <p className="file-signature">
                          {file.protection.signature}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`${import.meta.env.VITE_API_URL || ''}${file.downloadUrl}`}
                      className="btn btn-secondary btn-sm"
                      download
                    >
                      Download file
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>Protecting artists' rights in the AI era</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
