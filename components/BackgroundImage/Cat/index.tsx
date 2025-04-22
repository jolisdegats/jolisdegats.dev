import gifCat from '@/assets/gif-cat.webp';
import catPurring from '@/assets/sounds/cat-purring.mp3';
import Shape, { type ShapeType } from '../Shape';
import { useState, useCallback } from 'react'; // Added useCallback
import { useSoundEffect } from '@/lib/hooks/useSoundEffect';

const VOLUME = 0.4;

export const MarkerCat = () => {
    const {play, fade, stop} = useSoundEffect(catPurring, { volume: 0});
    const [isDragging, setIsDragging] = useState(false);

    const startDragging = useCallback(() => {
        setIsDragging(true);
        play()
        fade(0, VOLUME, 300);
    }, [ play, fade]);

    const stopDragging = useCallback(() => {
        console.log('stopDragging')
        setIsDragging(false);
        fade(VOLUME, 0, 500);
        stop();
    }, [stop, fade]);

    const shape: ShapeType = {
        type:"rectangle",
        style: {cursor: isDragging ? "grabbing" : "grab"},
        onTouchStart: startDragging,
        onTouchEnd: stopDragging,
        onMouseDown: startDragging,
        onMouseUp: stopDragging,
        onMouseLeave: stopDragging,
        onMouseOver: () => {
            if (isDragging) {
                play();
            }
        },
        onMouseOut: () => {
            stop();
            setIsDragging(false);
        },
        title: 'coffee',
        x:1092.5584045584046 ,
        y:1102.7692307692307, 
        width:74.02849002849007, 
        height:148.05698005698014,
       
    }
    return (<Shape shape={shape} index="cat"/>
    )
}


export const ImageCat = () => {
return <image xlinkHref={gifCat.src}  width="100%" height="100%" />
}