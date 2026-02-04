'use client';

import PopupModal from '@/components/UI/Modal/PopupModal';
import GlobeContent from '@/components/Globe/GlobeContent';
import Shape, { ShapeType } from '@/components/Shape';
import { changeModal } from '@/lib/context'
import { useAppContext } from '@/lib/hooks';

const GlobeModal = () => {
  const { dispatch } = useAppContext()

  const shape: ShapeType = {
    type: 'polygon',
    onClick: () => {
      dispatch(changeModal({ name: 'globe' }))
    },
    title: 'globe',
    points:
      '732.627 1324.85 901.105 1327.41 903.658 1067.03 888.342 1031.29 903.658 931.738 916.422 867.92 964.923 829.63 941.949 778.576 783.681 804.103 765.812 635.624 770.917 556.49 650.94 668.809 597.333 939.396 681.573 1018.53 684.125 1207.43'
  }
  return (
    <>
    <PopupModal name="globe">
      <div className="flex flex-col items-center w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Visited Countries</h2>
        <p className="text-gray-300 mb-6 text-center text-sm">
          Countries I've visited around the world
        </p>
        
        <div className="w-full h-[500px] relative">
          <GlobeContent/>
        </div>
      </div>
    </PopupModal>
    <Shape shape={shape} index="globe" />
    </>
  );
};

export default GlobeModal;