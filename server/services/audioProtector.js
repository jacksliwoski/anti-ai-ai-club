import NodeID3 from 'node-id3';
import { parseFile } from 'music-metadata';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

/**
 * Main function to protect audio files from AI training
 * Embeds protection metadata into audio files
 */
export async function protectAudioFile(inputPath, options) {
  const {
    artistName,
    trackTitle,
    protectionLevel = 'metadata',
    rightsDeclaration,
    additionalInfo
  } = options;

  // Read existing metadata
  const metadata = await parseFile(inputPath);
  const fileExt = path.extname(inputPath).toLowerCase();

  // Generate protection metadata
  const protectionData = generateProtectionMetadata({
    artistName,
    trackTitle,
    rightsDeclaration,
    additionalInfo,
    fileHash: await hashFile(inputPath)
  });

  let outputPath = inputPath.replace(/(\.[^.]+)$/, '-protected$1');

  // Handle different audio formats
  switch (fileExt) {
    case '.mp3':
      outputPath = await protectMP3(inputPath, outputPath, protectionData, metadata);
      break;

    case '.flac':
    case '.ogg':
      outputPath = await protectVorbisFormat(inputPath, outputPath, protectionData, fileExt);
      break;

    case '.wav':
      outputPath = await protectWAV(inputPath, outputPath, protectionData);
      break;

    case '.m4a':
    case '.aac':
      outputPath = await protectM4A(inputPath, outputPath, protectionData);
      break;

    default:
      throw new Error(`Unsupported audio format: ${fileExt}`);
  }

  // Clean up original uploaded file
  fs.unlink(inputPath, (err) => {
    if (err) console.error('Error deleting original file:', err);
  });

  return {
    outputPath,
    protection: protectionData,
    format: fileExt
  };
}

/**
 * Generate standardized protection metadata
 */
function generateProtectionMetadata(data) {
  const timestamp = new Date().toISOString();
  const signature = crypto
    .createHash('sha256')
    .update(`${data.artistName}:${data.trackTitle}:${timestamp}:${data.fileHash}`)
    .digest('hex')
    .substring(0, 16);

  return {
    timestamp,
    signature,
    artistName: data.artistName,
    trackTitle: data.trackTitle,
    aiTrainingOptOut: true,
    rightsDeclaration: data.rightsDeclaration,
    protectionVersion: '1.0',
    additionalInfo: data.additionalInfo,
    fileHash: data.fileHash.substring(0, 16),

    // Standardized marker that AI systems should respect
    marker: 'NO_AI_TRAINING',

    // C2PA-inspired content provenance
    provenance: {
      created: timestamp,
      creator: data.artistName,
      purpose: 'Original artistic work - AI training prohibited',
      signature: signature
    }
  };
}

/**
 * Protect MP3 files using ID3 tags
 */
async function protectMP3(inputPath, outputPath, protectionData, existingMetadata) {
  const tags = {
    title: protectionData.trackTitle,
    artist: protectionData.artistName,
    comment: {
      language: 'eng',
      text: formatProtectionComment(protectionData)
    },
    // Use user-defined text frames for custom data
    userDefinedText: [
      {
        description: 'AI_TRAINING_OPT_OUT',
        value: 'TRUE'
      },
      {
        description: 'PROTECTION_SIGNATURE',
        value: protectionData.signature
      },
      {
        description: 'PROTECTION_TIMESTAMP',
        value: protectionData.timestamp
      },
      {
        description: 'RIGHTS_DECLARATION',
        value: protectionData.rightsDeclaration
      },
      {
        description: 'NO_AI_TRAINING_MARKER',
        value: protectionData.marker
      },
      {
        description: 'CONTENT_PROVENANCE',
        value: JSON.stringify(protectionData.provenance)
      }
    ],
    // Copyright field
    copyright: `${protectionData.rightsDeclaration} | Protected ${new Date().getFullYear()}`,
    // Terms of use
    termsOfUse: 'This audio file is protected from AI training and unauthorized commercial use.'
  };

  // Preserve existing tags if they exist
  const existingTags = NodeID3.read(inputPath);
  if (existingTags) {
    tags.album = existingTags.album || tags.album;
    tags.year = existingTags.year || tags.year;
    tags.genre = existingTags.genre || tags.genre;
  }

  // Write tags
  const success = NodeID3.write(tags, inputPath, outputPath);

  if (!success) {
    throw new Error('Failed to write MP3 protection metadata');
  }

  return outputPath;
}

/**
 * Protect FLAC/OGG files using Vorbis comments
 * Note: This requires external tools (metaflac, vorbiscomment) or specialized libraries
 * For now, we'll copy the file and note the limitation
 */
async function protectVorbisFormat(inputPath, outputPath, protectionData, format) {
  // Copy file
  fs.copyFileSync(inputPath, outputPath);

  // Note: Full FLAC/OGG metadata writing requires additional libraries
  // or command-line tools like metaflac or vorbiscomment
  // This would be implemented with exec() and those tools

  console.log(`WARNING: FLAC/OGG protection requires metaflac/vorbiscomment tools`);
  console.log(`File copied but metadata protection limited for ${format} format`);

  return outputPath;
}

/**
 * Protect WAV files (limited metadata support)
 * WAV has limited native metadata support, typically using INFO chunks or BEXT
 */
async function protectWAV(inputPath, outputPath, protectionData) {
  // Copy file
  fs.copyFileSync(inputPath, outputPath);

  console.log(`WARNING: WAV format has limited metadata support`);
  console.log(`Consider converting to FLAC for better protection`);

  return outputPath;
}

/**
 * Protect M4A/AAC files using iTunes-style metadata
 */
async function protectM4A(inputPath, outputPath, protectionData) {
  // Copy file
  fs.copyFileSync(inputPath, outputPath);

  // Note: M4A metadata writing requires specialized libraries like mp4v2 or ffmpeg
  // This would be implemented with ffmpeg metadata options

  console.log(`WARNING: M4A/AAC protection requires ffmpeg or specialized libraries`);
  console.log(`File copied but metadata protection limited`);

  return outputPath;
}

/**
 * Format protection data as a human-readable comment
 */
function formatProtectionComment(data) {
  return `AI TRAINING PROTECTION

This audio file is protected from unauthorized AI training and commercial exploitation.

Artist: ${data.artistName}
Track: ${data.trackTitle}
Rights: ${data.rightsDeclaration}

Protection Details:
- Marker: ${data.marker}
- Timestamp: ${data.timestamp}
- Signature: ${data.signature}
- Version: ${data.protectionVersion}

${data.additionalInfo ? `Additional: ${data.additionalInfo}` : ''}

Any use of this content for AI training, machine learning model development,
or unauthorized commercial purposes is strictly prohibited without explicit
written consent from the copyright holder.

Content Provenance: ${JSON.stringify(data.provenance)}
`;
}

/**
 * Generate a hash of the file for verification
 */
async function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}
