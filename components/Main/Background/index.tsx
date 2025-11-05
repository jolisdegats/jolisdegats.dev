"use client"

import Image from '@/components/UI/Image';
import { useMemo, useState, useEffect, useRef } from 'react';

import background from '@/assets/main-background.webp';
import gifCode from '@/assets/gif-code.webp';
import gifTyping from '@/assets/gif-typing2.webp';
import gifCat from '@/assets/gif-cat.webp';
import cloud1 from '@/assets/cloud1.webp';
import cloud2 from '@/assets/cloud2.webp';
import cloud3 from '@/assets/cloud3.webp';
import cloud4 from '@/assets/cloud4.webp';
import cloud5 from '@/assets/cloud5.webp';
import sea from '@/assets/sea.webp';
import seaclouds from '@/assets/seaclouds.webp';
import sky from '@/assets/sky.webp';


const getRandomDuration = () => {
  return Math.random() * 240 + 60;
}

const getRandomAnimationDelay = () => {
  return -Math.random() * (240 + 60);
}

interface BackgroundProps {
  onLoadingComplete?: () => void;
}

const Background = ({ onLoadingComplete }: BackgroundProps) => {
  const [, setIsLoading] = useState(true);
  const [cloudContainerRatio, setCloudContainerRatio] = useState(1);
  
  // Critical images that need to load before hiding the overlay
  const CRITICAL_IMAGES = ['background', 'gifCode', 'gifTyping', 'gifCat', 'seaclouds', 'cloud1', 'cloud2', 'cloud3', 'cloud4', 'cloud5', 'sea', 'sky'] as const;
  
  const loadedImagesRef = useRef<Record<(typeof CRITICAL_IMAGES)[number], boolean>>({
    background: false,
    gifCode: false,
    gifTyping: false,
    gifCat: false,
    seaclouds: false,
    cloud1: false,
    cloud2: false,
    cloud3: false,
    cloud4: false,
    cloud5: false,
    sea: false,
    sky: false,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleImageLoad = (imageId: (typeof CRITICAL_IMAGES)[number]) => {
    loadedImagesRef.current[imageId] = true;
    
    // Check if all critical images are loaded
    const allLoaded = CRITICAL_IMAGES.every(id => loadedImagesRef.current[id] === true);
    
    if (allLoaded) {
      setIsLoading(false);
      onLoadingComplete?.();
    }
  };

  // Calculate cloud container ratio on client side only
  useEffect(() => {
    const ratio = window.innerHeight / background.height;
    setCloudContainerRatio(ratio);
  }, []);

  // Fallback: hide overlay after 5 seconds even if images haven't loaded
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete?.();
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const cloudImages = useMemo(() => [cloud1, cloud2, cloud3, cloud4, cloud5], []);

  const cloudAnimations = useMemo(() =>
    cloudImages.map((cloud, index) => {
      const cloudId = `cloud${index + 1}` as const;
      return {
        key: cloud.src,
        href: cloud.src,
        width: cloud.width,
        height: cloud.height,
        id: cloudId,
        duration: getRandomDuration(),
        animationDelay: getRandomAnimationDelay(),
      };
    }), [cloudImages]);
  
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

     <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      {cloudAnimations.map(({ key, href, id, duration, animationDelay, width, height }) =>
      <div
        key={key}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${width * cloudContainerRatio}px`,
          height: `${height * cloudContainerRatio}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${animationDelay}s`,
        }}
        className="cloud-animation"
      >
        <Image
           priority 
           fetchPriority="high" 
          src={href}
          alt={id}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 640px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, 100vw"
          onLoad={() => handleImageLoad(id as (typeof CRITICAL_IMAGES)[number])}
        />
      </div>
    )}
  </div>

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