# 🔧 Technical Guide: Audio AI Protection

## Deep Dive: How Audio Protection Works

### 1. Metadata-Based Protection (Current Implementation)

#### The Challenge
Unlike images, where tools like Glaze can add imperceptible visual perturbations, audio protection faces unique challenges:
- High sensitivity to changes (humans detect audio artifacts more easily)
- Format conversion often strips metadata
- No universal metadata standard across all audio formats

#### Our Approach
We leverage existing metadata standards to embed protection markers that:
1. Are format-native and widely supported
2. Carry legal weight as explicit opt-out declarations
3. Include cryptographic verification
4. Follow emerging standards (C2PA-inspired)

#### Implementation Details

##### MP3 Protection (ID3v2)
```javascript
// Using ID3v2.4 User-Defined Text Frames (TXXX)
{
  userDefinedText: [
    {
      description: 'AI_TRAINING_OPT_OUT',
      value: 'TRUE'
    },
    {
      description: 'PROTECTION_SIGNATURE',
      value: 'sha256-hash'
    },
    {
      description: 'CONTENT_PROVENANCE',
      value: '{"creator":"Artist","timestamp":"..."}'
    }
  ],
  comment: 'Detailed human-readable protection notice',
  copyright: 'Rights declaration',
  termsOfUse: 'Usage restrictions'
}
```

**Why ID3v2?**
- Supported by virtually all MP3 players
- User-defined frames allow custom data
- Preserved by most conversion tools
- Industry-standard since 1998

##### FLAC Protection (Vorbis Comments)
```bash
# Using metaflac command-line tool
metaflac --set-tag="AI_TRAINING_OPT_OUT=TRUE" \
         --set-tag="PROTECTION_SIGNATURE=hash" \
         --set-tag="CONTENT_PROVENANCE=json" \
         file.flac
```

**Advantages:**
- FLAC is lossless (preferred by audiophiles)
- Vorbis comments are flexible key-value pairs
- Widely preserved across tools

##### WAV Protection Challenges
WAV files have limited native metadata support:
- **INFO chunks**: Basic metadata (artist, title)
- **BEXT chunks**: Broadcast Wave Format extension
- **Limited adoption**: Not all tools preserve these

**Recommendation**: Convert WAV to FLAC for better protection.

### 2. Audio Watermarking (Future Enhancement)

#### Concepts

**Spread Spectrum Watermarking:**
```
Original Signal + Watermark Signal = Watermarked Audio
```

Where watermark is:
- Spread across frequency spectrum
- Below human hearing threshold
- Resistant to compression/conversion

#### Implementation Approach

```javascript
// Pseudocode for spread spectrum watermarking
function embedWatermark(audioBuffer, watermarkData) {
  // 1. Convert to frequency domain (FFT)
  const fftData = fft(audioBuffer);

  // 2. Generate pseudorandom sequence from watermark
  const sequence = generatePN(watermarkData);

  // 3. Embed in specific frequency bands
  for (let i = 0; i < sequence.length; i++) {
    const freq = selectFrequency(i); // 2-4 kHz band
    const alpha = 0.01; // Embedding strength (imperceptible)
    fftData[freq] += alpha * sequence[i];
  }

  // 4. Convert back to time domain (IFFT)
  return ifft(fftData);
}
```

**Key Parameters:**
- **Frequency Band**: 2-4 kHz (good imperceptibility vs. robustness)
- **Embedding Strength**: 0.001-0.05 (trade-off detection vs. robustness)
- **Watermark Length**: 128-256 bits

**Robustness Against:**
- ✅ Format conversion (MP3, AAC encoding)
- ✅ Moderate compression
- ✅ Light filtering/EQ
- ❌ Heavy distortion
- ❌ Time-stretching

#### Libraries for Implementation

```javascript
// Node.js libraries
import { AudioContext } from 'web-audio-api';
import FFT from 'fft.js';

// Python alternative
// librosa, pywt (wavelet transform)
```

