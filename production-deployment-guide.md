# Production Deployment Guide for Video Background

## 1. CDN Strategy

### Recommended CDN Services
1. **Cloudflare** (Free tier available)
2. **AWS CloudFront** 
3. **Vercel** (if deploying on Vercel)
4. **Netlify** (if deploying on Netlify)

### CDN Configuration
```javascript
// Example Cloudflare configuration
const videoUrls = {
  webm: "https://cdn.yourdomain.com/video/hero-optimized.webm",
  mp4: "https://cdn.yourdomain.com/video/hero-optimized.mp4",
  mobile: "https://cdn.yourdomain.com/video/hero-mobile.mp4"
};
```

## 2. File Structure for Production

```
public/
├── video/
│   ├── hero-optimized.webm      # 2-4MB (primary)
│   ├── hero-optimized.mp4       # 3-5MB (fallback)
│   ├── hero-mobile.mp4          # 1-2MB (mobile)
│   └── poster.jpg               # 50-100KB (poster frame)
└── images/
    └── hero-fallback.jpg        # 200-500KB (static fallback)
```

## 3. Environment-Based Configuration

Create `src/config/video.ts`:
```typescript
const isDevelopment = process.env.NODE_ENV === 'development';
const cdnUrl = process.env.REACT_APP_CDN_URL || '';

export const videoConfig = {
  hero: {
    webm: isDevelopment 
      ? "/video/hero-optimized.webm"
      : `${cdnUrl}/video/hero-optimized.webm`,
    mp4: isDevelopment 
      ? "/video/hero-optimized.mp4"
      : `${cdnUrl}/video/hero-optimized.mp4`,
    mobile: isDevelopment 
      ? "/video/hero-mobile.mp4"
      : `${cdnUrl}/video/hero-mobile.mp4`,
  },
  fallback: isDevelopment 
    ? "/images/hero-fallback.jpg"
    : `${cdnUrl}/images/hero-fallback.jpg`
};
```

## 4. Bandwidth Optimization

### A. Adaptive Quality Based on Connection
```typescript
// In VideoBackground component
const getOptimalVideoSource = () => {
  const connection = (navigator as any).connection;
  
  if (!connection) return videoSources;
  
  const { effectiveType, downlink } = connection;
  
  // Slow connection: use mobile version or fallback
  if (['slow-2g', '2g'].includes(effectiveType) || downlink < 1) {
    return {
      mp4: videoSources.mobile || videoSources.mp4,
      webm: undefined // Skip WebM on slow connections
    };
  }
  
  // Fast connection: use full quality
  return videoSources;
};
```

### B. Progressive Loading
```typescript
// Load lower quality first, then upgrade
const [currentQuality, setCurrentQuality] = useState<'low' | 'high'>('low');

useEffect(() => {
  if (isLoaded && currentQuality === 'low') {
    // Preload high quality version in background
    const highQualityVideo = new HTMLVideoElement();
    highQualityVideo.src = videoSources.mp4;
    highQualityVideo.addEventListener('canplaythrough', () => {
      setCurrentQuality('high');
    });
    highQualityVideo.load();
  }
}, [isLoaded, currentQuality]);
```

## 5. Caching Strategy

### A. HTTP Headers
```nginx
# Nginx configuration
location ~* \.(mp4|webm)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}
```

### B. Service Worker Caching
```javascript
// sw.js
const CACHE_NAME = 'video-cache-v1';
const videoUrls = [
  '/video/hero-optimized.webm',
  '/video/hero-optimized.mp4',
  '/video/hero-mobile.mp4'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(videoUrls))
  );
});
```

## 6. Performance Monitoring

### A. Core Web Vitals Impact
```typescript
// Monitor LCP impact
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
      // Send to analytics
    }
  }
});
observer.observe({ entryTypes: ['largest-contentful-paint'] });
```

### B. Video Loading Metrics
```typescript
const trackVideoPerformance = (videoElement: HTMLVideoElement) => {
  const startTime = performance.now();
  
  videoElement.addEventListener('loadeddata', () => {
    const loadTime = performance.now() - startTime;
    // Send to analytics: video load time
    gtag('event', 'video_load_time', {
      value: Math.round(loadTime),
      custom_parameter: 'hero_video'
    });
  });
};
```

## 7. Deployment Checklist

### Pre-deployment:
- [ ] Compress videos using FFmpeg commands
- [ ] Test all video formats in different browsers
- [ ] Verify fallback image loads correctly
- [ ] Test on slow network connections
- [ ] Check accessibility with reduced motion
- [ ] Validate file sizes are under targets

### CDN Setup:
- [ ] Upload videos to CDN
- [ ] Configure proper MIME types
- [ ] Set up compression (Gzip/Brotli)
- [ ] Enable HTTP/2
- [ ] Configure cache headers

### Monitoring:
- [ ] Set up performance monitoring
- [ ] Track video load success/failure rates
- [ ] Monitor bandwidth usage
- [ ] Set up alerts for high CDN costs

## 8. Cost Optimization

### A. Bandwidth Costs
- **Estimate**: 3MB video × 1000 views = 3GB bandwidth
- **CDN costs**: ~$0.08-0.15 per GB
- **Monthly cost for 10K views**: ~$2.40-4.50

### B. Optimization Strategies
1. **Lazy loading**: Only load when hero section is visible
2. **Connection-aware loading**: Skip video on slow connections
3. **Time-based loading**: Don't load video during peak hours
4. **Geographic optimization**: Use regional CDN endpoints

## 9. Fallback Strategy

```typescript
const VideoHero = () => {
  const [shouldUseVideo, setShouldUseVideo] = useState(true);
  
  useEffect(() => {
    // Disable video based on various factors
    const connection = (navigator as any).connection;
    const isSlowConnection = connection?.effectiveType === '2g';
    const isSaveDataEnabled = connection?.saveData;
    const isBatteryLow = (navigator as any).getBattery?.()?.level < 0.2;
    
    if (isSlowConnection || isSaveDataEnabled || isBatteryLow) {
      setShouldUseVideo(false);
    }
  }, []);
  
  return shouldUseVideo ? <VideoBackground /> : <StaticBackground />;
};
```

## 10. Testing Commands

```bash
# Test video loading performance
curl -w "@curl-format.txt" -o /dev/null -s "https://yourcdn.com/video/hero-optimized.mp4"

# Test different connection speeds (Chrome DevTools)
# Network tab > Throttling > Slow 3G, Fast 3G, etc.

# Lighthouse performance audit
npx lighthouse https://yourdomain.com --only-categories=performance
```

This guide ensures optimal video delivery while maintaining performance and controlling costs.
