import { forwardRef } from 'react';
import type { GameState } from '..';

interface MugProps {
  coffeeHeight: number;
  onClickOnMug?: () => void;
  mugRef?: React.RefObject<HTMLDivElement>;
  coffeeRef?: React.RefObject<HTMLDivElement>;
  gameState?: GameState;
}

const Mug = forwardRef<HTMLDivElement, MugProps>(
  ({coffeeHeight, onClickOnMug, mugRef, coffeeRef, gameState = 'RUN' }, forwardedRef) => {
    return (
      <button onClick={onClickOnMug} className={`h-[90px] cursor-default ${gameState !== 'OFF' && coffeeHeight > 0 ? "cursor-pointer" : ""}`  }>
        <div ref={mugRef} className="z-[2] absolute bottom-0 left-0 bg-[#f0e3d4] w-[70px] h-[90px] rounded-[5px_5px_10%10%] transition-[opacity,left] duration-[0.3s,1s] -translate-x-1/2" />
        <div 
          ref={coffeeRef}   
          style={{transform: `scaleY(${Math.min(coffeeHeight / (mugRef?.current?.clientHeight ?? 1), 1)})` }}
          className="z-[6] absolute bottom-[5px] left-[-30px] bg-[#793d2e] w-[60px] h-[75px] rounded-[0px_0px_20%20%] shadow-[inset_7px-3px_3px_#c18255] origin-bottom"
        />
        <div className="z-[1] absolute left-[24px] bottom-[22px] w-[28px] h-[44px] rounded-full border-[8px] border-[#f0e3d4] rotate-[8deg]"/>
        {coffeeHeight > 0 && ['RUN', 'PAUSED'].includes(gameState) && (
          <div className="absolute top-0 left-0 w-full h-full z-[10]">
            <div className="z-[30] absolute left-0 w-[20px] h-[20px] bg-[#ccc] rounded-full opacity-0 transition-all duration-700 animate-bubblesAnimation delay-[3.6s]"/>
            <div className="z-[30] absolute left-0 w-[20px] h-[20px] bg-[#ccc] rounded-full opacity-0 transition-all duration-700 animate-bubblesAnimation delay-[5.5s]"/>
            <div className="z-[30] absolute left-0 w-[20px] h-[20px] bg-[#ccc] rounded-full opacity-0 transition-all duration-700 animate-bubblesAnimation delay-[7.8s]"/>
          </div>
        )} 
        </button>
    )
  }
);

Mug.displayName = 'Mug';

export default Mug