### 3. Adversarial Audio (Advanced Protection)

#### Concept: AI Model Confusion

Similar to Glaze for images, add imperceptible perturbations that:
1. Don't affect human perception
2. Significantly degrade AI training quality
3. Survive common transformations

#### Research-Backed Approaches

**Gradient-Based Perturbations:**
```python
# Pseudocode (requires AI model access)
def generate_adversarial_audio(audio, model, epsilon=0.01):
    # 1. Get model's prediction on original audio
    prediction = model.predict(audio)

    # 2. Calculate gradient of loss w.r.t. input
    gradient = compute_gradient(audio, prediction)

    # 3. Add perturbation in gradient direction
    perturbation = epsilon * sign(gradient)

    # 4. Ensure imperceptibility (psychoacoustic masking)
    masked_perturbation = apply_masking(perturbation, audio)

    return audio + masked_perturbation
```

**Challenges:**
- Requires access to target AI model (black-box scenarios difficult)
- May not generalize across different AI models
- Research area still evolving

**Current Status:**
- ⚠️ Active research area
- 🔬 Papers: "Adversarial Audio Examples" (Carlini & Wagner, 2018)
- 🚧 Not yet practical for general deployment

### 4. Cryptographic Content Verification

#### SHA-256 Based Signatures

```javascript
function generateProtectionSignature(metadata) {
  const data = `${metadata.artistName}:${metadata.trackTitle}:${metadata.timestamp}:${fileHash}`;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
}
```

**Purpose:**
- Verify protection hasn't been tampered with
- Prove file was protected at specific time
- Link to artist identity

#### Future: Blockchain Integration

```javascript
// Ethereum smart contract pseudocode
contract AudioProtectionRegistry {
  struct Protection {
    bytes32 fileHash;
    address artist;
    uint256 timestamp;
    string ipfsMetadata;
  }

  mapping(bytes32 => Protection) public registry;

  function registerProtection(bytes32 fileHash, string memory metadata) public {
    registry[fileHash] = Protection({
      fileHash: fileHash,
      artist: msg.sender,
      timestamp: block.timestamp,
      ipfsMetadata: metadata
    });
  }

  function verifyProtection(bytes32 fileHash) public view returns (Protection memory) {
    return registry[fileHash];
  }
}
```

**Benefits:**
- Immutable proof of ownership
- Public verification
- Timestamped protection claims

### 5. C2PA Integration (Coalition for Content Provenance and Authenticity)

#### What is C2PA?

Industry standard for content authenticity and provenance, backed by:
- Adobe
- Microsoft
- BBC
- Sony
- Many others

#### C2PA Manifest Structure

```json
{
  "claim_generator": "Anti AI AI Club v1.0",
  "assertions": [
    {
      "@type": "c2pa.actions",
      "actions": [
        {
          "action": "c2pa.created",
          "when": "2025-11-14T12:00:00Z",
          "softwareAgent": "Anti AI AI Club"
        }
      ]
    },
    {
      "@type": "c2pa.ai-training-opt-out",
      "opt_out": true,
      "scope": "all_purposes"
    }
  ],
  "signature": {
    "alg": "sha256",
    "value": "..."
  }
}
```

#### Implementation Path

```bash
# Using c2pa-node (future integration)
npm install c2pa-node

# Embed C2PA manifest
const c2pa = require('c2pa-node');
await c2pa.sign({
  asset: 'audio.mp3',
  manifest: c2paManifest,
  signer: privateKey
});
```

### 6. Psychoacoustic Considerations

#### Human Hearing Thresholds

For imperceptible protection (watermarking/adversarial):

**Frequency Masking:**
- Loud tones mask nearby frequencies
- Masking curve varies by frequency and amplitude

**Temporal Masking:**
- Sounds mask nearby sounds in time
- Pre-masking: ~5-20ms before
- Post-masking: ~50-200ms after

