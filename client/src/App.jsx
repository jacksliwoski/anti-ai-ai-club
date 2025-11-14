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
          <h1>🎵 Anti AI AI Club</h1>
          <p className="tagline">Protect Your Music from Unauthorized AI Training</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <section className="hero-section">
            <h2>Safeguard Your Artistic Rights</h2>
            <p>
              Embed protection metadata into your audio files to prevent unauthorized
              AI training and commercial exploitation - without affecting audio quality.
            </p>
          </section>

          <AudioUploader onProtectionComplete={handleProtectionComplete} />

          <ProtectionInfo />

          {protectedFiles.length > 0 && (
            <section className="protected-files-section">
              <h2>Recently Protected Files</h2>
              <div className="protected-files-list">
                {protectedFiles.map((file, index) => (
                  <div key={index} className="protected-file-card">
                    <div className="file-info">
                      <span className="file-icon">🛡️</span>
                      <div className="file-details">
                        <h3>{file.originalFilename}</h3>
                        <p className="protection-status">
                          Protected • {new Date(file.protection.timestamp).toLocaleString()}
                        </p>
                        <p className="signature">
                          Signature: {file.protection.signature}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`http://localhost:3001${file.downloadUrl}`}
                      className="download-button"
                      download
                    >
                      Download Protected File
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Protecting artists' rights in the AI era • Built with ❤️ for creators
        </p>
      </footer>
    </div>
  );
}

export default App;
