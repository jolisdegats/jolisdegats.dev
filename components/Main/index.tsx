'use client'

import dynamic from 'next/dynamic';

const Background = dynamic(() => import('@/components/Main/Background'), {
  loading: () => <div className="w-full h-screen bg-bg-dark" />,
  ssr: false
});

const ImageComponents = {
  Radio: dynamic(() => import('@/components/Main/Radio').then(mod => ({ default: mod.ImageRadio })), { ssr: false }),
  Phone: dynamic(() => import('@/components/Main/Phone').then(mod => ({ default: mod.ImagePhone })), { ssr: false }),
  Light: dynamic(() => import('@/components/Main/Light').then(mod => ({ default: mod.ImageLight })), { ssr: false }),
};

const MarkerComponents = {
  Radio: dynamic(() => import('@/components/Main/Radio').then(mod => ({ default: mod.MarkerRadio })), { ssr: false }),
  Phone: dynamic(() => import('@/components/Main/Phone').then(mod => ({ default: mod.MarkerPhone })), { ssr: false }),
  Light: dynamic(() => import('@/components/Main/Light').then(mod => ({ default: mod.MarkerLight })), { ssr: false }),
  Coffee: dynamic(() => import('@/components/Main/Coffee').then(mod => ({ default: mod.MarkerCoffee })), { ssr: false }),
  Flowers: dynamic(() => import('@/components/Main/Flowers'), { ssr: false }),
  Me: dynamic(() => import('@/components/Main/Me').then(mod => ({ default: mod.MarkerMe })), { ssr: false }),
  Cat: dynamic(() => import('@/components/Main/Cat').then(mod => ({ default: mod.MarkerCat })), { ssr: false }),
  Computer: dynamic(() => import('@/components/Main/Computer'),{ ssr: false }),
  Bookshelf: dynamic(() => import('@/components/Main/Bookshelf').then(mod => ({ default: mod.MarkerBookshelf })), { ssr: false }),
};

const Main = () => {

  return (
    <>
      <Background />
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
