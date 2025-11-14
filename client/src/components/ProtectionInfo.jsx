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
        >
          How It Works
        </button>
        <button
          className={`tab ${activeTab === 'why' ? 'active' : ''}`}
          onClick={() => setActiveTab('why')}
        >
          Why Protect
        </button>
        <button
          className={`tab ${activeTab === 'tech' ? 'active' : ''}`}
          onClick={() => setActiveTab('tech')}
        >
          Technical Details
        </button>
      </div>

      <div className="info-content">
        {activeTab === 'how' && (
          <div className="info-panel">
            <h3>How Audio Protection Works</h3>
            <div className="steps">
              <div className="step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h4>Upload Your Audio</h4>
                  <p>Upload your original audio file in any supported format (MP3, FLAC, WAV, etc.)</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h4>Metadata Embedding</h4>
                  <p>
                    We embed standardized protection markers into your file's metadata, including:
                  </p>
                  <ul>
                    <li>AI training opt-out declarations</li>
                    <li>Rights and copyright information</li>
                    <li>Cryptographic signatures for verification</li>
                    <li>Content provenance data (who, when, what)</li>
                  </ul>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h4>Download & Distribute</h4>
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
            <h3>Why Protect Your Music</h3>
            <div className="reasons">
              <div className="reason">
                <span className="reason-icon">⚖️</span>
                <h4>Legal Protection</h4>
                <p>
                  Embed clear opt-out declarations that establish your intent to prohibit
                  AI training on your work. This creates a legal record of your rights.
                </p>
              </div>
              <div className="reason">
                <span className="reason-icon">🎨</span>
                <h4>Artistic Integrity</h4>
                <p>
                  Prevent your unique sound and style from being copied by AI models
                  without your consent or compensation.
                </p>
              </div>
              <div className="reason">
                <span className="reason-icon">💰</span>
                <h4>Economic Rights</h4>
                <p>
                  Protect your ability to monetize your own work and maintain control
                  over how your music is used commercially.
                </p>
              </div>
              <div className="reason">
                <span className="reason-icon">🔍</span>
                <h4>Transparency</h4>
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
            <h3>Technical Details</h3>
            <div className="tech-details">
              <div className="tech-section">
                <h4>Protection Standards</h4>
                <ul>
                  <li><strong>AI Training Opt-Out:</strong> Clear machine-readable markers</li>
                  <li><strong>C2PA-Inspired Provenance:</strong> Chain of custody metadata</li>
                  <li><strong>Cryptographic Signatures:</strong> SHA-256 based verification</li>
                  <li><strong>ISO-8601 Timestamps:</strong> Precise protection dating</li>
                </ul>
              </div>

              <div className="tech-section">
                <h4>Supported Formats</h4>
                <table className="format-table">
                  <thead>
                    <tr>
                      <th>Format</th>
                      <th>Metadata Support</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>MP3</td>
                      <td>ID3v2 tags</td>
                      <td className="status-full">Full Support</td>
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
                <h4>What Gets Embedded</h4>
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
                <h4>Quality Guarantee</h4>
                <p>
                  <strong>Zero audio degradation:</strong> We only modify metadata, never the
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
