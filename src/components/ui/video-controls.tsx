import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react';

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  isMuted: boolean;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  className?: string;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  videoRef,
  isPlaying,
  isMuted,
  onPlayPause,
  onMuteToggle,
  className = ''
}) => {
  const [showControls, setShowControls] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleQualityChange = (quality: 'high' | 'medium' | 'low') => {
    // Implementation for quality switching
    console.log('Quality changed to:', quality);
    setShowSettings(false);
  };

  return (
    <motion.div
      className={`absolute bottom-4 right-4 z-20 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: showControls ? 1 : 0 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false);
        setShowSettings(false);
      }}
    >
      <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
        {/* Play/Pause Button */}
        <button
          onClick={onPlayPause}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={onMuteToggle}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Settings Button */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Video settings"
          >
            <Settings className="w-4 h-4 text-white" />
          </button>

          {/* Settings Menu */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 min-w-[120px]"
              >
                <div className="text-white text-sm font-medium mb-2">Quality</div>
                <div className="space-y-1">
                  {['high', 'medium', 'low'].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => handleQualityChange(quality as any)}
                      className="block w-full text-left px-2 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm capitalize"
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Accessibility Notice */}
      <div className="mt-2 text-xs text-white/60 text-center">
        Press ESC to pause video
      </div>
    </motion.div>
  );
};

export default VideoControls;
