'use client';

import { useState, useEffect, useRef } from "react";
import Shape, { ShapeType } from "@/components/BackgroundImage/Shape";
import { changeModal } from "@/lib/context";
import { useAppContext } from "@/lib/hooks";
import BubbleModal from "@/components/UI/Modal/BubbleModal";
import shelfImg from './images/shelf.png';
import Image from "next/image";
import BrokenSword from './images/brokensword.png';
import Pharaon from './images/pharaon.png';
import ToTheMoon from './images/tothemoon.png';
import Zelda from './images/zelda.png';
import BelleEtLaBete from './images/belleetlabete.jpg';
import TkkGSurLaPisteDesFauxMonnayeurs from './images/tkkg.jpg';
import LesSims from './images/thesims.png';
import DigimonWorld from './images/digimonworld.png';
import RollerCoasterTycoon from './images/zelda.png';
import MonsterHunter from './images/monsterhunter.png';
import Syberia from './images/syberia.png';
import DreamfallTheLongestJourney from './images/dreamfallthelongestjourney.png';
import Uncharted from './images/uncharted.png';
import HeroesOfTheStorm from './images/heroesofthestorm.png';
import DetroitBecomeHuman from './images/detroitbecomehuman.png';
import HeavyRain from './images/heavyrain.png';
import Expedition33 from './images/clairobscurexpedition33.png';
import Spine from './images/spine.png';
import CoverOverlay from './images/coveroverlay.png';

const MODAL_SIZE = 400;
const BOOKS_LEFT_POSITION = 38;
const BOOKS_TOP_POSITION = 72;

const COVER_HEIGHT = MODAL_SIZE/2;
const COVER_WIDTH = COVER_HEIGHT/3*2;
const SPINE_WIDTH = 18;
const NEGATIVE_MARGIN = COVER_WIDTH;


// Helper function to calculate book center position on shelf
const getBookShelfPosition = (index: number): number => {
  const firstBookCenter = (SPINE_WIDTH / 3*2 + COVER_WIDTH) / 2;
  const offsetPerBook = SPINE_WIDTH;
  // const correction = index * 3;
  return firstBookCenter + index * offsetPerBook + firstBookCenter/2;
};

// Helper function to calculate translation to center the focused book
const getCenterTranslationX = (index: number): number => {
  const bookCenter = getBookShelfPosition(index);
  return MODAL_SIZE/2 - bookCenter;
};

// Animation timings (in ms)
const UNFOCUS_PHASE_1_DURATION = 300; 
const UNFOCUS_PHASE_2_DURATION = 300;
const FOCUS_ROTATION_DELAY = 200;
const FOCUS_ROTATION_DURATION = 400;

interface IBook {
  title: string;
  coverUrl: string;
}

const books: IBook[] = [
  {
    title: "La Belle et la Bête",
    coverUrl: BelleEtLaBete.src,
  },
  {
    title: "Zelda : A link to the Past",
    coverUrl: Zelda.src,
  },
  {
    title: "TKKG : Sur la piste des faux-monnayeurs",
    coverUrl: TkkGSurLaPisteDesFauxMonnayeurs.src,
  },
  {
    title: "Les Sims",
    coverUrl: LesSims.src,
  },
  {
    title: "Digimon World",
    coverUrl: DigimonWorld.src,
  },
  {
    title: "RollerCoaster Tycoon",
    coverUrl: RollerCoasterTycoon.src,
  },
  {
    title: "Monster Hunter",
    coverUrl: MonsterHunter.src,
  },
  {
    title: "Les Chevaliers de Baphomet : Le Manuscrit de Voynich",
    coverUrl: BrokenSword.src,
  },
  {
    title: "Pharaon",
    coverUrl: Pharaon.src,
  },
  {
    title: "Syberia",
    coverUrl: Syberia.src,
  },
  {
    title: "Uncharted",
    coverUrl: Uncharted.src,
  },
  {
    title: "Dreamfall : The Longest Journey",
    coverUrl: DreamfallTheLongestJourney.src,
  },
  {
    title: "Heavy Rain",
    coverUrl: HeavyRain.src,
  },
  {
    title: "To the Moon",
    coverUrl: ToTheMoon.src,
  },
  {
    title: "Heroes of the Storm",
    coverUrl: HeroesOfTheStorm.src,
  },
  {
    title: "Detroit : Become Human",
    coverUrl: DetroitBecomeHuman.src,
  },
  {
    title: "Clair Obscur : Expedition 33",
    coverUrl: Expedition33.src,
  },
];

type AnimationPhase = 'idle' | 'taking-out' | 'rotating-while-taking-out' | 'centering' | 'unfocusing-rotate-and-translate' | 'translate-back-to-shelf';

