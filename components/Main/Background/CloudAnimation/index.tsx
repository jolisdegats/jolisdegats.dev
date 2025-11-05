"use client"

import { useState, useEffect } from 'react';
import Image from '@/components/UI/Image';

import cloud1 from '@/assets/cloud1.webp';
import cloud2 from '@/assets/cloud2.webp';
import cloud3 from '@/assets/cloud3.webp';
import cloud4 from '@/assets/cloud4.webp';
import cloud5 from '@/assets/cloud5.webp';

const CLOUD_IMAGES = [cloud1, cloud2, cloud3, cloud4, cloud5] as const;
const CLOUD_COUNT = CLOUD_IMAGES.length;

const getRandomDuration = () => Math.random() * 240 + 60;
const getRandomAnimationDelay = () => -Math.random() * (240 + 60);

interface CloudAnimationProps {
  backgroundHeight: number;
  onLoad?: () => void;
}

interface CloudAnimationState {
  ratio: number;
  animations: Array<{ duration: number; delay: number }>;
}

const CloudAnimation = ({ onLoad, backgroundHeight }: CloudAnimationProps) => {
  const [state, setState] = useState<CloudAnimationState>(() => ({
    ratio: 1,
    animations: Array.from({ length: CLOUD_COUNT }, () => ({
      duration: 60,
      delay: 0,
    })),
  }));

  useEffect(() => {
    if (typeof window === 'undefined' || !backgroundHeight) return;

    const ratio = window.innerHeight / backgroundHeight;
    
    setState({
      ratio,
      animations: Array.from({ length: CLOUD_COUNT }, () => ({
        duration: getRandomDuration(),
        delay: getRandomAnimationDelay(),
      })),
    });
  }, [backgroundHeight]);

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden' 
      }}
    >
      {CLOUD_IMAGES.map((cloud, index) => {
        const cloudId = `cloud${index + 1}`;
        const { duration, delay } = state.animations[index] || { duration: 60, delay: 0 };
        
        return (
          <div
            key={cloudId}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${cloud.width * state.ratio}px`,
              height: `${cloud.height * state.ratio}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
            className="cloud-animation"
          >
            <Image
              priority 
              fetchPriority="high" 
              src={cloud}
              alt={cloudId}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 640px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, 100vw"
              onLoad={onLoad}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CloudAnimation;

