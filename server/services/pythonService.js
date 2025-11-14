import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

/**
 * Call Python adversarial watermarking service
 */
export async function applyAdversarialProtection(audioFilePath, options) {
  const {
    artistName,
    trackTitle,
    protectionLevel = 'medium'
  } = options;

  try {
    // Create form data
    const formData = new FormData();
    formData.append('audio_file', fs.createReadStream(audioFilePath));
    formData.append('artist_name', artistName);
    formData.append('track_title', trackTitle);
    formData.append('protection_level', protectionLevel);

    // Call Python service
    const response = await axios.post(`${PYTHON_SERVICE_URL}/protect`, formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 120000 // 2 minutes for processing
    });

    return response.data;

  } catch (error) {
    console.error('Python service error:', error.message);
    throw new Error(`Adversarial protection failed: ${error.message}`);
  }
}

/**
 * Verify if audio contains adversarial watermark
 */
export async function verifyAdversarialProtection(audioFilePath) {
  try {
    const formData = new FormData();
    formData.append('audio_file', fs.createReadStream(audioFilePath));

    const response = await axios.post(`${PYTHON_SERVICE_URL}/verify`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    return response.data;

  } catch (error) {
    console.error('Verification error:', error.message);
    throw new Error(`Verification failed: ${error.message}`);
  }
}

/**
 * Get protection level information
 */
export async function getProtectionInfo() {
  try {
    const response = await axios.get(`${PYTHON_SERVICE_URL}/protection-info`);
    return response.data;
  } catch (error) {
    console.error('Failed to get protection info:', error.message);
    return null;
  }
}

/**
 * Check if Python service is available
 */
export async function checkPythonService() {
  try {
    const response = await axios.get(`${PYTHON_SERVICE_URL}/health`, { timeout: 5000 });
    return response.data.status === 'ok';
  } catch (error) {
    return false;
  }
}
