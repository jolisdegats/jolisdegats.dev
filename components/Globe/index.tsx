'use client';

import PopupModal from '@/components/UI/Modal/PopupModal';
import Globe from '@/components/Globe/GlobeContent';

const GlobeModal = () => {
  return (
    <PopupModal name="globe">
      <div className="flex flex-col items-center w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Visited Countries</h2>
        <p className="text-gray-300 mb-6 text-center text-sm">
          Countries I've visited around the world
        </p>
        
        <div className="w-full h-[500px] relative">
          <Globe/>
        </div>
      </div>
    </PopupModal>
  );
};

export default GlobeModal;