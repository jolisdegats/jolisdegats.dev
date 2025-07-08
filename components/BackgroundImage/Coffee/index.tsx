import Shape, { ShapeType } from "@/components/BackgroundImage/Shape";
import { useAppContext } from "@/lib/hooks";
import { changeModal } from "@/lib/context/ actions";
import mug from '@/assets/sounds/mug.mp3';
import Modal from "@/components/UI/Modal";
import CoffeeMachine, { type CoffeeMachineRef, type HandleStateChange } from "@/components/CoffeeMachine";
import { useRef, useState } from "react";
import Mug from "@/components/CoffeeMachine/Mug";
import { useSoundEffect } from "@/lib/hooks/useSoundEffect";

export const MarkerCoffee = () => {
    const { dispatch } = useAppContext(); 
    const {play} = useSoundEffect(mug);
    const coffeMachineRef = useRef<CoffeeMachineRef>(null);
    const [gameState, setGameState] = useState<HandleStateChange>({ gameState: 'OFF', objective: 0, message: '', result: '', coffeeHeight: 0 });

    const onClickOnMug = () => {
        play();
        dispatch(changeModal({name : "coffee"}));
    }

    const handleStateChange = (newState: Partial<HandleStateChange>) => {
        setGameState(prevState => ({ ...prevState, ...newState }));
    };

    const shape : ShapeType= {
        type:"rectangle",
        onClick:onClickOnMug,
        title: 'coffee',
        x:1493.3333333333333,
        y:957.2649572649573,
        width:40.84330484330485,
        height:43.39601139601143 
    }
    return <>
    <Modal handleClose={() => coffeMachineRef.current?.resetGame({gameState: 'OFF'})} name="coffee">
        <div className="grid grid-cols-[3fr_5fr] w-full h-full md:grid-cols-[3fr_5fr] grid-cols-1 overflow-auto">
            <div className="flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold mb-4">Coffee Break?</h2>
                <p className="text-base">Time for a quick game!</p>
                {!gameState.objective ? (
                    <p>Press the power button to begin brewing.</p>
                ) : (
                    <p>Target: Fill the mug to <span className="font-bold">{gameState.objective}%</span></p>
                )}
              
               
                {gameState.gameState === 'END' && (
                    <div className="mt-12 mb-4 flex flex-col items-center max-h-[50vh] overflow-y-auto">
                         <div className="relative cursor-pointer w-[90px] h-[90px]">
                        <div className="w-[90px] h-[90px] left-[36px] absolute">
                            <Mug onClickOnMug={() => coffeMachineRef.current?.resetGame({gameState: 'PAUSED',shouldGetNewObjective:true})} coffeeHeight={gameState.coffeeHeight/100} />
                        </div>
                        </div>
                    </div>
                )}
                  {gameState.result && (
                    <p>{gameState.result}</p>
                )}
                {gameState.message && (
                    <p className="text-base">{gameState.message}</p>
                )}
            </div>
            <div className="overflow-auto w-full h-full flex md:overflow-auto overflow-visible">
            <CoffeeMachine ref={coffeMachineRef} handleStateChange={handleStateChange} hideControls/>
            </div>
        </div>
    </Modal>
    <Shape shape={shape} index="phone"/>
    </>
}