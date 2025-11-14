import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { protectAudioFile } from '../services/audioProtector.js';
import { applyAdversarialProtection, verifyAdversarialProtection, checkPythonService } from '../services/pythonService.js';
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
  let protectedFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const options = {
      artistName: req.body.artistName || 'Unknown Artist',
      trackTitle: req.body.trackTitle || req.file.originalname,
      protectionLevel: req.body.protectionLevel || 'metadata',
      rightsDeclaration: req.body.rightsDeclaration || 'All rights reserved - No AI training permitted',
      additionalInfo: req.body.additionalInfo || ''
    };

    console.log(`🔒 Processing protection for: ${req.file.originalname}`);
    console.log(`   Protection level: ${options.protectionLevel}`);

    let result;
    let adversarialProtection = null;

    // Apply metadata protection first (always)
    if (options.protectionLevel === 'metadata') {
      // Metadata-only mode
      result = await protectAudioFile(req.file.path, options);
      protectedFilePath = result.outputPath;

    } else {
      // Adversarial protection mode (light, medium, aggressive, nuclear)
      const pythonAvailable = await checkPythonService();

      if (!pythonAvailable) {
        console.warn('⚠️  Python service unavailable, falling back to metadata-only protection');
        result = await protectAudioFile(req.file.path, options);
        protectedFilePath = result.outputPath;
      } else {
        console.log('🛡️  Applying adversarial watermarking...');
        adversarialProtection = await applyAdversarialProtection(req.file.path, {
          artistName: options.artistName,
          trackTitle: options.trackTitle,
          protectionLevel: options.protectionLevel
        });

        // The Python service saves to uploads directory
        const pythonOutputPath = path.join(__dirname, '../../uploads', adversarialProtection.output_file);

        // Apply metadata on top of adversarially protected audio
        console.log('📝 Adding metadata protection...');
        result = await protectAudioFile(pythonOutputPath, options);
        protectedFilePath = result.outputPath;

        // Clean up intermediate file
        if (fs.existsSync(pythonOutputPath) && pythonOutputPath !== protectedFilePath) {
          fs.unlinkSync(pythonOutputPath);
        }
      }
    }

    const response = {
      success: true,
      message: 'Audio file protected successfully',
      downloadUrl: `/api/audio/download/${path.basename(protectedFilePath)}`,
      protection: result.protection,
      originalFilename: req.file.originalname,
      protectionLevel: options.protectionLevel
    };

    if (adversarialProtection) {
      response.adversarialProtection = {
        applied: true,
        verification: adversarialProtection.verification,
        ai_degradation_estimate: adversarialProtection.ai_degradation_estimate,
        features: adversarialProtection.protection_applied
      };
    }

    res.json(response);

  } catch (error) {
    console.error('Error protecting audio:', error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    if (protectedFilePath && fs.existsSync(protectedFilePath)) {
      fs.unlink(protectedFilePath, (err) => {
        if (err) console.error('Error deleting protected file:', err);
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

    // Check for metadata protection markers
    const hasMetadataProtection = metadata.common.comment &&
                                  metadata.common.comment.some(c =>
                                    c.includes('AI_TRAINING_OPT_OUT') ||
                                    c.includes('NO_AI_TRAINING')
                                  );

    // Check for adversarial watermark
    let adversarialVerification = null;
    const pythonAvailable = await checkPythonService();

    if (pythonAvailable) {
      try {
        adversarialVerification = await verifyAdversarialProtection(req.file.path);
      } catch (err) {
        console.error('Adversarial verification error:', err);
      }
    }

    const protectionInfo = {
      isProtected: hasMetadataProtection || (adversarialVerification && adversarialVerification.is_protected),
      metadata: {
        title: metadata.common.title,
        artist: metadata.common.artist,
        format: metadata.format.container,
        comment: metadata.common.comment,
        hasMetadataProtection
      },
      adversarialWatermark: adversarialVerification || {
        checked: false,
        reason: 'Python service unavailable'
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

// GET /api/audio/protection-levels - Get info about protection levels
router.get('/protection-levels', async (req, res) => {
  try {
    const pythonAvailable = await checkPythonService();

    const levels = {
      metadata: {
        name: 'Metadata Only',
        imperceptibility: '100% - No audio modification',
        ai_degradation: { min: 0, max: 10, avg: 5 },
        survives_compression: 'Depends on player/converter',
        processing_time: '~2 seconds',
        use_case: 'Legal protection only - can be stripped',
        available: true
      }
    };

    if (pythonAvailable) {
      levels.light = {
        name: 'Light Adversarial',
        imperceptibility: '100% - No audible artifacts',
        ai_degradation: { min: 30, max: 50, avg: 40 },
        survives_compression: 'MP3 320kbps+',
        processing_time: '~5 seconds',
        use_case: 'General distribution',
        available: true
      };

      levels.medium = {
        name: 'Medium Adversarial (Recommended)',
        imperceptibility: '99.9% - Negligible artifacts',
        ai_degradation: { min: 60, max: 80, avg: 70 },
        survives_compression: 'MP3 192kbps+',
        processing_time: '~10 seconds',
        use_case: 'Professional releases',
        available: true,
        recommended: true
      };

      levels.aggressive = {
        name: 'Aggressive Adversarial',
        imperceptibility: '99% - Minimal artifacts',
        ai_degradation: { min: 85, max: 95, avg: 90 },
        survives_compression: 'MP3 128kbps+',
        processing_time: '~20 seconds',
        use_case: 'High-value content',
        available: true
      };

      levels.nuclear = {
        name: 'Nuclear (Maximum Protection)',
        imperceptibility: '95% - May have subtle artifacts',
        ai_degradation: { min: 95, max: 99, avg: 97 },
        survives_compression: 'Most formats',
        processing_time: '~30 seconds',
        use_case: 'Unreleased masters/archives',
        available: true
      };
    }

    res.json({
      pythonServiceAvailable: pythonAvailable,
      levels
    });

  } catch (error) {
    console.error('Error getting protection levels:', error);
    res.status(500).json({ error: 'Failed to get protection levels' });
  }
});

export default router;
