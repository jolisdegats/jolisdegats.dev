'use client'
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, useCallback } from 'react';

const Background = dynamic(() => import('@/components/BackgroundImage/Background'), {
  loading: () => <div className="w-full h-screen bg-bg-dark" />,
  ssr: false
});

const ImageComponents = {
  Cat: dynamic(() => import('@/components/BackgroundImage/Cat').then(mod => ({ default: mod.ImageCat }))),
  Radio: dynamic(() => import('@/components/BackgroundImage/Radio').then(mod => ({ default: mod.ImageRadio })), { ssr: false }),
  Phone: dynamic(() => import('@/components/BackgroundImage/Phone').then(mod => ({ default: mod.ImagePhone })), { ssr: false }),
  Light: dynamic(() => import('@/components/BackgroundImage/Light').then(mod => ({ default: mod.ImageLight })), { ssr: false }),
};

const MarkerComponents = {
  Radio: dynamic(() => import('@/components/BackgroundImage/Radio').then(mod => ({ default: mod.MarkerRadio })), { ssr: false }),
  Phone: dynamic(() => import('@/components/BackgroundImage/Phone').then(mod => ({ default: mod.MarkerPhone })), { ssr: false }),
  Light: dynamic(() => import('@/components/BackgroundImage/Light').then(mod => ({ default: mod.MarkerLight })), { ssr: false }),
  Coffee: dynamic(() => import('@/components/BackgroundImage/Coffee').then(mod => ({ default: mod.MarkerCoffee })), { ssr: false }),
  Flowers: dynamic(() => import('@/components/BackgroundImage/Flowers'), { ssr: false }),
  Me: dynamic(() => import('@/components/BackgroundImage/Me').then(mod => ({ default: mod.MarkerMe })), { ssr: false }),
  Cat: dynamic(() => import('@/components/BackgroundImage/Cat').then(mod => ({ default: mod.MarkerCat })), { ssr: false }),
  Computer: dynamic(() => import('@/components/BackgroundImage/Computer'),{ ssr: false }),
  VideoGamesShelf: dynamic(() => import('@/components/BackgroundImage/VideoGamesShelf').then(mod => ({ default: mod.MarkerVideoGamesShelf })), { ssr: false }),
};

const BackgroundImage = () => {
  const [isBgLoading, setIsBgLoading] = useState(true);
  const loadedImagesRef = useRef({ mainBg: false, gifCode: false, gifTyping: false });
  const notifiedRef = useRef(false);

  const handleImageLoad = useCallback((imageId: 'mainBg' | 'gifCode' | 'gifTyping') => {
    loadedImagesRef.current[imageId] = true;
    const allLoaded = Object.values(loadedImagesRef.current).every(v => v);
    if (allLoaded && !notifiedRef.current) {
      setIsBgLoading(false);
      notifiedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!notifiedRef.current) {
        setIsBgLoading(false);
        notifiedRef.current = true;
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Background onImageLoad={handleImageLoad} />
      <div id="bubble-portal"/>
            {Object.entries(ImageComponents).map(([key, Component]) => (
              <Component key={key} />
            ))}
            <svg
              className="absolute top-0 left-0 w-full h-full"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              viewBox="0 0 2688 1792"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <style>
                {`
                  .image-mapper-shape {
                    fill: rgba(0, 0, 0, 0);
                  }
                `}
              </style>
              {/* Markers */}
              {Object.entries(MarkerComponents).map(([key, Component]) => (
                <Component key={key} />
              ))}
            </svg>

            <div className='z-[100] absolute inset-0 bg-bg-dark transition-opacity duration-500 pointer-events-none' 
            style={{ 
              opacity: isBgLoading ? 1 : 0, 
              pointerEvents: isBgLoading ? 'auto' : 'none' 
              }} /> 
    </>
  );
};

BackgroundImage.displayName = 'BackgroundImage';

export default BackgroundImage;
