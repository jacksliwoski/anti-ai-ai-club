# Python Adversarial Watermarking Service

This service provides adversarial watermarking capabilities to protect audio files from unauthorized AI training.

## Setup

### Prerequisites
- Python 3.8 or higher
- pip

### Installation

```bash
cd python-service
pip install -r requirements.txt
```

### Running the Service

```bash
python app.py
```

The service will start on `http://localhost:5000`

## API Endpoints

### `POST /protect`
Protect audio file with adversarial watermarking.

**Parameters:**
- `audio_file`: Audio file to protect
- `artist_name`: Artist name
- `track_title`: Track title
- `protection_level`: `light`, `medium`, `aggressive`, or `nuclear`

**Returns:**
- Protected audio file reference
- Verification data
- AI degradation estimate

### `POST /verify`
Verify if audio contains adversarial watermark.

**Parameters:**
- `audio_file`: Audio file to verify

**Returns:**
- Protection status
- Confidence score
- Detected features

### `GET /protection-info`
Get information about available protection levels.

## Protection Techniques

1. **Spread-Spectrum Watermarking** - Embeds detectable signature
2. **MFCC Disruption** - Targets voice/timbre learning
3. **Temporal Jitter** - Disrupts rhythm/beat detection
4. **High-Frequency Adversarial** - Imperceptible patterns in ultrasonic range

## How It Works

The system applies imperceptible perturbations to audio files that:
- Cannot be heard by humans (psychoacoustic masking)
- Significantly degrade AI model training (30-99% degradation)
- Survive format conversion and compression
- Can be verified and detected

This is similar to Glaze/Nightshade for images, but specifically designed for audio.