**Just Noticeable Difference (JND):**
- Frequency: ~0.2% (humans can detect 0.2% pitch changes)
- Amplitude: ~1 dB in quiet environments
- Time: ~10ms for click detection

#### Implementation

```javascript
// Psychoacoustic model (simplified)
function calculateMaskingThreshold(audioSignal, frequency) {
  const fft = computeFFT(audioSignal);
  const maskingCurve = computeMaskingCurve(fft);
  return maskingCurve[frequency];
}

// Only embed watermark below masking threshold
function embedImperceptible(audio, watermark) {
  const masked = [];
  for (let i = 0; i < audio.length; i++) {
    const threshold = calculateMaskingThreshold(audio, i);
    const strength = Math.min(watermark[i], threshold);
    masked[i] = audio[i] + strength;
  }
  return masked;
}
```

### 7. Testing & Validation

#### Audio Quality Metrics

**PESQ (Perceptual Evaluation of Speech Quality):**
```bash
# Using pesq command-line tool
pesq +16000 original.wav protected.wav
# Score: 1.0 (bad) to 4.5 (excellent)
# Target: >4.0 for imperceptible protection
```

**POLQA (Perceptual Objective Listening Quality Analysis):**
- Successor to PESQ
- Better for modern codecs (AAC, Opus)

**ViSQOL (Virtual Speech Quality Objective Listener):**
```bash
# Open-source alternative
visqol --reference_file original.wav --degraded_file protected.wav
```

#### Robustness Testing

Test protection survival against:
1. **Format Conversion**: MP3 → FLAC → AAC
2. **Compression**: Various bitrates (128, 192, 320 kbps)
3. **Filtering**: Low-pass, high-pass, EQ
4. **Noise Addition**: Light background noise
5. **Time-Stretching**: ±5% speed change
6. **Pitch Shifting**: ±2 semitones

### 8. Performance Optimization

#### Parallel Processing

```javascript
// Process multiple files concurrently
import { Worker } from 'worker_threads';

async function protectMultipleFiles(files) {
  const workers = [];
  const maxWorkers = os.cpus().length;

  for (let i = 0; i < Math.min(files.length, maxWorkers); i++) {
    const worker = new Worker('./protectionWorker.js');
    workers.push(worker);
  }

  // Distribute files across workers
  const results = await Promise.all(
    files.map((file, i) => {
      const worker = workers[i % workers.length];
      return processWithWorker(worker, file);
    })
  );

  return results;
}
```

#### Memory Management

```javascript
// Stream processing for large files
import { createReadStream, createWriteStream } from 'fs';

function protectLargeFile(inputPath, outputPath) {
  const readStream = createReadStream(inputPath, { highWaterMark: 64 * 1024 });
  const writeStream = createWriteStream(outputPath);

  readStream.on('data', (chunk) => {
    const processed = processChunk(chunk);
    writeStream.write(processed);
  });

  return new Promise((resolve) => {
    readStream.on('end', () => {
      writeStream.end();
      resolve();
    });
  });
}
```

## Recommended Reading

### Academic Papers
1. "Robust Audio Watermarking Using Spread Spectrum" - Cox et al.
2. "Adversarial Examples for Audio" - Carlini & Wagner, 2018
3. "Perceptual Audio Hashing" - Haitsma & Kalker

### Standards
1. C2PA Specification - https://c2pa.org/specifications/
2. ID3v2.4 Specification
3. Vorbis Comment Specification

### Tools
1. FFmpeg - Audio processing
2. SoX - Sound eXchange
3. Aubio - Audio analysis
4. Librosa (Python) - Music analysis

## Next Steps

1. **Complete Format Support**: Implement FLAC/M4A with external tools
2. **Watermarking**: Research and implement spread spectrum method
3. **Batch Processing**: UI for multiple file protection
4. **C2PA Integration**: Adopt industry standard
5. **Verification Tools**: Build detection/verification utilities

---

**This guide is continuously updated as new research and techniques emerge.**
