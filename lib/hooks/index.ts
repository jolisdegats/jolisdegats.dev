import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/lib/context";

export { useSoundEffect } from "@/lib/hooks/useSoundEffect";

export const useAppContext = () => useContext(AppContext);

export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);
  return isDesktop;
};