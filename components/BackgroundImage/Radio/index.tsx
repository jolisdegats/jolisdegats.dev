import radioMusicHappyChildren from '@/assets/sounds/happy-children.mp3';
import radioMusicShy from '@/assets/sounds/shy.mp3';
import radioMusicSmoothOperator from '@/assets/sounds/smooth-operator.mp3';
import radioMusicDreams from '@/assets/sounds/dreams.mp3';
import Shape, { ShapeType } from "@/components/BackgroundImage/Shape";
import radioTuning from '@/assets/sounds/tuning-radio.mp3';
import radioSwitch from '@/assets/sounds/radio-switch.mp3';
import radioOn from '@/assets/radio-on.webp';
import { toggleRadio } from "@/lib/context";
import { useAppContext } from "@/lib/hooks";
import { useSoundEffect } from "@/lib/hooks/useSoundEffect";
import { useState } from "react";
import Image from '@/components/UI/Image';

const getNextIndex = (currentIndex: number, totalTracks: number) => {
    return (currentIndex + 1) >= totalTracks ? 0 : currentIndex + 1;
};

export const MarkerRadio = () => {
    const { state: { isRadioOn }, dispatch } = useAppContext();
    const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
    
  //PRELOAD
    const { play: playSwitch, stop: stopSwitch } = useSoundEffect(radioSwitch, { 
        volume: 0.25,
        preload: true 
    });
    const { play: playTuning, stop: stopTuning } = useSoundEffect(radioTuning, { 
        volume: 0.5,
        preload: true,
        interrupt: true
    });
    const happyChildren = useSoundEffect(radioMusicHappyChildren, { 
        volume: 0.5,
        preload: true
    });

  //DEFER LOADING
    const shy = useSoundEffect(radioMusicShy, { 
        volume: 0.5,
        preload: false
    });
    const smoothOperator = useSoundEffect(radioMusicSmoothOperator, { 
        volume: 0.5,
        preload: false,
    });
    const dreams = useSoundEffect(radioMusicDreams, { 
        volume: 0.5,
        preload: false,
    });

    const musics = [happyChildren, shy, smoothOperator, dreams];


    const handleRadioClick = () => {
        dispatch(toggleRadio());
        if (isRadioOn) {
            playSwitch();
            stopTuning();
            musics.forEach(music => music.stop());
            return () => stopSwitch();
        } else {
            playSwitch();
            playTuning();
            if(musics[currentMusicIndex] === smoothOperator) {
                musics[currentMusicIndex].play(1000);
            } else {
                musics[currentMusicIndex].play();
            }
            const nextIndex = getNextIndex(currentMusicIndex, musics.length);
            if(!musics[nextIndex]?.isLoaded) {
                musics[nextIndex].load();
            }
            setTimeout(() => {
                stopTuning();
            }, 2000);
            return () => stopSwitch();
        }
    };

    const handleChangeMusic = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (isRadioOn) {
            playTuning();
            const nextIndex = getNextIndex(currentMusicIndex, musics.length);
            musics[nextIndex].load();
            musics.forEach(music => music.stop());
            setCurrentMusicIndex(nextIndex);
            setTimeout(() => {
                musics[nextIndex].play();
            }, 100);
            setTimeout(() => {
                stopTuning();
            }, 500);
        }
    };

    const shape: ShapeType = {
        onClick: handleRadioClick,
        title: 'Radio',
        type: 'rectangle',
        x: 913.8689458689458,
        y: 903.6581196581196,
        width: 155.71509971509965,
        height: 119.97720797720797
    };

    const shapeChangeMusic: ShapeType = {
        onClick: (e) => handleChangeMusic(e),
        title: 'Change Music',
        type: 'rectangle',
        x: 1010.8717948717948,
        y: 970.0284900284901,
        width: 48.501424501424594,
        height: 43.39601139601132
    };

    return <>
        <Shape shape={shape} index="radio" />
        {isRadioOn && <Shape shape={shapeChangeMusic} index="changeMusic" />}
    </>;
};

export const ImageRadio = () => {
    const { state: { isRadioOn } } = useAppContext();
    return <div style={{ width: '100%', height: '100%' }}>  
    <Image 
    alt="radio"
    src={radioOn} 
    fill 
    className={`object-cover ${isRadioOn ? 'opacity-100' : 'opacity-0'}`} />
    </div>
};
