import { ReactNode, useCallback, useEffect, useState } from 'react';
import Portal from '@/components/UI/Portal';
import { useAppContext } from '@/lib/hooks';
import { changeModal } from '@/lib/context';


type PopupModalProps =  {
  children: ReactNode;
  name: string;
  handleClose?: () => void;
  onAnimationComplete?: () => void;
};

const PopupModal = ({ children, name, handleClose, onAnimationComplete}: PopupModalProps) => {
  const { state: { modalOpen }, dispatch } = useAppContext();
        const [isVisible, setIsVisible] = useState(false);
        const [isAnimating, setIsAnimating] = useState(false);
      
        const onCloseModal = useCallback(() => {
          setIsAnimating(true);
          // Wait for animation to complete
          setTimeout(() => {
            handleClose?.();
            dispatch(changeModal({ name: '' }));
            setIsVisible(false);
            setIsAnimating(false);
          }, 300);
        }, [handleClose, dispatch]);
      
        const handleOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) {
            onCloseModal();
          }
        }, [onCloseModal]);
      
        useEffect(() => {
          if (modalOpen.name === name) {
            setIsVisible(true);
            setIsAnimating(false);
            if (onAnimationComplete) {
              setTimeout(() => {
                onAnimationComplete?.();
              }, 300); // Match animation duration
            }
          }
        }, [modalOpen.name, name, onAnimationComplete]);
      
        useEffect(() => {
          const closeOnEscapeKey = (e: KeyboardEvent) => e.key === 'Escape' ? onCloseModal() : null;
          document.body.addEventListener('keydown', closeOnEscapeKey);
          return () => {
            document.body.removeEventListener('keydown', closeOnEscapeKey);
          };
        }, [onCloseModal]);
      
        if (!isVisible) return null;
      
  return (
    <Portal wrapperId="react-portal-modal-container">
      <div
        className={`bg-black/60 fixed inset-0 flex flex-col items-center justify-center z-[999] p-5 ${
          isAnimating ? 'modal-backdrop-exit' : 'modal-backdrop-enter'
        }`}
        onClick={handleOutsideClick}
      >
        <div
            className={`flex flex-col items-center justify-start bg-[#1b1d23] rounded-[10px] text-white overflow-hidden w-full md:w-[90%] md:h-auto h-full max-w-[1000px] ${
            isAnimating ? 'modal-content-exit' : 'modal-content-enter'
          }`}
        >
       <div className="flex justify-end w-full p-[10px]">
            <button onClick={onCloseModal} className="text-white cursor-pointer text-base py-2 px-4 bg-transparent border-none">
              X
            </button>
          </div>
          <div className="w-full px-5 lg:px-10 pb-10 pt-0 overflow-hidden flex flex-col grow">
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default PopupModal;