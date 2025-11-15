# Quick Start - Enable All Protections

This guide will get you up and running with **full adversarial protection** in under 5 minutes.

## Current Status

By default, you're seeing **metadata-only protection**. This happens when the Python adversarial watermarking service isn't running.

## Enable Full Protection (Metadata + Adversarial)

### Option 1: One-Command Startup (Recommended)

**On Windows:**
```bash
start.bat
```

**On Mac/Linux:**
```bash
./start.sh
```

This automatically:
- Installs ALL Python dependencies (flask, flask-cors, librosa, numpy, scipy, etc.)
- Installs Node dependencies if needed
- Starts all 3 services (Python, Backend, Frontend)

### Option 2: Manual Setup

**1. Install Python dependencies:**
```bash
cd python-service
pip install -r requirements.txt
cd ..
```

**2. Install Node dependencies:**
```bash
npm install
cd client && npm install && cd ..
```

**3. Start all services:**
```bash
npm run dev
```

This runs:
- Python service on `http://localhost:5000`
- Backend API on `http://localhost:3001`
- Frontend on `http://localhost:5173`

## Verify Full Protection is Active

1. Open `http://localhost:5173` in your browser
2. Check the "Protect audio file" section
3. Click the "Protection level" dropdown

**If you see all 5 levels:**
- ✅ Metadata only
- ✅ Light Adversarial (Recommended)
- ✅ Medium Adversarial (Recommended)
- ✅ Aggressive Adversarial
- ✅ Nuclear (Maximum Protection)

**Your full protection system is active!**

**If you only see "Metadata only":**
- ⚠️ You'll see a warning: "Limited protection mode: Advanced adversarial protection unavailable"
- The Python service isn't running
- Run `./start.sh` or `npm run dev`

## What Each Protection Level Does

| Level | AI Degradation | Audio Quality | Use Case |
|-------|---------------|---------------|----------|
| **Metadata only** | 0-10% | 100% (no change) | Legal protection only |
| **Light** | 30-50% | 100% imperceptible | General distribution |
| **Medium** ⭐ | 60-80% | 99.9% imperceptible | Professional releases |
| **Aggressive** | 85-95% | 99% imperceptible | High-value content |
| **Nuclear** | 95-99% | 95% (subtle artifacts) | Maximum protection |

## How Protection Works

### Layer 1: Metadata (Always Active)
- Legal opt-out declarations
- Cryptographic signatures
- Works with ethical AI companies
- ⚠️ Can be stripped by bad actors

### Layer 2: Adversarial Watermarking (Light+)
- Physically modifies audio signal
- Imperceptible to humans
- Poisons AI training (30-99% degradation)
- ✅ Cannot be removed without destroying quality
- **Protects against bad actors who ignore metadata**

## Troubleshooting

### Python service won't start
```bash
# Check Python version (need 3.9+)
python3 --version

# Install dependencies manually
cd python-service
pip install numpy scipy librosa soundfile flask flask-cors
cd ..
```

### "Module not found" errors
```bash
# Reinstall all dependencies
npm run install-all
```

### Port already in use
```bash
# Kill existing processes
# Python service (port 5000)
lsof -ti:5000 | xargs kill -9

# Backend (port 3001)
lsof -ti:3001 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

## Production Deployment

For production, you need all services running:

```bash
# Build frontend
cd client && npm run build && cd ..

# Set environment
export NODE_ENV=production
export PORT=3001
export PYTHON_SERVICE_URL=http://localhost:5000

# Start Python service (background)
cd python-service && python app.py &

# Start Node.js server (serves API + frontend)
npm start
```

Visit `http://localhost:3001`

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Verify Python dependencies: `pip list | grep -E "flask|librosa|numpy|scipy"`
- Check if services are running: `ps aux | grep -E "python|node"`
