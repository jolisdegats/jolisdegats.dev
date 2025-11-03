import Image from "@/components/UI/Image";
import Spine from '@/assets/games/spine.webp';
import CoverOverlay from '@/assets/games/coveroverlay.webp';
import {
  COVER_HEIGHT,
  COVER_WIDTH,
  SPINE_WIDTH,
  NEGATIVE_MARGIN,
  UNFOCUS_ROTATE_AND_TRANSLATE_DURATION,
  FOCUS_ROTATION_DURATION,
} from '@/components/BackgroundImage/VideoGamesShelf/constants';

interface VideoGameItemProps {
  title: string;
  coverUrl: string;
  index: number;
  isFocused: boolean;
  isHovered: boolean;
  animationPhase: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent) => void;
  getCenterTranslationX: (index: number) => number;
}


export const VideoGameItem = ({
  title,
  coverUrl,
  index,
  isFocused,
  isHovered,
  animationPhase,
  onMouseEnter,
  onMouseLeave,
  onClick,
  getCenterTranslationX,
}: VideoGameItemProps) => {
  return (
    <button
      role="listitem"
      id={`video-game-${index}`}
      key={title}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`flex shrink-0 flex-row items-end outline-none ${
        isFocused ? "basis-60" : "basis-0"
      }`}
      style={{
        perspective: "1000px",
        WebkitPerspective: "1000px",
        marginRight: `-${NEGATIVE_MARGIN}px`,
        zIndex: ['rotating-while-taking-out', 'unfocusing-rotate-and-translate', 'centering'].includes(animationPhase) && isFocused ? 20 : index,
        transitionProperty: "transform",
        transitionDuration: (animationPhase === 'unfocusing-rotate-and-translate' || animationPhase === 'translate-back-to-shelf') ? `${UNFOCUS_ROTATE_AND_TRANSLATE_DURATION}ms` : "0.4s",
        transitionTimingFunction: "ease-in-out",
        transitionDelay: "0s",
        willChange: "transform",
        pointerEvents: isFocused ? "none" : "auto",
        transform:
          isFocused && (animationPhase === 'taking-out' || animationPhase === 'rotating-while-taking-out')
            ? `translateY(20px) translateX(-30px)`
            : isFocused && animationPhase === 'centering'
              ? `translateY(30px) translateX(${getCenterTranslationX(index)}px)`
              : isFocused && animationPhase === 'unfocusing-rotate-and-translate'
                ? `translateY(20px) translateX(-30px)`
                : animationPhase === 'translate-back-to-shelf'
                  ? `translateY(0) translateX(0)`
                  : isHovered && !isFocused
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
            isFocused && animationPhase === 'unfocusing-rotate-and-translate' ? "0deg" : (isFocused && (animationPhase === 'rotating-while-taking-out' || animationPhase === 'centering')) ? "-60deg" : "0deg"
          }) rotateZ(0deg) skew(0deg, 0deg)`,
          transitionProperty: "transform",
          transitionDuration: (animationPhase === 'rotating-while-taking-out') ? `${FOCUS_ROTATION_DURATION}ms` : (animationPhase === 'unfocusing-rotate-and-translate') ? `${UNFOCUS_ROTATE_AND_TRANSLATE_DURATION}ms` : "0s",
          transitionTimingFunction: "ease-in-out",
          transitionDelay: "0s",
          pointerEvents: "auto",
          zIndex: 50,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(e as any);
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `url(${Spine.src})`, backgroundSize: "100% 100%", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}></div>

        <span
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-50 h-full w-full opacity-40 [filter:url(#cover)]"
        />
      </div>

      {/* Book Cover */}
      <div
        className={`relative z-10 shrink-0 origin-left overflow-hidden border-gray-900 brightness-[0.80] contrast-[2.00] cursor-pointer`}
        style={{
          borderRadius: "0 5px 5px 0",
          transformStyle: "preserve-3d",
          transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(${
            isFocused && animationPhase === 'unfocusing-rotate-and-translate' ? "90deg" : (isFocused && (animationPhase === 'rotating-while-taking-out' || animationPhase === 'centering')) ? "20deg" : "90deg"
          }) rotateZ(0deg) skew(0deg, 0deg)`,
          pointerEvents: "auto",
          height: `${COVER_HEIGHT}px`,
          transitionProperty: "transform",
          transitionDuration: (animationPhase === 'rotating-while-taking-out') ? `${FOCUS_ROTATION_DURATION}ms` : (animationPhase === 'unfocusing-rotate-and-translate') ? `${UNFOCUS_ROTATE_AND_TRANSLATE_DURATION}ms` : "0s",
          transitionTimingFunction: "ease-in-out",
          transitionDelay: "0s",
        } as any}
        onClick={(e) => {
          e.stopPropagation();
          onClick(e as any);
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none fixed top-0 right-0 z-50 h-full w-full opacity-40 [filter:url(#cover)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 z-40 h-full w-full"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 70%)`,
          }}
        />
        <Image
          placeholder='blur'
          src={coverUrl}
          alt={title}
          className={`h-full bg-cover`}
          width={COVER_WIDTH}
          height={COVER_HEIGHT}
          style={{
            padding: "12px 8px",
            paddingTop: "14px",
            filter: isFocused ? "brightness(100%)" : isHovered ? "brightness(70%)" : "brightness(40%)",
            transition: "filter 0.3s ease-in-out"
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `url(${CoverOverlay.src})`, backgroundSize: "100% 100%", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}></div>
      </div>
    </button>
  );
};
