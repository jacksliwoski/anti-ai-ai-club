import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { protectAudioFile } from '../services/audioProtector.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'upload-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp3|flac|wav|m4a|aac|ogg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) ||
                     file.mimetype.startsWith('audio/');

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed (MP3, FLAC, WAV, M4A, AAC, OGG)'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// POST /api/audio/protect - Protect audio file
router.post('/protect', upload.single('audioFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const options = {
      artistName: req.body.artistName || 'Unknown Artist',
      trackTitle: req.body.trackTitle || req.file.originalname,
      protectionLevel: req.body.protectionLevel || 'metadata', // metadata, watermark, full
      rightsDeclaration: req.body.rightsDeclaration || 'All rights reserved - No AI training permitted',
      additionalInfo: req.body.additionalInfo || ''
    };

    console.log(`🔒 Processing protection for: ${req.file.originalname}`);

    const result = await protectAudioFile(req.file.path, options);

    res.json({
      success: true,
      message: 'Audio file protected successfully',
      downloadUrl: `/api/audio/download/${path.basename(result.outputPath)}`,
      protection: result.protection,
      originalFilename: req.file.originalname
    });

  } catch (error) {
    console.error('Error protecting audio:', error);

    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({
      error: 'Failed to protect audio file',
      details: error.message
    });
  }
});

// GET /api/audio/download/:filename - Download protected file
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).json({ error: 'Error downloading file' });
    }

    // Clean up files after download (optional - can implement cleanup cron job instead)
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file after download:', err);
      });
    }, 60000); // Delete after 1 minute
  });
});

// POST /api/audio/verify - Verify if audio file is protected
router.post('/verify', upload.single('audioFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { parseFile } = await import('music-metadata');
    const metadata = await parseFile(req.file.path);

    // Check for protection markers in metadata
    const isProtected = metadata.common.comment &&
                       metadata.common.comment.some(c =>
                         c.includes('AI_TRAINING_OPT_OUT') ||
                         c.includes('NO_AI_TRAINING')
                       );

    const protectionInfo = {
      isProtected,
      metadata: {
        title: metadata.common.title,
        artist: metadata.common.artist,
        format: metadata.format.container,
        comment: metadata.common.comment
      }
    };

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting verification file:', err);
    });

    res.json(protectionInfo);

  } catch (error) {
    console.error('Error verifying audio:', error);
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ error: 'Failed to verify audio file' });
  }
});

export default router;
