# Video Optimization Guide for Hero Background

## Current Situation
- **Original file**: `public/video/hero.mp4` (72MB)
- **Target**: Reduce to <5MB while maintaining quality
- **Formats needed**: WebM (primary), MP4 (fallback)

## 1. Video Compression Commands

### Using FFmpeg (Recommended)

#### Step 1: Install FFmpeg
```bash
# Windows (using Chocolatey)
choco install ffmpeg

# macOS (using Homebrew)
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg
```

#### Step 2: Compress to MP4 (H.264)
```bash
# High quality, smaller size
ffmpeg -i public/video/hero.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 28 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  public/video/hero-optimized.mp4

# For even smaller size (if quality allows)
ffmpeg -i public/video/hero.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 32 \
  -c:a aac \
  -b:a 96k \
  -movflags +faststart \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  public/video/hero-optimized-small.mp4
```

#### Step 3: Create WebM Version
```bash
# WebM with VP9 codec (best compression)
ffmpeg -i public/video/hero.mp4 \
  -c:v libvpx-vp9 \
  -crf 35 \
  -b:v 0 \
  -c:a libopus \
  -b:a 96k \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  public/video/hero-optimized.webm

# Alternative with VP8 (better compatibility)
ffmpeg -i public/video/hero.mp4 \
  -c:v libvpx \
  -crf 35 \
  -b:v 2M \
  -c:a libvorbis \
  -b:a 96k \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  public/video/hero-optimized-vp8.webm
```

#### Step 4: Create Mobile-Optimized Version
```bash
# Smaller resolution for mobile
ffmpeg -i public/video/hero.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 30 \
  -c:a aac \
  -b:a 96k \
  -movflags +faststart \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  public/video/hero-mobile.mp4
```

## 2. Advanced Optimization Parameters

### Key Parameters Explained:
- **CRF (Constant Rate Factor)**: 18-28 (lower = better quality, larger file)
- **Preset**: ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow
- **Scale**: Adjust resolution (1920x1080, 1280x720, etc.)
- **Bitrate**: Control file size vs quality

### Recommended Settings by Use Case:

#### High Quality (2-5MB target)
```bash
-crf 28 -preset slow -b:a 128k
```

#### Balanced (1-3MB target)
```bash
-crf 32 -preset medium -b:a 96k -vf "scale=1280:720"
```

#### Ultra Compressed (<1MB target)
```bash
-crf 35 -preset fast -b:a 64k -vf "scale=1280:720" -r 24
```

## 3. Batch Processing Script

Create `compress-video.sh`:
```bash
#!/bin/bash

INPUT="public/video/hero.mp4"
OUTPUT_DIR="public/video"

# Create optimized MP4
ffmpeg -i "$INPUT" \
  -c:v libx264 -preset slow -crf 28 \
  -c:a aac -b:a 128k -movflags +faststart \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  "$OUTPUT_DIR/hero-optimized.mp4"

# Create WebM version
ffmpeg -i "$INPUT" \
  -c:v libvpx-vp9 -crf 35 -b:v 0 \
  -c:a libopus -b:a 96k \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  "$OUTPUT_DIR/hero-optimized.webm"

# Create mobile version
ffmpeg -i "$INPUT" \
  -c:v libx264 -preset slow -crf 30 \
  -c:a aac -b:a 96k -movflags +faststart \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  "$OUTPUT_DIR/hero-mobile.mp4"

echo "Video compression complete!"
echo "Files created:"
echo "- hero-optimized.mp4"
echo "- hero-optimized.webm" 
echo "- hero-mobile.mp4"
```

## 4. Quality Testing

After compression, test the results:
```bash
# Check file sizes
ls -lh public/video/

# Get video info
ffprobe -v quiet -print_format json -show_format -show_streams public/video/hero-optimized.mp4
```

## 5. Expected Results

| Format | Resolution | Target Size | Quality | Use Case |
|--------|------------|-------------|---------|----------|
| WebM (VP9) | 1920x1080 | 2-4MB | High | Modern browsers |
| MP4 (H.264) | 1920x1080 | 3-5MB | High | Fallback |
| MP4 Mobile | 1280x720 | 1-2MB | Good | Mobile devices |

## 6. Implementation Notes

The VideoBackground component will:
- Try WebM first (better compression)
- Fall back to MP4 if WebM not supported
- Show static image while loading
- Respect user's reduced motion preferences
- Handle errors gracefully

## Next Steps

1. Run the compression commands above
2. Test the compressed videos in the browser
3. Adjust CRF values if needed for quality/size balance
4. Update the VideoBackground component paths if needed
