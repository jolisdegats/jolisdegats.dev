import Image, { StaticImageData } from 'next/image';
import { Suspense, useMemo } from 'react';

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
  [key: string]: any;
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

  const cloudImages = useMemo(() => [cloud1, cloud2, cloud3, cloud4, cloud5], []);

  const cloudAnimations = useMemo(() => 
    cloudImages.map((cloud, index) => ({
      key: cloud.src,
      href: cloud.src,
      id: `cloud${index + 1}`,
      duration: getRandomDuration(),
      animationDelay: getRandomAnimationDelay(),
    })), [cloudImages]);

  return (
    <div className='z-[-10] absolute top-0 left-0 w-full h-full'>
      {/* Critical images with priority loading */}
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

      {/* Animated clouds */}
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

      {/* Main background image - Desktop */}
      <Image 
        placeholder='blur' 
        priority 
        src={imageUrl} 
        alt="imageUrl" 
        fill 
        className='object-cover' 
        onLoad={() => onLoad(false)}
        sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 100vw"
      />

<LazyImage 
        src={gifCode} 
        alt="gifCode" 
        fill 
        className='object-cover'
        unoptimized={true}
      />
<LazyImage 
        src={gifTyping} 
        alt="gifTyping" 
        fill 
        className='object-cover'
        unoptimized={true}
      />
 
     
    </div>
  );
}

export default Background;