import Image, { StaticImageData } from 'next/image';
import { Suspense, useMemo, useState, useCallback, useEffect } from 'react';

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

interface LazyImageProps {
  src: string | StaticImageData;
  alt: string;
  unoptimized?: boolean;
  [key: string]: string | StaticImageData | boolean | undefined;
}

const getRandomDuration = () => {
  return Math.random() * 240 + 60;
}

const getRandomAnimationDelay = () => {
  return -Math.random() * (240 + 60);
}

const LazyImage = ({ src, alt, unoptimized, ...props }: LazyImageProps) => (
  <Image
    loading="lazy"
    src={src}
    alt={alt}
    unoptimized={unoptimized}
    {...props}
  />
);

const Background = ({onLoad}: {onLoad: (isLoading: boolean) => void}) => {
  const [imagesLoaded, setImagesLoaded] = useState({
    mainBg: false,
    gifCode: false,
    gifTyping: false,
  });
  const [hasNotified, setHasNotified] = useState(false);

  const cloudImages = useMemo(() => [cloud1, cloud2, cloud3, cloud4, cloud5], []);

  const cloudAnimations = useMemo(() => 
    cloudImages.map((cloud, index) => ({
      key: cloud.src,
      href: cloud.src,
      id: `cloud${index + 1}`,
      duration: getRandomDuration(),
      animationDelay: getRandomAnimationDelay(),
    })), [cloudImages]);

  // Check if all critical images have loaded
  const handleMainBgLoad = useCallback(() => {
    setImagesLoaded(prev => ({ ...prev, mainBg: true }));
  }, []);

  const handleGifCodeLoad = useCallback(() => {
    setImagesLoaded(prev => ({ ...prev, gifCode: true }));
  }, []);

  const handleGifTypingLoad = useCallback(() => {
    setImagesLoaded(prev => ({ ...prev, gifTyping: true }));
  }, []);

  useEffect(() => {
    if (imagesLoaded.mainBg && imagesLoaded.gifCode && imagesLoaded.gifTyping && !hasNotified) {
      onLoad(false);
      setHasNotified(true);
    }
  }, [imagesLoaded.mainBg, imagesLoaded.gifCode, imagesLoaded.gifTyping, hasNotified, onLoad]);

  return (
    <div className='z-[-10] absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-500' 
         style={{ opacity: imagesLoaded.mainBg && imagesLoaded.gifCode && imagesLoaded.gifTyping ? 1 : 0 }}>
      <Image 
        priority 
        src={sky} 
        alt="sky" 
        fill 
        className='object-cover'
      />
      <Image 
        priority 
        src={sea} 
        alt="sea" 
        fill 
        className='object-cover'
      />
      <Image 
        priority 
        src={seaclouds} 
        alt="seaclouds" 
        fill 
        className='object-cover'
      />


      <svg 
        width="100%" 
        height="100%" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0,
        }}
      >
        <Suspense fallback={null}>
          {cloudAnimations.map(({ key, href, id, duration, animationDelay }) => (
            <image
              key={key}
              href={href}
              id={id}
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              className="cloud-animation"
              style={{
                animationDuration: `${duration}s`,
                animationDelay: `${animationDelay}s`,
              } as React.CSSProperties}
            />
          ))}
        </Suspense>
      </svg>

      <Image 
        placeholder='blur' 
        priority 
        src={imageUrl} 
        alt="main background" 
        fill 
        className='object-cover' 
        onLoad={handleMainBgLoad}
        sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 100vw"
      />

      <Image 
        priority
        src={gifCode} 
        alt="code animation" 
        fill 
        className='object-cover'
        unoptimized={true}
        onLoad={handleGifCodeLoad}
      />
      <Image 
        priority
        src={gifTyping} 
        alt="typing animation" 
        fill 
        className='object-cover'
        unoptimized={true}
        onLoad={handleGifTypingLoad}
      />
     
    </div>
  );
}

export default Background;