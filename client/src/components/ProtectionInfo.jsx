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
          Protection layers
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
                  <p>Upload your audio file in any supported format (MP3, FLAC, WAV, M4A, AAC, OGG)</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h5>Select protection level</h5>
                  <p>Choose from five protection levels:</p>
                  <ul>
                    <li><strong>Metadata only:</strong> Legal protection through embedded declarations</li>
                    <li><strong>Light/Medium/Aggressive/Nuclear:</strong> Adversarial watermarking that actively degrades AI training (30-99% effectiveness)</li>
                  </ul>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h5>Dual-layer protection applied</h5>
                  <p>
                    <strong>Layer 1 - Metadata:</strong> AI opt-out declarations, cryptographic signatures, and provenance data embedded in file metadata.
                  </p>
                  <p>
                    <strong>Layer 2 - Adversarial (Light+):</strong> Imperceptible audio perturbations that poison AI training data, making your file actively harmful to models.
                  </p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <div className="step-content">
                  <h5>Download protected file</h5>
                  <p>
                    Your file now has dual protection. Metadata provides legal standing, while adversarial watermarking physically prevents effective AI training.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'why' && (
          <div className="info-panel">
            <h4>Understanding protection layers</h4>
            <div className="reasons">
              <div className="reason">
                <h5>Metadata protection (Always active)</h5>
                <p>
                  Embeds AI training opt-out declarations and copyright information in file metadata.
                  Provides legal protection and works with ethical AI companies that respect these markers.
                </p>
                <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                  Limitation: Can be stripped by bad actors
                </p>
              </div>
              <div className="reason">
                <h5>Adversarial watermarking (Light+)</h5>
                <p>
                  Embeds imperceptible audio perturbations that actively degrade AI model training.
                  Targets MFCC features, temporal patterns, and frequency bands that models rely on.
                </p>
                <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--success)' }}>
                  Cannot be removed without destroying audio quality
                </p>
              </div>
              <div className="reason">
                <h5>Protection against bad actors</h5>
                <p>
                  Adversarial watermarking protects even when metadata is ignored or stripped.
                  The audio signal itself becomes poisonous to AI training, causing 30-99% degradation in model quality.
                </p>
              </div>
              <div className="reason">
                <h5>100% imperceptible to humans</h5>
                <p>
                  All protection levels use psychoacoustic masking to ensure watermarks are completely imperceptible.
                  Your audio will sound exactly as you mastered it with zero quality degradation.
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
                <h5>Metadata protection (Always active)</h5>
                <ul>
                  <li><strong>AI training opt-out:</strong> Machine-readable NO_AI_TRAINING markers</li>
                  <li><strong>C2PA-inspired provenance:</strong> Chain of custody metadata</li>
                  <li><strong>Cryptographic signatures:</strong> SHA-256 based verification</li>
                  <li><strong>Format support:</strong> MP3 (full), FLAC/WAV/M4A/OGG (partial)</li>
                </ul>
              </div>

              <div className="tech-section">
                <h5>Adversarial watermarking (Light, Medium, Aggressive, Nuclear)</h5>
                <ul>
                  <li><strong>Spread-spectrum watermarking:</strong> Cryptographic signature embedded using psychoacoustic masking</li>
                  <li><strong>MFCC disruption:</strong> Targets Mel-Frequency Cepstral Coefficients to defeat voice cloning and timbre learning</li>
                  <li><strong>Temporal jitter:</strong> Imperceptible micro-timing variations that disrupt rhythm and beat detection</li>
                  <li><strong>High-frequency adversarial:</strong> Patterns in 16-20kHz range that poison AI feature extraction</li>
                </ul>
              </div>

              <div className="tech-section">
                <h5>Protection effectiveness</h5>
                <table className="format-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>AI degradation</th>
                      <th>Audio quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Metadata only</td>
                      <td>0-10%</td>
                      <td className="status-full">No modification</td>
                    </tr>
                    <tr>
                      <td>Light</td>
                      <td>30-50%</td>
                      <td className="status-full">Imperceptible</td>
                    </tr>
                    <tr>
                      <td>Medium</td>
                      <td>60-80%</td>
                      <td className="status-full">Imperceptible</td>
                    </tr>
                    <tr>
                      <td>Aggressive</td>
                      <td>85-95%</td>
                      <td className="status-full">Imperceptible</td>
                    </tr>
                    <tr>
                      <td>Nuclear</td>
                      <td>95-99%</td>
                      <td className="status-full">Imperceptible</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="tech-section">
                <h5>How adversarial protection works</h5>
                <p>
                  Unlike metadata which can be stripped, adversarial watermarking physically modifies the audio signal in ways that:
                </p>
                <ul>
                  <li>Are 100% imperceptible to humans</li>
                  <li>Actively corrupt AI model training by introducing perturbations</li>
                  <li>Target specific features (MFCCs, temporal patterns) that models depend on</li>
                  <li>Cannot be removed without significant audio quality loss</li>
                  <li>Survive format conversion at recommended bitrates (MP3 192kbps+)</li>
                </ul>
              </div>

              <div className="tech-section">
                <h5>Quality guarantee</h5>
                <p>
                  <strong>All protection levels are 100% imperceptible.</strong> Your audio will sound exactly as you mastered it.
                  Metadata-only protection makes zero audio modifications. Adversarial watermarking uses psychoacoustic masking
                  to ensure all changes are below the threshold of human perception.
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
