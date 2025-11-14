# 🎵 Anti AI AI Club

**Protect Your Music from Unauthorized AI Training**

A powerful web platform that enables artists to embed protection metadata into their audio files, preventing unauthorized use in AI training while maintaining perfect audio quality.

## 🌟 Features

- **Zero Quality Loss**: Protection metadata is embedded without touching the audio stream
- **Multiple Format Support**: MP3 (full), FLAC, WAV, M4A/AAC, OGG
- **Easy-to-Use Interface**: Simple drag-and-drop upload with instant protection
- **Standardized Protection**: C2PA-inspired content provenance and AI training opt-out markers
- **Cryptographic Verification**: SHA-256 signatures for authenticity verification
- **Batch Processing Ready**: Protect multiple files efficiently
- **Privacy-Focused**: Files are automatically cleaned up after download

## 🛡️ How It Works

### Protection Methods

1. **Metadata Embedding** (Currently Implemented)
   - Embeds standardized AI training opt-out declarations
   - Adds cryptographic signatures for verification
   - Includes C2PA-style content provenance data
   - Works with existing audio format standards (ID3, Vorbis Comments, etc.)

2. **Future Enhancements**
   - Inaudible audio watermarking
   - Adversarial perturbations (similar to Glaze for images)
   - Blockchain-based content registration

### What Gets Embedded

```json
{
  "ai_training_opt_out": true,
  "marker": "NO_AI_TRAINING",
  "rights_declaration": "All rights reserved - No AI training permitted",
  "protection_timestamp": "2025-11-14T...",
  "signature": "cryptographic-hash",
  "provenance": {
    "creator": "Artist Name",
    "created": "timestamp",
    "purpose": "Original artistic work - AI training prohibited"
  }
}
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/anti-ai-ai-club.git
   cd anti-ai-ai-club
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API on `http://localhost:3001`
   - Frontend on `http://localhost:3000`

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

```bash
# Build the frontend
cd client && npm run build && cd ..

# Start production server
NODE_ENV=production npm start
```

## 📖 Usage Guide

### For Artists

1. **Upload Your Audio File**
   - Drag and drop or click to select your audio file
   - Supported formats: MP3, FLAC, WAV, M4A, AAC, OGG
   - Maximum file size: 100MB

2. **Fill in Protection Details**
   - **Artist Name** (required): Your name or band name
   - **Track Title** (optional): Auto-filled from filename
   - **Protection Level**: Currently "Metadata Only" (most compatible)
   - **Additional Info** (optional): Custom licensing or rights information

3. **Protect & Download**
   - Click "Protect Audio File"
   - Download your protected file
   - Original quality maintained, protection travels with the file

### Verifying Protected Files

You can verify if an audio file is protected:

```bash
# For MP3 files, check ID3 tags
npm install -g id3v2
id3v2 -l protected-file.mp3

# Look for:
# - AI_TRAINING_OPT_OUT: TRUE
# - NO_AI_TRAINING_MARKER
# - PROTECTION_SIGNATURE
# - CONTENT_PROVENANCE
```

## 🔧 Technical Details

### Architecture

```
anti-ai-ai-club/
├── server/                 # Backend API
│   ├── index.js           # Express server
│   ├── routes/            # API routes
│   │   └── audioProtection.js
│   └── services/          # Business logic
│       └── audioProtector.js
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── public/
├── uploads/               # Temporary file storage
└── package.json
```

### API Endpoints

#### `POST /api/audio/protect`
Protect an audio file with metadata embedding.

**Request:**
- `Content-Type: multipart/form-data`
- `audioFile`: Audio file (required)
- `artistName`: Artist name (required)
- `trackTitle`: Track title (optional)
- `protectionLevel`: Protection level (default: "metadata")
- `additionalInfo`: Additional rights info (optional)

**Response:**
```json
{
  "success": true,
  "message": "Audio file protected successfully",
  "downloadUrl": "/api/audio/download/filename",
  "protection": {
    "timestamp": "2025-11-14T...",
    "signature": "a1b2c3d4...",
    "artistName": "Artist Name",
    "marker": "NO_AI_TRAINING"
  }
}
```

#### `GET /api/audio/download/:filename`
Download a protected audio file.

#### `POST /api/audio/verify`
Verify if an audio file contains protection metadata.

### Format Support Matrix

| Format | Metadata Support | Implementation Status |
|--------|-----------------|----------------------|
| MP3    | ID3v2 tags      | ✅ Full Support      |
| FLAC   | Vorbis Comments | ⚠️ Partial (requires metaflac) |
| WAV    | INFO/BEXT chunks| ⚠️ Limited           |
| M4A/AAC| iTunes metadata | ⚠️ Partial (requires ffmpeg) |
| OGG    | Vorbis Comments | ⚠️ Partial (requires vorbiscomment) |

**Note**: For full FLAC/M4A/OGG support, install additional tools:
```bash
# Ubuntu/Debian
sudo apt-get install flac vorbis-tools ffmpeg

# macOS
brew install flac vorbis-tools ffmpeg
```

## 🔐 Security & Privacy

- Files are stored temporarily and automatically deleted after download
- No permanent storage of audio content
- Cryptographic signatures prevent tampering
- HTTPS recommended for production deployment

## 🎯 Future Roadmap

### Phase 1: Enhanced Metadata (Current)
- ✅ MP3 ID3v2 protection
- ⚠️ Full support for FLAC/OGG/M4A (requires external tools)
- 🔄 Batch processing interface

### Phase 2: Audio Watermarking
- Embed imperceptible watermarks in the audio spectrum
- Survive format conversion and compression
- Detectable with verification tools

### Phase 3: Adversarial Protection
- Add imperceptible perturbations that disrupt AI training
- Similar to Glaze/Nightshade for images
- Research-backed effectiveness

### Phase 4: Blockchain Integration
- Decentralized content registration
- Immutable proof of ownership
- Public verification system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:

- Additional audio format support
- Watermarking algorithms
- UI/UX improvements
- Documentation enhancements
- Bug fixes

## 📄 License

MIT License - See LICENSE file for details

## ⚖️ Legal Notice

This tool embeds metadata that expresses the artist's intent to opt-out of AI training. While we cannot guarantee that all AI systems will respect these markers, embedded protection metadata:

1. Creates a legal record of your rights assertion
2. Makes your intent clear to ethical AI developers
3. May provide legal basis for copyright claims
4. Supports emerging standards for content provenance

**This is not legal advice.** Consult with an attorney regarding copyright protection and AI training rights in your jurisdiction.

## 🙏 Acknowledgments

Inspired by image protection tools like:
- Glaze (University of Chicago)
- Nightshade
- C2PA (Coalition for Content Provenance and Authenticity)

Built to empower artists in the AI era.

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ for artists who deserve to control their work**