'use client'

import { useState, useEffect, useRef } from 'react';
import Background from '@/components/Main/Background';
import { ImageRadio } from '@/components/Main/Radio';
import { ImagePhone } from '@/components/Main/Phone';
import { ImageLight } from '@/components/Main/Light';
import { MarkerRadio } from '@/components/Main/Radio';
import { MarkerPhone } from '@/components/Main/Phone';
import { MarkerLight } from '@/components/Main/Light';
import { MarkerCoffee } from '@/components/Main/Coffee';
import { MarkerFlowers } from '@/components/Main/Flowers';
import { MarkerMe } from '@/components/Main/Me';
import { MarkerCat } from '@/components/Main/Cat';
import { MarkerComputer } from '@/components/Main/Computer';
import { MarkerVideoGamesShelf } from '@/components/Main/VideoGamesShelf';

const ImageComponents = {
  Radio: ImageRadio,
  Phone: ImagePhone,
  Light: ImageLight,
};

const MarkerComponents = {
  Radio: MarkerRadio,
  Phone: MarkerPhone,
  Light: MarkerLight,
  Coffee: MarkerCoffee,
  Flowers: MarkerFlowers,
  Me: MarkerMe,
  Cat: MarkerCat,
  Computer: MarkerComputer,
  VideoGamesShelf: MarkerVideoGamesShelf,
};

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback: hide overlay after 5 seconds
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Loading overlay - non-blocking so LCP can be detected */}
      <div 
        className='fixed inset-0 z-[200] bg-bg-dark transition-opacity duration-500' 
        style={{ 
          opacity: isLoading ? 1 : 0.1,
          pointerEvents: 'none'
        }} 
      />
      
      <Background onLoadingComplete={() => setIsLoading(false)} />
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
    </>
  );
};

Main.displayName = 'Main';

export default Main;
