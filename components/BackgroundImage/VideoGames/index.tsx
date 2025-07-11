import Shape, { ShapeType } from "@/components/BackgroundImage/Shape";
import VideoGamesBubble from '@/assets/video-games.png';
import { changeModal } from "@/lib/context";
import { useAppContext } from "@/lib/hooks";
import { Suspense, useState } from "react";
import BubbleModal from "@/components/UI/Modal/BubbleModal";

const VIDEO_GAMES_BUBBLE_SIZE = "30vw";
const VIDEO_GAMES_BUBBLE_MAX_SIZE = "200px";

export const MarkerVideoGames = () => {
    const { dispatch } = useAppContext(); 
    const [modalPosition, setModalPosition] = useState<{ x: number, y: number } | null>(null); 
   
    const onClickOnVideoGames = (e: React.MouseEvent<HTMLElement>) => {
        setModalPosition({ x: e.clientX, y: e.clientY });
        dispatch(changeModal({name : "video-games"}));
    }

    const shape : ShapeType= {
        type:"polygon",
        onClick:onClickOnVideoGames,
        title: '',
        points: "427 1078 601 1044 598 1144 430 1220"
    }

    const size = VIDEO_GAMES_BUBBLE_SIZE > VIDEO_GAMES_BUBBLE_MAX_SIZE ? VIDEO_GAMES_BUBBLE_MAX_SIZE : VIDEO_GAMES_BUBBLE_SIZE;
   return <>
    <Shape shape={shape} index="video-games" />
    <BubbleModal name="video-games" 
    height={size} 
    width={size}
    x={`calc(${(modalPosition?.x || 0)}px )`} 
    y={`calc(${(modalPosition?.y || 0)}px - ${size} + 30px)`}>
        {/* <div className="w-full h-full"> */}
        <svg 
        width="100%" 
        height="100%" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0,
        }}
      >
        <Suspense fallback={null}>
            <image
              href={VideoGamesBubble.src}
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
              preserveAspectRatio="xMidYMid slice"
          
            />
        </Suspense>
      </svg>
            {/* <Image src={VideoGamesBubble.src} alt="Video Games Bubble" fill className="object-cover" /> */}
        {/* </div> */}
    </BubbleModal>
    </>
}
