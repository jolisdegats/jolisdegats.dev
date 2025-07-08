import { useEffect, useCallback, ReactNode, useRef, useState } from 'react';
import { useAppContext } from '@/lib/hooks';
import Portal from '@/components/UI/Portal';
import { changeModal } from '@/lib/context';

type ModalProps = {
  children: ReactNode;
  handleClose?: () => void;
  name: string;
  onAnimationComplete?: () => void;
};

const Modal = ({ children, handleClose, name, onAnimationComplete }: ModalProps) => {
  const { state: { modalOpen }, dispatch } = useAppContext();
  const modalRef = useRef<HTMLDivElement>(null);
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
          onAnimationComplete();
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
        className={`fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-[999] p-5 ${
          isAnimating ? 'modal-backdrop-exit' : 'modal-backdrop-enter'
        }`}
        onClick={handleOutsideClick}
      >
        <div
          ref={modalRef}
          className={`w-[90%] max-w-[1000px] max-h-[600px] bg-[#1b1d23] text-white flex flex-col items-center justify-start rounded-[10px] overflow-hidden md:w-[90%] md:h-auto h-full ${
            isAnimating ? 'modal-content-exit' : 'modal-content-enter'
          }`}
        >
          <div className="flex justify-end w-full p-[10px]">
            <button onClick={onCloseModal} className="text-white cursor-pointer text-base py-2 px-4 bg-transparent border-none">
              X
            </button>
          </div>
          <div className="w-full px-5 lg:px-10 pb-10 pt-0 overflow-hidden flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;