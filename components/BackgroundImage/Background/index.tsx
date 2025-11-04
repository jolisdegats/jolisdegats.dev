'use client';

import Image from '@/components/UI/Image';
import { useMemo } from 'react';

import imageUrl from '@/assets/main-background.webp';
import gifCode from '@/assets/gif-code.webp';
import gifTyping from '@/assets/gif-typing2.webp';
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

const Background = () => {
  const cloudImages = useMemo(() => [cloud1, cloud2, cloud3, cloud4, cloud5], []);

  const cloudAnimations = useMemo(() =>
    cloudImages.map((cloud, index) => ({
      key: cloud.src,
      href: cloud.src,
      width: cloud.width,
      height: cloud.height,
      id: `cloud${index + 1}`,
      duration: getRandomDuration(),
      animationDelay: getRandomAnimationDelay(),
    })), [cloudImages]);

  const cloudContainerRatio = useMemo(() => window.innerHeight / imageUrl.height, []);
  return (
    <div className='z-[-10] absolute top-0 left-0 w-full h-full'>
      <Image 
        priority
        fetchPriority="high" 
        src={sky} 
        alt="sky" 
        fill 
        className='object-cover'
        sizes="100vw"
      />
      
      <Image 
        priority 
        fetchPriority="high" 
        src={sea} 
        alt="sea" 
        fill 
        className='object-cover'
        sizes="100vw"
      />
      
      <Image 
         priority 
         fetchPriority="high" 
        src={seaclouds} 
        alt="seaclouds" 
        fill 
        className='object-cover'
        sizes="100vw"
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
          sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 100vw"
        />
      </div>
    )}
  </div>

      <Image 
        placeholder='blur' 
        priority 
        fetchPriority="high" 
        src={imageUrl} 
        alt="main background" 
        fill 
        className='object-cover'
        sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 100vw"
      />

      <Image 
         priority 
         fetchPriority="high" 
        src={gifCode} 
        alt="code animation" 
        unoptimized
        fill 
        className='object-cover'
        sizes="100vw"
      />
      
      <Image 
         priority 
         fetchPriority="high" 
        src={gifTyping}
        unoptimized
        alt="typing animation" 
        fill 
        className='object-cover'
        sizes="100vw"
      />
    </div>
  );
}

export default Background;