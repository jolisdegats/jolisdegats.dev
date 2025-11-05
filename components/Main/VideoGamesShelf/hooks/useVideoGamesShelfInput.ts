import { useEffect, useRef } from 'react';
import { PREVIEW_SCROLL_INTERVAL, PREVIEW_START_DELAY, TOUCH_SWIPE_THRESHOLD } from '../constants';

interface UseVideoGamesShelfInputProps {
  videogamesLength: number;
  onBookClick: (index: number) => void;
  focusedIndexRef: { current: number };
  lastFocusedIndexRef: { current: number };
  setHoveredIndex: (index: number) => void;
}

 // Helper: Get navigation index after arrow key press
const getNextNavigationIndex = (keyCode: string, currentFocusedIndex: number, videogamesLength: number): number | 'unfocus' => {
  if (currentFocusedIndex === -1) {
    return keyCode === 'ArrowRight' ? 0 : videogamesLength - 1;
  }
  if (keyCode === 'ArrowLeft') {
    return currentFocusedIndex > 0 ? currentFocusedIndex - 1 : 'unfocus';
  }
  if (keyCode === 'ArrowRight') {
    return currentFocusedIndex < videogamesLength - 1 ? currentFocusedIndex + 1 : 'unfocus';
  }
  return -1;
}

// Helper: Get preview starting index
const getPreviewStartIndex = (keyCode: string, baseIndex: number, wasFocusedAtKeyPress: boolean, videogamesLength: number, focusedIndexRef: { current: number })=> {
  if (baseIndex === -1) {
    return keyCode === 'ArrowRight' ? 0 : videogamesLength - 1;
  }
  if (wasFocusedAtKeyPress && focusedIndexRef.current === -1) {
    return baseIndex;
  } else if (focusedIndexRef.current !== -1) {
    return focusedIndexRef.current;
  } else {
    const direction = keyCode === 'ArrowRight' ? 1 : -1;
    return (baseIndex + direction + videogamesLength) % videogamesLength;
  }
}


export const useVideoGamesShelfInput = ({
  videogamesLength,
  onBookClick,
  focusedIndexRef,
  lastFocusedIndexRef,
  setHoveredIndex,
}: UseVideoGamesShelfInputProps) => {
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const repeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const isInPreviewModeRef = useRef(false);
  const hoverIndexRef = useRef(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyCode = e.code;

      if (!['ArrowLeft', 'ArrowRight', 'Space'].includes(keyCode)) {
        return;
      }

      if (pressedKeysRef.current.has(keyCode)) {
        return;
      }

      e.preventDefault();
      pressedKeysRef.current.add(keyCode);
      isInPreviewModeRef.current = false;

      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);

      const wasFocusedAtKeyPress = focusedIndexRef.current !== -1;

      // Handle Space: toggle current book
      if (keyCode === 'Space') {
        if (lastFocusedIndexRef.current !== -1) {
          onBookClick(lastFocusedIndexRef.current);
        }
        return;
      }

      // Handle Arrow: unfocus current book to enter preview
      if (focusedIndexRef.current !== -1) {
        onBookClick(focusedIndexRef.current);
      }

      // Start preview mode after delay
      navigationTimeoutRef.current = setTimeout(() => {
        if (pressedKeysRef.current.has(keyCode)) {
          isInPreviewModeRef.current = true;

          const direction = keyCode === 'ArrowRight' ? 1 : -1;
          const baseIndex = focusedIndexRef.current !== -1 ? focusedIndexRef.current : lastFocusedIndexRef.current;
          let currentPreviewIndex = getPreviewStartIndex(keyCode, baseIndex, wasFocusedAtKeyPress, videogamesLength, focusedIndexRef);

          setHoveredIndex(currentPreviewIndex);
          hoverIndexRef.current = currentPreviewIndex;

          repeatIntervalRef.current = setInterval(() => {
            if (!pressedKeysRef.current.has(keyCode)) {
              if (repeatIntervalRef.current) {
                clearInterval(repeatIntervalRef.current);
                repeatIntervalRef.current = null;
              }
              return;
            }

            currentPreviewIndex = (currentPreviewIndex + direction + videogamesLength) % videogamesLength;
            setHoveredIndex(currentPreviewIndex);
            hoverIndexRef.current = currentPreviewIndex;
          }, PREVIEW_SCROLL_INTERVAL);
        }
      }, PREVIEW_START_DELAY);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyCode = e.code;
      const wasPressed = pressedKeysRef.current.has(keyCode);
      pressedKeysRef.current.delete(keyCode);

      if (wasPressed && navigationTimeoutRef.current !== null && !isInPreviewModeRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;

        const nextIndexOrUnfocus = getNextNavigationIndex(keyCode, lastFocusedIndexRef.current, videogamesLength);

        if (nextIndexOrUnfocus === 'unfocus') {
          onBookClick(lastFocusedIndexRef.current);
        } else if (nextIndexOrUnfocus !== -1) {
          onBookClick(nextIndexOrUnfocus);
        }
      } else if (isInPreviewModeRef.current) {
        isInPreviewModeRef.current = false;
        if (repeatIntervalRef.current) {
          clearInterval(repeatIntervalRef.current);
          repeatIntervalRef.current = null;
        }

        if (hoverIndexRef.current !== -1) {
          onBookClick(hoverIndexRef.current);
          setHoveredIndex(-1);
          hoverIndexRef.current = -1;
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndXRef.current = e.changedTouches[0].screenX;
      if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
        const diff = touchStartXRef.current - touchEndXRef.current;
        const threshold = TOUCH_SWIPE_THRESHOLD;

        if (Math.abs(diff) > threshold) {
          const keyCode = diff > 0 ? 'ArrowRight' : 'ArrowLeft';
          const nextIndexOrUnfocus = getNextNavigationIndex(keyCode, lastFocusedIndexRef.current, videogamesLength);

          if (nextIndexOrUnfocus === 'unfocus') {
            onBookClick(lastFocusedIndexRef.current);
          } else if (nextIndexOrUnfocus !== -1) {
            onBookClick(nextIndexOrUnfocus);
          }
        }
      }
      touchStartXRef.current = null;
      touchEndXRef.current = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
      if (repeatIntervalRef.current) clearInterval(repeatIntervalRef.current);
    };
  }, [onBookClick, videogamesLength, setHoveredIndex, focusedIndexRef, lastFocusedIndexRef]);
};
