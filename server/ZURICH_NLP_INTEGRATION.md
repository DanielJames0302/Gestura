# ZurichNLP Pose Generation Integration for Gestura Server

This document describes the integration of the ZurichNLP spoken-to-signed translation model into the Gestura server, focused on pose generation and visualization.

## Overview

The ZurichNLP model provides a sophisticated approach to text-to-sign language pose generation. It uses a pose-based pipeline:

1. **Text → Gloss**: Convert natural language text to sign language glosses
2. **Gloss → Pose**: Generate 3D pose sequences from glosses
3. **Pose → Visualization**: Convert poses to GIF or MP4 for display

This integration focuses on generating pose files and visual representations rather than full video synthesis.

## Files Added/Modified

### New Files
- `services/pose_visualization_service.py` - Main service for pose generation and visualization
- `services/zurich_nlp_services.py` - Original ZurichNLP integration (backup)
- `config/zurich_nlp_config.py` - Configuration settings for the model
- `setup_zurich_nlp.py` - Setup script for installing dependencies
- `test_pose_generation.py` - Test script for pose generation
- `ZURICH_NLP_INTEGRATION.md` - This documentation file

### Modified Files
- `services/gestura_services.py` - Updated to use pose visualization service
- `routers/gestura_routers.py` - Added new pose generation endpoints
- `requirements.txt` - Added pose-format dependency

## Installation

### 1. Install Dependencies

Run the setup script to install all required dependencies:

```bash
cd server
python setup_zurich_nlp.py
```

This will:
- Clone the ZurichNLP repository
- Install the spoken-to-signed-translation package
- Install pose-to-video dependencies
- Install additional required packages

### 2. Download Lexicon (Optional)

For better results, download the full SignSuisse lexicon:

```bash
python setup_zurich_nlp.py lexicon
```

**Note**: This downloads ~34GB of data and may take a while.

### 3. Verify Installation

Test the installation by running a simple conversion:

```python
from services.zurich_nlp_services import zurich_nlp_service

# Test basic functionality
result = await zurich_nlp_service.text_to_pose(
    text="Hello world",
    output_path="test.pose"
)
```

## Configuration

### Language Settings

Edit `config/zurich_nlp_config.py` to change language settings:

```python
# Supported spoken languages
DEFAULT_SPOKEN_LANGUAGE = "en"  # English
# Options: "en", "de", "fr", "es"

# Supported sign languages  
DEFAULT_SIGNED_LANGUAGE = "sgg"  # Swiss German Sign Language
# Options: "sgg", "asl", "bsl"
```

### Environment Variables

You can override configuration using environment variables:

```bash
export ZURICH_NLP_SPOKEN_LANGUAGE="en"
export ZURICH_NLP_SIGNED_LANGUAGE="asl"
export ZURICH_NLP_LEXICON_PATH="/path/to/lexicon"
```

### Performance Settings

Adjust performance settings in the config file:

```python
MAX_TEXT_LENGTH = 500  # Maximum input text length
TIMEOUT_SECONDS = 300  # Timeout for video generation
ENABLE_FALLBACK = True  # Fallback to original method if ZurichNLP fails
```

## Usage

### API Endpoints

#### Existing Endpoints (Updated)
- `POST /generate-asl` - Generate sign language pose video from text (now uses pose generation)
- `POST /upload` - Translate sign language video to text (unchanged)

#### New Pose Generation Endpoints
- `POST /generate-pose-gif` - Generate pose GIF from text
- `POST /generate-pose-mp4` - Generate pose MP4 from text  
- `POST /generate-pose-file` - Generate raw pose file from text

### Programmatic Usage

```python
from services.pose_visualization_service import pose_visualization_service

# Generate pose GIF
gif_path = await pose_visualization_service.text_to_pose_gif(
    text="small children eat pizza",
    output_path="output.gif",
    width=256,
    height=256
)

# Generate pose MP4
mp4_path = await pose_visualization_service.text_to_pose_mp4(
    text="small children eat pizza",
    output_path="output.mp4",
    width=256,
    height=256,
    fps=30
)

# Generate pose file only
pose_path = await pose_visualization_service.text_to_pose(
    text="small children eat pizza",
    output_path="output.pose"
)
```

## Fallback Mechanism

The system includes a fallback mechanism that automatically switches to the original video concatenation method if:

1. ZurichNLP model is not installed
2. ZurichNLP processing fails
3. Required dependencies are missing

This ensures backward compatibility and reliability.

## Troubleshooting

### Common Issues

1. **Command not found errors**
   - Run `python setup_zurich_nlp.py` to install dependencies
   - Ensure the spoken-to-signed-translation package is properly installed

2. **Timeout errors**
   - Increase `TIMEOUT_SECONDS` in the config
   - Check system resources (CPU, memory)

3. **Lexicon errors**
   - Ensure lexicon path is correct
   - Download the full lexicon if using custom settings

4. **Video generation fails**
   - Check pose-to-video installation
   - Verify model files are available

### Debug Mode

Enable verbose logging by setting `VERBOSE_LOGGING = True` in the config file.

### Logs

Check server logs for detailed error messages and processing information.

## Performance Considerations

- **Memory**: ZurichNLP model requires significant RAM (4GB+ recommended)
- **Storage**: Full lexicon requires ~34GB of disk space
- **Processing Time**: Video generation can take 30-300 seconds depending on text length
- **GPU**: Optional but recommended for faster processing

## Language Support

### Currently Supported
- **Spoken Languages**: English, German, French, Spanish
- **Sign Languages**: Swiss German Sign Language (SGG), American Sign Language (ASL), British Sign Language (BSL)

### Adding New Languages
1. Update `SUPPORTED_LANGUAGES` in config
2. Ensure appropriate lexicon is available
3. Test with sample texts

## Model Limitations

- Text length is limited to 500 characters by default
- Some complex sentences may not translate perfectly
- Video quality depends on the pose-to-video model
- Processing time increases with text length

## Future Improvements

- Support for more sign languages
- Better error handling and recovery
- Caching for repeated translations
- Batch processing capabilities
- Real-time video generation
