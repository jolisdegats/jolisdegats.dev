import { useState, useEffect, useRef } from 'react';
import { audioContextManager } from '@/lib/context/audioContext';

interface SoundEffect {
  play: (delay?: number) => void;
  stop: () => void;
  load: () => void;
  fade: (startVolume: number, endVolume: number, duration?: number) => void;
  isLoaded: boolean;
}

export const useSoundEffect = (soundPath: string, options: { volume?: number; preload?: boolean; interrupt?: boolean, delay?: number } = {}): SoundEffect => {
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeDurationRef = useRef<number>(0);
  const shouldFadeRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        isMountedRef.current = true;
        audioRef.current = new Audio();
        audioRef.current.volume = options.volume || 1;
        
        const handleCanPlayThrough = () => {
          if (isMountedRef.current) {
            setIsLoaded(true);
          }
        };
        
        const handleEnded = () => {
          if (isMountedRef.current) {
            isPlayingRef.current = false;
          }
        };
        
        const handleError = (e: Event) => {
          if (isMountedRef.current) {
            console.error('Error loading audio:', soundPath, e);
            isPlayingRef.current = false;
          }
        };
        
        audioRef.current?.addEventListener('canplaythrough', handleCanPlayThrough);
        audioRef.current?.addEventListener('ended', handleEnded);
        audioRef.current?.addEventListener('error', handleError);
        
        if (options.preload) {
          audioRef.current.src = soundPath;
          audioRef.current.load();
        }
        
        return () => {
          isMountedRef.current = false;
          
          // Remove event listeners
          if (audioRef.current) {
            audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
            audioRef.current.removeEventListener('ended', handleEnded);
            audioRef.current.removeEventListener('error', handleError);
            
            // Stop any playing audio
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = '';
            audioRef.current.load();
          }
          
          // Clear all intervals and timeouts
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
          
          if (playTimeoutRef.current) {
            clearTimeout(playTimeoutRef.current);
            playTimeoutRef.current = null;
          }
          
          if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
          }
          
          // Reset state
          isPlayingRef.current = false;
          shouldFadeRef.current = false;
        };
      } catch (e) {
        console.error('Audio API not supported:', e);
      }
    }
  }, [soundPath, options.volume, options.preload]);

  const load = () => {
    if (audioRef.current && !isLoaded && isMountedRef.current) {
      audioRef.current.src = soundPath;
      audioRef.current.load();
    }
  };

  const fade = (startVolume: number, endVolume: number, duration: number = 1000) => {
    if (!audioRef.current || !isMountedRef.current) return;
    
    fadeDurationRef.current = duration;
    shouldFadeRef.current = true;
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    
    // Set the initial volume
    audioRef.current.volume = startVolume;
    
    const volumeDiff = endVolume - startVolume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = volumeDiff / steps;
    
    let currentStep = 0;
    
    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current || !isMountedRef.current) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        return;
      }
      
      currentStep++;
      
      if (currentStep >= steps) {
        audioRef.current.volume = endVolume;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      } else {
        audioRef.current.volume = startVolume + (volumeStep * currentStep);
      }
    }, stepDuration);
  };

  const play = async (delay?: number) => {
    if (!audioRef.current || !isMountedRef.current) return;
    
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
    }
    
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    
    if (!isLoaded) {
      load();
    }
    
    if (options.interrupt && isPlayingRef.current) {
      stop();
    }
    
    // Wait for audio context to be unlocked
    try {
      await audioContextManager.waitForUnlock();
    } catch (error) {
      // Silently fail if audio context can't be unlocked
      console.warn('Audio context not available:', error);
      return;
    }
    
    // Use the provided delay or fall back to the option
    const effectiveDelay = delay !== undefined ? delay : options.delay;
    
    const playAudio = async () => {
      if (!audioRef.current || !isMountedRef.current) return;
      
      audioRef.current.currentTime = 0;
      
      try {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          if (isMountedRef.current) {
            isPlayingRef.current = true;
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError' && isMountedRef.current) {
          // Only log if it's not an abort error and still mounted
          console.warn('Audio play failed:', error.message);
        }
        if (isMountedRef.current) {
          isPlayingRef.current = false;
        }
      }
    };
    
    // Apply delay if specified
    if (effectiveDelay && effectiveDelay > 0) {
      playTimeoutRef.current = setTimeout(() => {
        playAudio();
      }, effectiveDelay);
    } else {
      // Play immediately if no delay
      playAudio();
    }
  };

  const stop = () => {
    if (!audioRef.current || !isMountedRef.current) return;
    
    // Clear any pending play timeout (for delayed playback)
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    
    if (options.interrupt || !shouldFadeRef.current) {
      // Stop immediately if interrupt is enabled or if fade was never called
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
    } else if (shouldFadeRef.current && audioRef.current.volume > 0) {
      // Only fade if fade was explicitly called and volume is not already 0
      const startVolume = audioRef.current.volume;
      const steps = 20;
      const stepDuration = fadeDurationRef.current / steps;
      const volumeStep = startVolume / steps;
      
      let currentStep = 0;
      
      fadeIntervalRef.current = setInterval(() => {
        if (!audioRef.current || !isMountedRef.current) {
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
          return;
        }
        
        currentStep++;
        
        if (currentStep >= steps) {
          audioRef.current.volume = 0;
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          isPlayingRef.current = false;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        } else {
          audioRef.current.volume = startVolume - (volumeStep * currentStep);
        }
      }, stepDuration);
    } else {
      // If no fade needed, just stop immediately
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
    }
  };

  return {
    play,
    stop,
    load,
    fade,
    isLoaded,
  };
}; 