const BookshelfContent = () => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingClickRef = useRef<number | null>(null);
  const focusedIndexRef = useRef(-1);
  const animationPhaseRef = useRef<AnimationPhase>('idle');

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    focusedIndexRef.current = focusedIndex;
  }, [focusedIndex]);

  useEffect(() => {
    animationPhaseRef.current = animationPhase;
  }, [animationPhase]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let nextIndex = -1;
      
      if (focusedIndex === -1) {
        // No book focused: right arrow opens first, left arrow opens last
        if (e.key === 'ArrowRight') {
          nextIndex = 0;
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          nextIndex = books.length - 1;
          e.preventDefault();
        }
      } else {
        // Book is focused: navigate between books or close
        if (e.key === 'ArrowLeft') {
          if (focusedIndex > 0) {
            nextIndex = focusedIndex - 1;
            e.preventDefault();
          } else {
            // On first book: unfocus instead of wrapping
            handleBookClick(focusedIndex);
            e.preventDefault();
            return;
          }
        } else if (e.key === 'ArrowRight') {
          if (focusedIndex < books.length - 1) {
            nextIndex = focusedIndex + 1;
            e.preventDefault();
          } else {
            // On last book: unfocus instead of wrapping
            handleBookClick(focusedIndex);
            e.preventDefault();
            return;
          }
        } else if (e.key === 'Escape') {
          handleBookClick(focusedIndex);
          e.preventDefault();
          return;
        }
      }

      if (nextIndex !== -1) {
        handleBookClick(nextIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex]);

  const handleBookClick = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (focusedIndexRef.current === index) {
      // Start unfocusing animation sequence
      // Phase 1: Translate back to shelf position (left + up) while rotating back
      setAnimationPhase('unfocusing-rotate-and-translate');
      timeoutRef.current = setTimeout(() => {
        // Phase 2: Stay at shelf position (no more translation)
        setAnimationPhase('translate-back-to-shelf');
        // Immediately set focusedIndex to -1 so pending clicks see correct state
        setFocusedIndex(-1);
        // After phase 1 completes, process any pending click
        if (pendingClickRef.current !== null) {
          const pendingIndex = pendingClickRef.current;
          pendingClickRef.current = null;
          // Use small delay to allow state updates to process
          setTimeout(() => {
            handleBookClick(pendingIndex);
          }, 10);
        }
        timeoutRef.current = setTimeout(() => {
          setAnimationPhase('idle');
        }, UNFOCUS_PHASE_2_DURATION);
      }, UNFOCUS_PHASE_1_DURATION);
    } else {
      // If a different book is focused and we're trying to focus this one,
      // first queue it to unfocus the current one
      if (focusedIndexRef.current !== -1 && focusedIndexRef.current !== index) {
        pendingClickRef.current = index;
        // Trigger unfocus of current focused book
        handleBookClick(focusedIndexRef.current);
        return;
      }

      // Start focusing animation sequence
      // Phase 1: Take book out (translate down + left) for 400ms
      setAnimationPhase('taking-out');
      // Delay focusedIndex change slightly to allow transform transition to start
      timeoutRef.current = setTimeout(() => {
        setFocusedIndex(index);
        // Phase 2: At 200ms, start rotating while still translating
        timeoutRef.current = setTimeout(() => {
          setAnimationPhase('rotating-while-taking-out');
          // Phase 3: After 400ms total, translate to center
          timeoutRef.current = setTimeout(() => {
            setAnimationPhase('centering');
          }, FOCUS_ROTATION_DELAY);
        }, FOCUS_ROTATION_DELAY);
      }, 0);
    }
  };

  return (
    <>
    <div className="absolute inset-0 w-full h-full">
            <Image 
              src={shelfImg.src} 
            alt="Shelf" 
            fill
            className="object-cover"
            priority
            unoptimized
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
        top: `${BOOKS_TOP_POSITION}px`,
        left: `${BOOKS_LEFT_POSITION}px`,
        transform: "rotate(-1deg)",
        transformOrigin: "top left",
      }} 
        onClick={() => {
          if (focusedIndex !== -1) {
            handleBookClick(focusedIndex);
          }
        }}>
        {books.map((book, index) => (
    <button
            role="listitem"
            key={book.title}
            onClick={(e) => {
              e.stopPropagation();
              handleBookClick(index);
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
            className={`flex shrink-0 flex-row items-end outline-none ${
              focusedIndex === index ? "basis-60" : "basis-0"
            }`}
      style={{
                perspective: "1000px", 
                WebkitPerspective: "1000px", 
                marginRight: `-${NEGATIVE_MARGIN}px`, 
                zIndex: focusedIndex === index ? 20 : 0,
                transitionProperty: "transform", 
                transitionDuration: (animationPhase === 'unfocusing-rotate-and-translate' || animationPhase === 'translate-back-to-shelf') ? `${UNFOCUS_PHASE_1_DURATION}ms` : "0.4s", 
                transitionTimingFunction: "ease-in-out", 
                transitionDelay: "0s",
                willChange: "transform",
                pointerEvents: focusedIndex === index ? "none" : "auto",
                transform: 
                  focusedIndex === index && (animationPhase === 'taking-out' || animationPhase === 'rotating-while-taking-out')
                    ? `translateY(20px) translateX(-30px)`
                    : focusedIndex === index && animationPhase === 'centering'
                    ? `translateY(30px) translateX(${getCenterTranslationX(index)}px)`
                    : focusedIndex === index && animationPhase === 'unfocusing-rotate-and-translate'
                    ? `translateY(20px) translateX(-30px)`
                    : animationPhase === 'translate-back-to-shelf'
                    ? `translateY(0) translateX(0)`
                    : hoveredIndex === index && focusedIndex !== index && pendingClickRef.current !== index
                    ? `translateY(5px) translateX(-4px)`
                    : `translateY(0) translateX(0)`,
                }}
          >
            {/* Book Spine */}
            <div
              className={`z-50 shrink-0 origin-right brightness-[0.80] contrast-[2.00] flex items-center justify-center cursor-pointer`}
        style={{
                width: `${SPINE_WIDTH}px`,
                height: `${COVER_HEIGHT}px`,
                boxSizing: "border-box",
                transformStyle: "preserve-3d",
                transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(${
                  focusedIndex === index && animationPhase === 'unfocusing-rotate-and-translate' ? "0deg" : (focusedIndex === index && (animationPhase === 'rotating-while-taking-out' || animationPhase === 'centering')) ? "-60deg" : "0deg"
                }) rotateZ(0deg) skew(0deg, 0deg)`,
                transitionProperty: "transform",
                transitionDuration: (animationPhase === 'rotating-while-taking-out') ? `${FOCUS_ROTATION_DURATION}ms` : (animationPhase === 'unfocusing-rotate-and-translate') ? `${UNFOCUS_PHASE_1_DURATION}ms` : "0s",
                transitionTimingFunction: "ease-in-out",
                transitionDelay: "0s",
                pointerEvents: "auto",
                zIndex: 50,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setHoveredIndex(-1);
                handleBookClick(index);
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `url(${Spine.src})`, backgroundSize: "100% 100%", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}></div>
             
              <span
                aria-hidden
                className="pointer-events-none fixed top-0 left-0 z-50 h-full w-full opacity-40 [filter:url(#cover)]"
              />
              {/* <h2 className="text-md m-auto text-xs mt-0" style={{ writingMode: "vertical-lr" }}>
                {book.title}
              </h2> */}
        </div>

            {/* Book Cover */}
            <div
              className={`relative z-10 shrink-0 origin-left overflow-hidden border-gray-900 brightness-[0.80] contrast-[2.00] cursor-pointer`}
              style={{
                borderRadius: "0 5px 5px 0",
                transformStyle: "preserve-3d",
                transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(${
                  focusedIndex === index && animationPhase === 'unfocusing-rotate-and-translate' ? "90deg" : (focusedIndex === index && (animationPhase === 'rotating-while-taking-out' || animationPhase === 'centering')) ? "20deg" : "90deg"
                }) rotateZ(0deg) skew(0deg, 0deg)`,
                pointerEvents: "auto",
                height: `${COVER_HEIGHT}px`,
                transitionProperty: "transform",
                transitionDuration: (animationPhase === 'rotating-while-taking-out') ? `${FOCUS_ROTATION_DURATION}ms` : (animationPhase === 'unfocusing-rotate-and-translate') ? `${UNFOCUS_PHASE_1_DURATION}ms` : "0s",
                transitionTimingFunction: "ease-in-out",
                transitionDelay: "0s",
              } as any}
              onClick={(e) => {
                e.stopPropagation();
                setHoveredIndex(-1);
                handleBookClick(index);
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none fixed top-0 right-0 z-50 h-full w-full opacity-40 [filter:url(#cover)]"
              />
              {/* <span
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 z-40 h-full w-full"
                style={{
                  background: `radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 70%)`,
                }}
              /> */}
              <img src={book.coverUrl} alt={book.title} className={`h-full bg-cover`} style={{ width: `${COVER_WIDTH}px`, padding: "12px 8px", paddingTop: "14px", filter: focusedIndex === index ? "brightness(100%)" : hoveredIndex === index ? "brightness(70%)" : "brightness(40%)", transition: "filter 0.3s ease-in-out"}} />
              <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `url(${CoverOverlay.src})`, backgroundSize: "100% 100%", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}></div>
            
      </div>
    </button>
        ))}
      </div>
    </>
  );
};

export const MarkerBookshelf = () => {
  const { dispatch } = useAppContext();
  const [modalPosition, setModalPosition] = useState<{ x: number, y: number } | null>(null);

  const onClickBookshelf = (e: React.MouseEvent<HTMLElement>) => {
    setModalPosition({ x: e.clientX, y: e.clientY });
    dispatch(changeModal({ name: "bookshelf" }));
  };

  const mainShape: ShapeType = {
    type: "polygon",
    onClick: onClickBookshelf,
    title: 'Bookshelf',
    points: "427 1078 601 1044 598 1144 430 1220"
  };

  return <>
    <Shape shape={mainShape} index="bookshelf" />
    <BubbleModal 
      name="bookshelf"
      width={`${MODAL_SIZE}px`}
      height={`${MODAL_SIZE}px`}
      x="calc(30vw - 200px)"
      y="calc(50vh - 200px)"
    >
      <BookshelfContent />
    </BubbleModal>
  </>;
};
