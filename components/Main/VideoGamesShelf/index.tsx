'use client';

import { useState, useEffect, useRef } from "react";
import { useVideoGamesShelfInput } from '@/components/Main/VideoGamesShelf/hooks/useVideoGamesShelfInput';
import { useVideoGamesAnimation } from '@/components/Main/VideoGamesShelf/hooks/useVideoGamesAnimation';
import { VideoGameItem } from '@/components/Main/VideoGamesShelf/VideoGameItem';
import { HintDisplay } from '@/components/Main/VideoGamesShelf/HintDisplay';
import { VIDEOGAMES_DATA } from '@/components/Main/VideoGamesShelf/videogamesData';
import Shape, { ShapeType } from "@/components/Main/Shape";
import { changeModal } from "@/lib/context";
import { useAppContext } from "@/lib/hooks";
import BubbleModal from "@/components/UI/Modal/BubbleModal";
import shelfImg from '@/assets/games/shelf.webp';
import Image from "@/components/UI/Image";
import {
  MODAL_SIZE,
  COVER_WIDTH,
  SPINE_WIDTH,
  VIDEOGAMES_TOP_POSITION,
  VIDEOGAMES_LEFT_POSITION,
  type AnimationPhase,
  IDLE_ANIMATION_PHASE,
} from "@/components/Main/VideoGamesShelf/constants";


const getCenterTranslationX = (index: number): number => {
  const firstBookCenter = (SPINE_WIDTH / 3*2 + COVER_WIDTH) / 2;
  const offsetPerBook = SPINE_WIDTH;
  const bookCenter = firstBookCenter + index * offsetPerBook + firstBookCenter/2;;
  return MODAL_SIZE/2 - bookCenter;
};

const VideoGamesShelfContent = () => {
  const [showHint, setShowHint] = useState(true);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const focusedIndexRef = useRef(-1);
  const lastFocusedIndexRef = useRef(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>(IDLE_ANIMATION_PHASE);

  useEffect(() => {
    hintTimeoutRef.current = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);


  const { handleBookClick } = useVideoGamesAnimation({
    focusedIndexRef,
    lastFocusedIndexRef,
    setAnimationPhase,
  });

  useVideoGamesShelfInput({
    videogamesLength: VIDEOGAMES_DATA.length,
    onBookClick: handleBookClick,
    focusedIndexRef,
    lastFocusedIndexRef,
    setHoveredIndex,
  });

  return (
    <>
    <div className="absolute inset-0 w-full h-full">
            <Image 
              placeholder='blur'
              src={shelfImg.src} 
              alt="Shelf" 
              fill
              className="object-cover"
              priority
              sizes={`(max-width: ${MODAL_SIZE}px) ${MODAL_SIZE}px, 100%`}
            />
    </div>
      <svg className="invisible absolute inset-0 pointer-events-none">
        <defs>
          <filter id="cover" x="0%" y="0%" width="100%" height="100%">
            <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1" result="diffLight">
              <feDistantLight azimuth="45" elevation="35" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>
      <div role="list" className="gap-0 justify-center w-full h-full absolute inset-0" 
      style={{ 
        display: "grid", 
        gridAutoFlow: "column", 
        gridAutoColumns: "auto", 
        justifyContent: "start", 
        alignItems: "start",
        top: `${VIDEOGAMES_TOP_POSITION}px`,
        left: `${VIDEOGAMES_LEFT_POSITION}px`,
        transform: "rotate(-1deg)",
        transformOrigin: "top left",
      }} 
        onClick={() => {
          if (focusedIndexRef.current !== -1) {
            handleBookClick(focusedIndexRef.current);
          }
        }}>
        {VIDEOGAMES_DATA.map((videogame, index) => (
          <VideoGameItem
            key={videogame.title}
            title={videogame.title}
            coverUrl={videogame.coverUrl}
            index={index}
            isFocused={focusedIndexRef.current === index}
            isHovered={hoveredIndex === index}
            animationPhase={animationPhase}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
            onClick={(e) => {
              e.stopPropagation();
              handleBookClick(index);
            }}
            getCenterTranslationX={getCenterTranslationX}
          />
        ))}
      </div>
      <HintDisplay isVisible={showHint} />
    </>
  );
};

export const MarkerVideoGamesShelf = () => {
  const { dispatch } = useAppContext();
  const modalPositionRef = useRef<{ x: number, y: number } | null>(null);

  const onClickVideoGamesShelf = (e: React.MouseEvent<HTMLElement>) => {
    modalPositionRef.current = { x: e.clientX, y: e.clientY };
    dispatch(changeModal({ name: "video-games-shelf" }));
  };

  const mainShape: ShapeType = {
    type: "polygon",
    onClick: onClickVideoGamesShelf,
    title: 'VideoGamesShelf',
    points: "427 1078 601 1044 598 1144 430 1220"
  };

  return <>
    <Shape shape={mainShape} index="video-games-shelf" />
    <BubbleModal 
      name="video-games-shelf"
      width={`${MODAL_SIZE}px`}
      height={`${MODAL_SIZE}px`}
      modalPositionRef={modalPositionRef}
    >
      <VideoGamesShelfContent />
    </BubbleModal>
  </>;
};
