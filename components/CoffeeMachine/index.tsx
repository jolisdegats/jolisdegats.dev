import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';

import coffeeMachineOnOff from '@/assets/sounds/coffee-machine-on-off.mp3';
import coffeePouring from '@/assets/sounds/coffee-pouring.mp3';
import coffeePouringEnd from '@/assets/sounds/coffee-pouring-end.mp3';
import mugServed from '@/assets/sounds/mug-served.mp3';
import Mug from './Mug';
import { useSoundEffect } from '@/lib/hooks/useSoundEffect';

export interface HandleStateChange {
  gameState: GameState;
  objective: number;
  message: string;
  result: string;
  coffeeHeight: number;
}

interface CoffeeMachineProps {
  handleStateChange?: (state: Partial<HandleStateChange>) => void;
  hideControls?: boolean;
}

export type GameState = 'END' | 'RUN' | 'PAUSED' | 'OFF';

export interface CoffeeMachineRef {
  resetGame: (params: ResetGameParams) => void;
}

interface ResetGameParams {
  gameState?: GameState;
  shouldGetNewObjective?: boolean;
}

const CoffeeMachine = forwardRef<CoffeeMachineRef, CoffeeMachineProps>(({ handleStateChange, hideControls = false }, ref) => {
  const coffeeRef = useRef<HTMLDivElement>(null);
  const mugRef = useRef<HTMLDivElement>(null);
  const {play: playCoffeeMachineOnOff} = useSoundEffect(coffeeMachineOnOff);
  const {play: playCoffeePouring, stop: stopCoffeePouringSound} = useSoundEffect(coffeePouring);
  const {play: playCoffeePouringEnd} = useSoundEffect(coffeePouringEnd);
  const {play: playMugServed} = useSoundEffect(mugServed);

  const [gameState, setGameState] = useState<GameState>('OFF');
  const [objective, setObjective] = useState(0);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [coffeeHeight, setCoffeeHeight] = useState(0);

  const SPEED_IN_MS = 50;

  const stopCoffeePouring = useCallback(() => {
    if (coffeeHeight > 0 && gameState === 'RUN') {
      playCoffeePouringEnd();
      stopCoffeePouringSound();
    }
  }, [stopCoffeePouringSound, playCoffeePouringEnd, coffeeHeight, gameState]);

  const calculatePercentage = useCallback((): number => {
    return mugRef.current ? Math.round((coffeeHeight / mugRef.current.clientHeight) * 100) : 0;
  }, [coffeeHeight]);

  const resetGame = useCallback(({gameState = 'PAUSED', shouldGetNewObjective = false} : ResetGameParams) => {
    const newObjective = shouldGetNewObjective ? Math.floor(Math.random() * 100) : 0;
    stopCoffeePouring()
    setCoffeeHeight(0);
    setResult('');
    setMessage('');
    setObjective(newObjective);
    setGameState(gameState);
    handleStateChange?.({gameState, coffeeHeight: 0, objective: newObjective, result: '', message: '' });
  }, [handleStateChange, stopCoffeePouring]);

  useImperativeHandle(ref, () => ({
    resetGame
  }));

  const setNewObjective = useCallback(() => {
    const newObjective = Math.floor(Math.random() * 100);
    setObjective(newObjective);
    handleStateChange?.({ objective: newObjective });
  }, [handleStateChange]);

  const handleBtnOff = useCallback(() => {
    if(gameState !== 'OFF'){
    if (gameState !== 'END') {
      playCoffeeMachineOnOff();
    }
    resetGame({gameState: 'OFF'});
    setGameState('OFF');}
  }, [gameState, playCoffeeMachineOnOff, resetGame]);

  const handleBtnOn = useCallback(() => {
    stopCoffeePouring();
    if (gameState === 'OFF') {
      playCoffeeMachineOnOff();
    }
    setGameState('PAUSED');
    if (['OFF', 'END'].includes(gameState)) {
      resetGame({});
      setNewObjective();
    } else {
      setCoffeeHeight(0);
    }
  }, [gameState, playCoffeeMachineOnOff, resetGame, setNewObjective, stopCoffeePouring]);

  const handleBtnCoffee = useCallback(() => {
    stopCoffeePouring();
    if (gameState === 'RUN') {
      setGameState('PAUSED');
    } else if (gameState !== 'OFF') {
      if (gameState === 'END') {
        resetGame({});
        setNewObjective();
        setGameState('PAUSED');
        playCoffeePouring()
      }
        if(gameState === 'PAUSED') {
          playCoffeePouring()
        }
      setGameState('RUN');
    }
  }, [gameState, playCoffeePouring, resetGame, setNewObjective, stopCoffeePouring]);

  const calculateResult = useCallback(() => {
    const percentage = calculatePercentage();
    if (['RUN', 'PAUSED'].includes(gameState)) {
      setResult(`Percent Filled: ${percentage}%`);

      let newMessage = '';
      if (percentage === objective) {
        newMessage = 'Nailed it! Good job!';
      } else if (Math.abs(objective - percentage) < 5) {
        newMessage = 'Eh. Close enough.';
      } else if (Math.abs(objective - percentage) < 10) {
        newMessage = 'You can do better!';
      } else {
        newMessage = "Meh... Not yet a barista!";
      }

      setMessage(newMessage);
      handleStateChange?.({ result: `Percent Filled: ${percentage}%`, message: newMessage, coffeeHeight: percentage, gameState: 'END' });
    }
  }, [calculatePercentage, objective, gameState, handleStateChange]);

  const handleMugClick = useCallback(() => {
    stopCoffeePouring();
    if (coffeeHeight > 0) {
      playMugServed();
      setGameState('END');
      calculateResult();
    }
  }, [calculateResult, coffeeHeight, playMugServed, stopCoffeePouring]);

  useEffect(() => {
    if (gameState === 'RUN') {
      const interval = setInterval(() => {
        setCoffeeHeight(prevHeight => {
          const maxHeight = mugRef.current?.clientHeight ?? 0;
          if (prevHeight >= maxHeight) {
            setGameState('PAUSED');
            stopCoffeePouring()
            return maxHeight;
          }
          return prevHeight + 1;
        });
      }, SPEED_IN_MS);

      return () => clearInterval(interval);
    }
  }, [gameState, stopCoffeePouring]);

  return (
    <div className="w-full max-h-full mx-auto">
      <div className="max-w-[450px] w-full mx-auto my-[20px] lg:p-[20px]">
        <div className="w-[88%] h-[100px] mx-auto bg-[#e4e8e9] rounded-[10px] relative shadow-[inset_10px_0px_2px_#d4d4d4,inset_-10px_0px_2px_#d4d8d9]">
          <button 
            onClick={handleBtnCoffee}
            className={`
              unbuttonize absolute top-1/2 left-1/2 w-[40px] h-[40px] 
              rounded-full border-[7px] border-[#333] bg-[#a9cce2] 
              -translate-x-1/2 -translate-y-1/2 -rotate-45 
              shadow-[inset_14px_0px_2px_1px_#9ebed3]
              ${gameState === 'OFF' ? "cursor-default" : ""}
              ${gameState === "RUN" ? "hover:border-[#555]" : ""}
              ${gameState === "PAUSED" ? "animate-borderHighlight transition-all duration-300 ease-in-out bg-[#a9cce2] hover:border-[#555]" : ""}
            `}
          />
          <button 
            onClick={handleBtnOff} 
            className={`
              unbuttonize absolute top-1/2 w-[20px] h-[20px] 
              rounded-full -translate-y-1/2 shadow-[0px_0px_5px_#555] left-[30px]
              ${gameState === 'OFF' ? "bg-[#ce1b1b] cursor-default" : "bg-[#590a0a] cursor-pointer bg-[#590a0a]"}
            `}
          />
          <button 
            onClick={handleBtnOn} 
            className={`
              unbuttonize absolute top-1/2 w-[20px] h-[20px] 
              rounded-full -translate-y-1/2 shadow-[0px_0px_5px_#555] left-[60px]
              ${gameState !== 'OFF' ? "bg-[#00ad00]" : "bg-[#003a00]"}
              ${gameState === "PAUSED" && coffeeHeight === 0 ? "cursor-default" : "cursor-pointer"}
            `}
          />
        </div>

        <div className="relative w-[80%] max-w-[350px] h-[200px] mx-auto bg-[#b2b2b2] shadow-[inset_7px_0px_0px_#a5a5a5]">
          <div className="w-[77%] h-full absolute bottom-0 left-1/2 bg-[#949494] -translate-x-1/2 shadow-[inset_6px_0px_0px_#8a8a8a]"/>
          <div className="absolute z-[6] top-0 left-1/2 -translate-x-1/2">
            <div className="w-[120px] h-[20px] bg-[#d7d7d7] rounded-[0_0_60px_60px] shadow-[inset_6px_-7px_3px_#c8c8c8]"/>
            <div className="w-[70px] h-[18px] mx-auto -mb-[5px] bg-black rounded-[0_0_50%50%]"/>
            <div className="w-[10px] h-[14px] mx-auto bg-black rounded-[0_0_3px_3px]"/>
            <div className={`
              absolute top-0 right-[7px] -z-[1] origin-left
              ${gameState === 'RUN' ? "animate-pressArm" : ""}
            `}>
              <div className="absolute top-[23px] right-[-20px] w-[46px] h-[6px] bg-[#585858]"/>
              <div className="absolute top-[17px] right-[-68px] w-[51px] h-[17px] bg-black rounded-[40px]"/>
            </div>
          </div>

          <div className={`
            absolute z-[5] left-[calc(50%-3px)] bottom-[10px] 
            w-[6px] mx-auto bg-[#73372c] h-[180px] 
            transition-transform duration-500 pointer-events-none
            ${gameState !== 'RUN' ? 'origin-bottom scale-y-0' : ''}
            ${gameState === 'RUN' ? 'scale-y-100 opacity-100 origin-top' : ''}
          `}/>

          <div className="absolute left-1/2 bottom-[5px]">
            {!['END', 'OFF'].includes(gameState) && (
              <Mug 
                coffeeHeight={coffeeHeight} 
                onClickOnMug={handleMugClick} 
                mugRef={mugRef} 
                coffeeRef={coffeeRef} 
                gameState={gameState}
              />
            )}
            <div className="z-[1] absolute bottom-[-5px] left-1/2 w-[100px] h-[5px] bg-[#333] rounded-[10px_10px_0_0] -translate-x-1/2"/>
          </div>
        </div>

        <div className="w-[83%] h-[8px] bg-[#0b4a66] mx-auto rounded-[7px_7px_0_0]"/>
        <div className="relative w-[90%] h-[60px] mx-auto rounded-[18px_18px_10px_10px] bg-[#0e5f82] overflow-hidden py-[15px] px-0 shadow-[inset_10px_-27px_4px_#0b4a66]">
          <div className="absolute left-0 bottom-0 w-full h-[20%] bg-black"/>
          <div className="flex justify-around items-center w-full h-full relative z-[1] text-white bottom-[10px] text-center">
            {!hideControls && (
              <div>
                <p>
                  Fill the coffee cup {!!objective && `to ${objective}%`} <br/>
                  <small>{[result, message].filter(Boolean).join(' - ')}</small>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>        
    </div>
  );
})

CoffeeMachine.displayName = 'CoffeeMachine';

export default CoffeeMachine;