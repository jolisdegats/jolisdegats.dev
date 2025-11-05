"use client"

import Image from '@/components/UI/Image';
import { useState, useEffect, useRef } from 'react';
import CloudAnimation from './CloudAnimation';

import background from '@/assets/main-background.webp';
import gifCode from '@/assets/gif-code.webp';
import gifTyping from '@/assets/gif-typing2.webp';
import gifCat from '@/assets/gif-cat.webp';

import sea from '@/assets/sea.webp';
import seaclouds from '@/assets/seaclouds.webp';
import sky from '@/assets/sky.webp';


interface BackgroundProps {
  onLoadingComplete?: () => void;
}

  // Critical images
  const CRITICAL_IMAGES = ['background', 'gifCode', 'gifTyping', 'gifCat', 'seaclouds', 'cloudAnimation', 'sea', 'sky'] as const;


const Background = ({ onLoadingComplete }: BackgroundProps) => {
  const [, setIsLoading] = useState(true);
  
  const loadedImagesRef = useRef<Record<(typeof CRITICAL_IMAGES)[number], boolean>>({
    background: false,
    gifCode: false,
    gifTyping: false,
    gifCat: false,
    seaclouds: false,
    cloudAnimation: false,
    sea: false,
    sky: false,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleImageLoad = (imageId: (typeof CRITICAL_IMAGES)[number]) => {
    loadedImagesRef.current[imageId] = true;
    const allLoaded = CRITICAL_IMAGES.every(id => loadedImagesRef.current[id] === true);
    if (allLoaded) {
      setIsLoading(false);
      onLoadingComplete?.();
    }
  };

  // Fallback: hide overlay after 4 seconds even if images haven't loaded
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete?.();
    }, 4000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onLoadingComplete]);

  
  return (
    <div className='z-[-10] absolute top-0 left-0 w-full h-full'>
      <Image 
        priority
        fetchPriority="high" 
        src={sky} 
        alt="sky" 
        fill 
        className='object-cover'
        sizes="(max-width: 640px) 640px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, 100vw"
        onLoad={() => handleImageLoad('sky')}
      />
      
      <Image 
        priority 
        fetchPriority="high" 
        src={sea} 
        alt="sea" 
        fill 
        className='object-cover'
        sizes="(max-width: 640px) 640px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, 100vw"
        onLoad={() => handleImageLoad('sea')}
      />
      
      <Image 
         priority 
         fetchPriority="high" 
        src={seaclouds} 
        alt="seaclouds" 
        fill 
        className='object-cover'
        sizes="(max-width: 640px) 640px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, 100vw"
        onLoad={() => handleImageLoad('seaclouds')}
      />

      <CloudAnimation 
      backgroundHeight={background.height} 
      onLoad={() => handleImageLoad('cloudAnimation')}/>

      <Image 
        placeholder='blur' 
        priority 
        fetchPriority="high" 
        src={background} 
        alt="main background" 
        fill 
        className='object-cover'
        sizes="(max-width: 640px) 640px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, 100vw"
        onLoad={() => handleImageLoad('background')}
      />

      <Image 
         priority 
         fetchPriority="high" 
        src={gifCode} 
        alt="code animation" 
        fill 
        className='object-cover'
        unoptimized
        sizes="(max-width: 640px) 640px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, 100vw"
        onLoad={() => handleImageLoad('gifCode')}
      />
      
      <Image 
         priority 
         fetchPriority="high" 
        src={gifTyping}
        alt="typing animation" 
        fill 
        className='object-cover'
        unoptimized
        sizes="(max-width: 640px) 640px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, 100vw"
        onLoad={() => handleImageLoad('gifTyping')}
      />
      <Image 
         priority 
         fetchPriority="high" 
        src={gifCat}
        alt="cat animation" 
        fill 
        className='object-cover'
        unoptimized
        sizes="(max-width: 640px) 640px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, 100vw"
        onLoad={() => handleImageLoad('gifCat')}
      />
    </div>
  );
}

export default Background;