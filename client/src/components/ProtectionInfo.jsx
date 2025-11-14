import React, { useState } from 'react';
import './ProtectionInfo.css';

const ProtectionInfo = () => {
  const [activeTab, setActiveTab] = useState('how');

  return (
    <section className="info-section">
      <div className="info-tabs">
        <button
          className={`tab ${activeTab === 'how' ? 'active' : ''}`}
          onClick={() => setActiveTab('how')}
          aria-selected={activeTab === 'how'}
        >
          How it works
        </button>
        <button
          className={`tab ${activeTab === 'why' ? 'active' : ''}`}
          onClick={() => setActiveTab('why')}
          aria-selected={activeTab === 'why'}
        >
          Why protect
        </button>
        <button
          className={`tab ${activeTab === 'tech' ? 'active' : ''}`}
          onClick={() => setActiveTab('tech')}
          aria-selected={activeTab === 'tech'}
        >
          Technical details
        </button>
      </div>

      <div className="info-content">
        {activeTab === 'how' && (
          <div className="info-panel">
            <h4>How audio protection works</h4>
            <div className="steps">
              <div className="step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h5>Upload audio file</h5>
                  <p>Upload your original audio file in any supported format (MP3, FLAC, WAV, etc.)</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h5>Protection applied</h5>
                  <p>
                    Standardized protection markers are embedded into your file's metadata:
                  </p>
                  <ul>
                    <li>AI training opt-out declarations</li>
                    <li>Rights and copyright information</li>
                    <li>Cryptographic signatures for verification</li>
                    <li>Content provenance data</li>
                  </ul>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h5>Download protected file</h5>
                  <p>
                    Download your protected file with zero quality loss. The protection
                    metadata travels with your file wherever it goes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'why' && (
          <div className="info-panel">
            <h4>Why protect your music</h4>
            <div className="reasons">
              <div className="reason">
                <h5>Legal protection</h5>
                <p>
                  Embed clear opt-out declarations that establish your intent to prohibit
                  AI training on your work. This creates a legal record of your rights.
                </p>
              </div>
              <div className="reason">
                <h5>Artistic integrity</h5>
                <p>
                  Prevent your unique sound and style from being copied by AI models
                  without your consent or compensation.
                </p>
              </div>
              <div className="reason">
                <h5>Economic rights</h5>
                <p>
                  Protect your ability to monetize your own work and maintain control
                  over how your music is used commercially.
                </p>
              </div>
              <div className="reason">
                <h5>Transparency</h5>
                <p>
                  Make it clear to platforms, researchers, and AI companies that your
                  content is off-limits for training purposes.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tech' && (
          <div className="info-panel">
            <h4>Technical details</h4>
            <div className="tech-details">
              <div className="tech-section">
                <h5>Protection standards</h5>
                <ul>
                  <li><strong>AI training opt-out:</strong> Clear machine-readable markers</li>
                  <li><strong>C2PA-inspired provenance:</strong> Chain of custody metadata</li>
                  <li><strong>Cryptographic signatures:</strong> SHA-256 based verification</li>
                  <li><strong>ISO-8601 timestamps:</strong> Precise protection dating</li>
                </ul>
              </div>

              <div className="tech-section">
                <h5>Supported formats</h5>
                <table className="format-table">
                  <thead>
                    <tr>
                      <th>Format</th>
                      <th>Metadata support</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>MP3</td>
                      <td>ID3v2 tags</td>
                      <td className="status-full">Full support</td>
                    </tr>
                    <tr>
                      <td>FLAC</td>
                      <td>Vorbis Comments</td>
                      <td className="status-partial">Partial</td>
                    </tr>
                    <tr>
                      <td>WAV</td>
                      <td>INFO/BEXT chunks</td>
                      <td className="status-partial">Limited</td>
                    </tr>
                    <tr>
                      <td>M4A/AAC</td>
                      <td>iTunes metadata</td>
                      <td className="status-partial">Partial</td>
                    </tr>
                    <tr>
                      <td>OGG</td>
                      <td>Vorbis Comments</td>
                      <td className="status-partial">Partial</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="tech-section">
                <h5>Embedded metadata</h5>
                <pre className="code-block">
{`{
  "ai_training_opt_out": true,
  "marker": "NO_AI_TRAINING",
  "rights_declaration": "All rights reserved...",
  "protection_timestamp": "2025-11-14T...",
  "signature": "a1b2c3d4...",
  "provenance": {
    "creator": "Artist Name",
    "created": "2025-11-14T...",
    "purpose": "Original artistic work"
  }
}`}
                </pre>
              </div>

              <div className="tech-section">
                <h5>Quality guarantee</h5>
                <p>
                  <strong>Zero audio degradation.</strong> Only metadata is modified, never the
                  audio stream itself. Your music sounds exactly the same after protection.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProtectionInfo;
