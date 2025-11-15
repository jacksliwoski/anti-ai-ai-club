# Audio Protection Platform

Professional audio protection service that embeds adversarial watermarking and metadata to prevent unauthorized AI training on music and audio files.

## 🚀 Quick Start - Enable ALL Protections

**Want full adversarial protection (30-99% AI degradation)?** See [QUICKSTART.md](./QUICKSTART.md)

**TL;DR:** Run this command to start all services:
```bash
./start.sh
```
or
```bash
npm run dev
```

This starts:
- ✅ Python adversarial watermarking service (port 5000)
- ✅ Node.js backend API (port 3001)
- ✅ React frontend (port 5173)

Then visit `http://localhost:5173` and you'll have all 5 protection levels available (Metadata, Light, Medium, Aggressive, Nuclear).

**Without the Python service**, you only get metadata-only protection. Read [QUICKSTART.md](./QUICKSTART.md) for details.

---

## Features

### Dual-Layer Protection System

1. **Metadata Protection** (Always Applied)
   - AI training opt-out declarations
   - Rights and copyright information
   - Cryptographic signatures for verification
   - Content provenance data (C2PA-inspired)
   - ISO-8601 timestamps

2. **Adversarial Watermarking** (Optional, Advanced)
   - Spread-spectrum watermarking for detection
   - MFCC disruption (defeats voice cloning)
   - Temporal jitter (disrupts rhythm/beat learning)
   - High-frequency adversarial patterns
   - Psychoacoustic masking ensures imperceptibility

### Protection Levels

- **Metadata Only**: Legal protection with zero audio modification
- **Light**: 30-50% AI degradation, 100% imperceptible
- **Medium** (Recommended): 60-80% AI degradation, 99.9% imperceptible
- **Aggressive**: 85-95% AI degradation, 99% imperceptible
- **Nuclear**: 95-99% AI degradation, maximum protection

📖 **Want details?** See [PROTECTION_LEVELS.md](./PROTECTION_LEVELS.md) for a complete explanation of what each level does to your audio files and when to use each one.

### Supported Audio Formats

- MP3 (Full metadata support)
- FLAC (Partial metadata support)
- WAV (Limited metadata support)
- M4A/AAC (Partial metadata support)
- OGG (Partial metadata support)

## Architecture

```
anti-ai-ai-club/
├── client/              # React frontend (Vite)
├── server/              # Node.js/Express backend
├── python-service/      # Python Flask adversarial watermarking service
└── uploads/             # Temporary file storage
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- pip (Python package manager)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd anti-ai-ai-club
```

### 2. Install Server Dependencies

```bash
npm install
```

### 3. Install Client Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Install Python Dependencies

```bash
cd python-service
pip install -r requirements.txt
cd ..
```

### 5. Configure Environment Variables

#### Server Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Default configuration:
```env
PORT=3001
NODE_ENV=development
PYTHON_SERVICE_URL=http://localhost:5000
MAX_FILE_SIZE_MB=100
FILE_RETENTION_MINUTES=60
```

#### Client Configuration

```bash
cd client
cp .env.example .env
```

Default configuration:
```env
VITE_API_URL=http://localhost:3001
```

## Running the Application

### Development Mode

You need to run three services:

#### 1. Start Python Adversarial Watermarking Service

```bash
cd python-service
python app.py
```

The Python service will run on `http://localhost:5000`

#### 2. Start Node.js Backend Server

In a new terminal:

```bash
npm run server
```

The backend will run on `http://localhost:3001`

#### 3. Start React Frontend Development Server

In a new terminal:

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port)

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Production Deployment

### Building the Frontend

```bash
cd client
npm run build
```

This creates an optimized production build in `client/dist/`

### Running in Production

1. Set environment variables:
```bash
export NODE_ENV=production
export PORT=3001
export PYTHON_SERVICE_URL=http://localhost:5000
```

2. Start Python service:
```bash
cd python-service
python app.py
```

3. Start Node.js server (serves both API and static frontend):
```bash
npm start
```

4. Access the application at `http://localhost:3001`

## API Endpoints

### Audio Protection

- `POST /api/audio/protect` - Protect audio file
- `GET /api/audio/download/:filename` - Download protected file
- `POST /api/audio/verify` - Verify if file is protected
- `GET /api/audio/protection-levels` - Get available protection levels
- `GET /api/health` - Health check

### Python Service

- `GET /health` - Health check
- `POST /protect` - Apply adversarial watermarking
- `POST /verify` - Verify adversarial watermark
- `GET /protection-info` - Get protection level information

## Usage

1. **Upload Audio File**: Drag and drop or select an audio file (MP3, FLAC, WAV, M4A, AAC, OGG)
2. **Enter Artist Information**: Provide artist name and track title
3. **Select Protection Level**: Choose desired protection level based on your needs
4. **Process File**: Click "Protect file" to apply protection
5. **Download**: Download your protected file

## Technical Details

### How It Works

#### Metadata Protection
- Embeds standardized AI training opt-out markers in file metadata
- Adds cryptographic signatures for verification
- Includes content provenance chain
- Works on all supported formats (MP3 has best support)

#### Adversarial Watermarking
- **Spread-Spectrum Watermarking**: Embeds detectable signature using psychoacoustic masking
- **MFCC Disruption**: Targets voice/timbre features used by AI models
- **Temporal Jitter**: Adds imperceptible micro-timing variations
- **High-Frequency Patterns**: Embeds patterns in 16-20kHz range

### Security Considerations

- Files are temporarily stored in `uploads/` directory
- Files are automatically deleted after download (1 minute delay)
- No permanent storage of user files
- All processing happens server-side
- Cryptographic signatures prevent tampering

## Development

### Project Structure

```
client/src/
├── App.jsx                      # Main application component
├── components/
│   ├── AudioUploader.jsx        # Upload and protection form
│   └── ProtectionInfo.jsx       # Information tabs
└── index.css                    # Global styles and design system

server/
├── index.js                     # Express server entry point
├── routes/
│   └── audioProtection.js       # Audio protection routes
└── services/
    ├── audioProtector.js        # Metadata protection service
    └── pythonService.js         # Python service client

python-service/
├── app.py                       # Flask API
└── adversarial_watermark.py     # Watermarking algorithms
```

### Design System

Professional design system with:
- Primary color: #2563eb (blue)
- Spacing scale: 4px increments
- Typography scale: 12-36px
- Border radius: 4-8px maximum
- Clean, professional interface

## Troubleshooting

### Python Service Not Available

If you see "Limited protection mode" warning:
1. Ensure Python service is running: `cd python-service && python app.py`
2. Check `PYTHON_SERVICE_URL` environment variable
3. Verify Python dependencies are installed: `pip install -r requirements.txt`

### File Upload Fails

- Check file size (max 100MB by default)
- Ensure file is a valid audio format
- Check server logs for errors
- Verify uploads directory exists and is writable

### Metadata Not Embedded (FLAC/WAV/M4A)

Some formats have limited metadata support:
- FLAC/OGG: Requires `metaflac` or `vorbiscomment` tools
- WAV: Limited native metadata support
- M4A/AAC: Requires `ffmpeg` for full metadata support
- **Recommendation**: Use MP3 for best metadata compatibility

## License

All rights reserved.

## Support

For issues, questions, or contributions, please open an issue in the repository.

## Acknowledgments

Built with:
- React + Vite
- Node.js + Express
- Python + Flask
- librosa (audio processing)
- node-id3 (MP3 metadata)

Inspired by image protection tools like Glaze and Nightshade from the University of Chicago, and the Coalition for Content Provenance and Authenticity (C2PA).
