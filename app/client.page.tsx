'use client'

import BackgroundImage from "@/components/BackgroundImage";
import { toggleHelpMarkers, changeModal } from "@/lib/context";
import { useAppContext, useIsDesktop } from "@/lib/hooks";
import { FaQuestionCircle, FaRegCopyright } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const Credits = dynamic(() => import("@/components/Credits"), { ssr: false });

const ClientPage = () => {
    const { dispatch } = useAppContext();
    const isDesktop = useIsDesktop();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    const aspectRatio = 2688 / 1792;
    const minWidthVh = !isDesktop ? `${aspectRatio * 100}vh` : '100vw';
    
    const centerScrollPosition = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const containerWidth = container.scrollWidth;
            const viewportWidth = container.clientWidth;
            
            if (containerWidth > viewportWidth) {
                const centerPosition = (containerWidth - viewportWidth) / 2;
                container.scrollTo({
                    left: centerPosition,
                    behavior: 'instant'
                });
            }
        }
    };
    
    useEffect(() => {
        centerScrollPosition();
        
        const handleResize = () => {
            setTimeout(centerScrollPosition, 100);
        };
        
        window.addEventListener('resize', handleResize);
        
        const handleLoad = () => {
            setTimeout(centerScrollPosition, 200);
        };
        
        window.addEventListener('load', handleLoad);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('load', handleLoad);
        };
    }, []);
    
    return (
        <div 
            ref={scrollContainerRef}
            className="relative w-svw h-svh overflow-x-auto lg:overflow-x-hidden overflow-y-hidden"
            style={{ scrollBehavior: 'smooth' }}
        >
            <div 
                className="relative h-full min-w-full"
                style={{ 
                    minWidth: minWidthVh,
                    width: minWidthVh
                }}
            >
                <BackgroundImage />
                <div className="fixed bottom-5 right-5 flex space-x-1">
                    <button 
                        onTouchStart={() => dispatch(toggleHelpMarkers())}
                        onTouchEnd={() => setTimeout(() => dispatch(toggleHelpMarkers()), 300)}
                        onMouseDown={() => dispatch(toggleHelpMarkers())}
                        onMouseUp={() => setTimeout(() => dispatch(toggleHelpMarkers()), 300)}
                        className="bg-white hover:bg-opacity-30 bg-opacity-0 rounded-md p-1.5 cursor-pointer text-white text-opacity-30 hover:text-opacity-100"
                    >
                        <FaQuestionCircle className="text-xl " title="Help" />
                    </button>
                    <button 
                        onClick={() => dispatch(changeModal({name : "credits"}))} 
                        className="bg-white hover:bg-opacity-30 bg-opacity-0 rounded-md p-1.5 cursor-pointer text-white text-opacity-30 hover:text-opacity-100"
                    >
                        <FaRegCopyright className="text-xl " title="Credits" />
                    </button>
                    <Credits />
                </div>
            </div>
        </div>
    );
}

export default ClientPage;