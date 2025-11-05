import { useCallback, useRef, useEffect } from 'react';
import {
  UNFOCUS_ROTATE_AND_TRANSLATE_DURATION,
  UNFOCUS_BACK_TO_SHELF_DURATION,
  FOCUS_ROTATION_DELAY,
  type AnimationPhase,
  IDLE_ANIMATION_PHASE,
  TAKING_OUT_ANIMATION_PHASE,
  ROTATING_WHILE_TAKING_OUT_ANIMATION_PHASE,
  CENTERING_ANIMATION_PHASE,
  UNFOCUSING_ROTATE_AND_TRANSLATE_ANIMATION_PHASE,
  TRANSLATE_BACK_TO_SHELF_ANIMATION_PHASE,
} from '@/components/Main/VideoGamesShelf/constants';

interface UseVideoGamesAnimationProps {
  focusedIndexRef: { current: number };
  lastFocusedIndexRef: { current: number };
  setAnimationPhase: (phase: AnimationPhase) => void;
}

const setAnimationPhaseAfterDelay = (
  setPhase: (phase: AnimationPhase) => void,
  phase: AnimationPhase,
  delay: number,
  timeoutRef: { current: NodeJS.Timeout | null }
) => {
  timeoutRef.current = setTimeout(() => {
    setPhase(phase);
  }, delay);
};

const scheduleAnimation = (
  callback: () => void,
  delay: number,
  timeoutRef: { current: NodeJS.Timeout | null }
) => {
  timeoutRef.current = setTimeout(callback, delay);
};

export const useVideoGamesAnimation = ({
  focusedIndexRef,
  lastFocusedIndexRef,
  setAnimationPhase,
}: UseVideoGamesAnimationProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingClickRef = useRef<number | null>(null);
  const handleBookClickRef = useRef<(index: number) => void>(() => {});

  const handleUnfocus = useCallback(
    (index: number) => {
      setAnimationPhase(UNFOCUSING_ROTATE_AND_TRANSLATE_ANIMATION_PHASE);

      setAnimationPhaseAfterDelay(
        setAnimationPhase,
        TRANSLATE_BACK_TO_SHELF_ANIMATION_PHASE,
        UNFOCUS_ROTATE_AND_TRANSLATE_DURATION,
        timeoutRef
      );

      scheduleAnimation(
        () => {
          focusedIndexRef.current = -1;
          lastFocusedIndexRef.current = index;
          
          if (pendingClickRef.current !== null) {
            const pendingIndex = pendingClickRef.current;
            pendingClickRef.current = null;
            setTimeout(() => {
              handleBookClickRef.current(pendingIndex);
            }, 10);
          }

          setAnimationPhaseAfterDelay(
            setAnimationPhase,
            IDLE_ANIMATION_PHASE,
            UNFOCUS_BACK_TO_SHELF_DURATION,
            timeoutRef
          );
        },
        UNFOCUS_ROTATE_AND_TRANSLATE_DURATION,
        timeoutRef
      );
    },
    [focusedIndexRef, lastFocusedIndexRef, setAnimationPhase]
  );

  const handleFocus = useCallback(
    (index: number) => {
      focusedIndexRef.current = index;
      lastFocusedIndexRef.current = index;
      setAnimationPhase(TAKING_OUT_ANIMATION_PHASE);

      scheduleAnimation(
        () => {
          scheduleAnimation(
            () => {
              setAnimationPhase(ROTATING_WHILE_TAKING_OUT_ANIMATION_PHASE);

              scheduleAnimation(
                () => {
                  setAnimationPhase(CENTERING_ANIMATION_PHASE);
                },
                FOCUS_ROTATION_DELAY,
                timeoutRef
              );
            },
            FOCUS_ROTATION_DELAY,
            timeoutRef
          );
        },
        0,
        timeoutRef
      );
    },
    [focusedIndexRef, lastFocusedIndexRef, setAnimationPhase]
  );

  const handleBookClick = useCallback(
    (index: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (focusedIndexRef.current === index) {
        handleUnfocus(index);
      } else {
        if (focusedIndexRef.current !== -1 && focusedIndexRef.current !== index) {
          pendingClickRef.current = index;
          handleBookClickRef.current(focusedIndexRef.current);
          return;
        }

        handleFocus(index);
      }
    },
    [focusedIndexRef, handleUnfocus, handleFocus]
  );

  // Store the callback in ref for recursive calls
  useEffect(() => {
    handleBookClickRef.current = handleBookClick;
  }, [handleBookClick]);


  useEffect(() => {
    const timeout = timeoutRef.current;
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return {
    handleBookClick,
  };
};
