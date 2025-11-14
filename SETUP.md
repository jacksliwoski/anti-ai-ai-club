# Complete Setup Guide

## Quick Start (Recommended)

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Git**

### One-Command Setup

```bash
# Clone repository
git clone https://github.com/yourusername/anti-ai-ai-club.git
cd anti-ai-ai-club

# Install all dependencies (Node.js + Python + Client)
npm run install-all

# Start all services (Python + Node.js + React)
npm run dev
```

This will start:
- Python service on `http://localhost:5000`
- Backend API on `http://localhost:3001`
- Frontend on `http://localhost:3000`

## Manual Setup

### 1. Install Node.js Dependencies

```bash
npm install
```

### 2. Install Client Dependencies

```bash
cd client
npm install
cd ..
```

### 3. Install Python Dependencies

```bash
cd python-service
pip install -r requirements.txt
cd ..
```

### 4. Start Services

**Option A: All services together (recommended)**
```bash
npm run dev
```

**Option B: Individual services**

Terminal 1 - Python Service:
```bash
cd python-service
python app.py
```

Terminal 2 - Node.js Backend:
```bash
npm run server
```

Terminal 3 - React Frontend:
```bash
npm run client
```

## Troubleshooting

### Python Service Won't Start

**Issue:** `ModuleNotFoundError: No module named 'librosa'`

**Solution:**
```bash
cd python-service
pip install --upgrade pip
pip install -r requirements.txt
```

### Port Already in Use

**Issue:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find and kill process using port
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Python Service Unavailable

If the Python service fails to start, the platform will automatically fall back to metadata-only protection.

Check Python service health:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status": "ok", "service": "adversarial-watermark"}
```

## Protection Levels

Once running, you'll have access to:

1. **Metadata Only** - Legal protection (no Python required)
2. **Light Adversarial** - 30-50% AI degradation
3. **Medium Adversarial** - 60-80% AI degradation (Recommended)
4. **Aggressive** - 85-95% AI degradation
5. **Nuclear** - 95-99% AI degradation (maximum protection)

## Testing

Upload a test audio file:
1. Navigate to `http://localhost:3000`
2. Drag and drop an MP3/WAV file
3. Enter artist name
4. Select protection level
5. Click "Protect Audio File"
6. Download and test the protected file

## Production Deployment

### Environment Variables

Create `.env` file:
```
PORT=3001
NODE_ENV=production
PYTHON_SERVICE_URL=http://localhost:5000
```

### Build Frontend

```bash
cd client
npm run build
```

### Start Production Server

```bash
NODE_ENV=production npm start
```

## System Requirements

- **RAM**: 2GB minimum (4GB recommended for aggressive protection)
- **CPU**: 2 cores minimum
- **Disk**: 1GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

## Next Steps

- Read `TECHNICAL_GUIDE.md` for implementation details
- Check `README.md` for usage guide
- See `python-service/README.md` for Python API documentation
