import Shape, { ShapeType } from "@/components/BackgroundImage/Shape";
import VideoGamesBubble from '@/assets/video-games.png';
import { changeModal } from "@/lib/context";
import { useAppContext } from "@/lib/hooks";
import { useState } from "react";
import BubbleModal from "@/components/UI/Modal/BubbleModal";
import Image from "next/image";

const VIDEO_GAMES_BUBBLE_SIZE = "30vw";
const VIDEO_GAMES_BUBBLE_MAX_SIZE = "300px";

export const MarkerVideoGames = () => {
    const { dispatch } = useAppContext(); 
    const [modalPosition, setModalPosition] = useState<{ x: number, y: number } | null>(null); 
   
    const onClickOnVideoGames = (e: React.MouseEvent<HTMLElement>) => {
        setModalPosition({ x: e.clientX, y: e.clientY });
        dispatch(changeModal({name : "video-games"}));
    }

    const mainShape : ShapeType= {
        type:"polygon",
        onClick:onClickOnVideoGames,
        title: 'Video Games',
        points: "427 1078 601 1044 598 1144 430 1220"
    }

    // const gameAreas = [
    //     { name: 'Monkey Island', points: '533,185,564,176,823,211,824,573,564,628,533,613', onClick: () => console.log('Monkey Island clicked') },
    //     { name: 'Beauty and the Beast', points: '356,194,379,184,535,194,533,603,380,622,359,609', onClick: () => console.log('Beauty and the Beast clicked') },
    //     { name: 'The Lion King', points: '206,206,219,198,358,205,359,572,220,585,207,572', onClick: () => console.log('The Lion King clicked') },
    // ];

    const size = VIDEO_GAMES_BUBBLE_SIZE > VIDEO_GAMES_BUBBLE_MAX_SIZE ? VIDEO_GAMES_BUBBLE_MAX_SIZE : VIDEO_GAMES_BUBBLE_SIZE;
   return <>
    <Shape shape={mainShape} index="video-games" />
    <BubbleModal name="video-games" 
    height={size} 
    width={size}
    x={`calc(${(modalPosition?.x || 0)}px )`} 
    y={`calc(${(modalPosition?.y || 0)}px - ${size} + 30px)`}>
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src={VideoGamesBubble} 
            alt="Video Games Bubble" 
            fill
            className="object-cover"
            priority
            placeholder="blur"
            unoptimized
          />

          {/* <svg 
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1024 768"
            preserveAspectRatio="xMidYMid slice"
            style={{ pointerEvents: 'auto' }}
          >
            {gameAreas.map((game, index) => (
                <Shape
                    key={index}
                    shape={{
                        type: "polygon",
                        onClick: game.onClick,
                        title: game.name,
                        points: game.points,
                    }}
                    index={`game-${index}`}
                />
            ))}
          </svg> */}
        </div>
    </BubbleModal>
    </>
}
