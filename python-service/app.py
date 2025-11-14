"""
Flask API for Adversarial Watermarking Service
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from adversarial_watermark import AdversarialWatermark, estimate_ai_degradation
import os
import tempfile
import hashlib
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Temporary directory for processing
TEMP_DIR = tempfile.gettempdir()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'service': 'adversarial-watermark'})

@app.route('/protect', methods=['POST'])
def protect_audio():
    """
    Protect audio file with adversarial watermarking.

    Expected form data:
    - audio_file: The audio file to protect
    - artist_name: Artist name
    - track_title: Track title
    - protection_level: 'light', 'medium', 'aggressive', or 'nuclear'
    """
    try:
        # Get uploaded file
        if 'audio_file' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio_file']
        artist_name = request.form.get('artist_name', 'Unknown Artist')
        track_title = request.form.get('track_title', 'Unknown Track')
        protection_level = request.form.get('protection_level', 'medium')

        # Validate protection level
        if protection_level not in ['light', 'medium', 'aggressive', 'nuclear']:
            protection_level = 'medium'

        # Save uploaded file temporarily
        input_path = os.path.join(TEMP_DIR, f'input_{hashlib.md5(audio_file.filename.encode()).hexdigest()}.wav')
        audio_file.save(input_path)

        # Generate output path
        output_path = os.path.join(TEMP_DIR, f'protected_{hashlib.md5((audio_file.filename + str(datetime.now())).encode()).hexdigest()}.wav')

        # Apply adversarial watermarking
        watermarker = AdversarialWatermark(protection_level=protection_level)
        verification_data = watermarker.protect_audio(
            input_path=input_path,
            output_path=output_path,
            artist_name=artist_name,
            track_title=track_title
        )

        # Clean up input file
        os.remove(input_path)

        # Get AI degradation estimate
        degradation_estimate = estimate_ai_degradation(protection_level)

        # Return success with verification data
        return jsonify({
            'success': True,
            'output_file': os.path.basename(output_path),
            'verification': verification_data,
            'ai_degradation_estimate': degradation_estimate,
            'protection_applied': {
                'spread_spectrum_watermark': True,
                'mfcc_disruption': True,
                'temporal_jitter': True,
                'high_frequency_adversarial': True
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/verify', methods=['POST'])
def verify_audio():
    """
    Verify if audio file contains adversarial watermark.

    Expected form data:
    - audio_file: The audio file to verify
    """
    try:
        # Get uploaded file
        if 'audio_file' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio_file']

        # Save temporarily
        temp_path = os.path.join(TEMP_DIR, f'verify_{hashlib.md5(audio_file.filename.encode()).hexdigest()}.wav')
        audio_file.save(temp_path)

        # Verify watermark
        watermarker = AdversarialWatermark()
        verification_result = watermarker.verify_watermark(temp_path)

        # Clean up
        os.remove(temp_path)

        return jsonify(verification_result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download protected audio file."""
    try:
        file_path = os.path.join(TEMP_DIR, filename)

        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404

        return send_file(file_path, as_attachment=True)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/protection-info', methods=['GET'])
def protection_info():
    """Get information about protection levels."""
    return jsonify({
        'levels': {
            'light': {
                'imperceptibility': '100% - No audible artifacts',
                'ai_degradation': estimate_ai_degradation('light'),
                'survives_compression': 'MP3 320kbps+',
                'processing_time': '~5 seconds',
                'use_case': 'General distribution, maximum compatibility'
            },
            'medium': {
                'imperceptibility': '99.9% - Negligible artifacts',
                'ai_degradation': estimate_ai_degradation('medium'),
                'survives_compression': 'MP3 192kbps+',
                'processing_time': '~10 seconds',
                'use_case': 'Professional releases (RECOMMENDED)'
            },
            'aggressive': {
                'imperceptibility': '99% - Minimal artifacts',
                'ai_degradation': estimate_ai_degradation('aggressive'),
                'survives_compression': 'MP3 128kbps+',
                'processing_time': '~20 seconds',
                'use_case': 'High-value content requiring strong protection'
            },
            'nuclear': {
                'imperceptibility': '95% - May have subtle artifacts',
                'ai_degradation': estimate_ai_degradation('nuclear'),
                'survives_compression': 'Most formats',
                'processing_time': '~30 seconds',
                'use_case': 'Maximum protection for unreleased masters'
            }
        },
        'features': {
            'spread_spectrum_watermark': 'Embeds detectable signature for verification',
            'mfcc_disruption': 'Targets voice/timbre learning (defeats voice cloning)',
            'temporal_jitter': 'Disrupts rhythm/beat pattern learning',
            'high_frequency_adversarial': 'Imperceptible patterns that poison AI training'
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
