import { useEffect, useCallback, ReactNode, useRef } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { useAppContext } from '@/lib/hooks';
import Portal from '@/components/UI/Portal';
import { changeModal } from '@/lib/context';

type ModalProps = {
  children: ReactNode;
  handleClose?: () => void;
  name: string;
};

const Modal = ({ children, handleClose, name }: ModalProps) => {
  const { state: { modalOpen }, dispatch } = useAppContext();
  const modalRef = useRef<HTMLDivElement>(null);

  const onCloseModal = useCallback(() => {
    handleClose?.();
    dispatch(changeModal({ name: '' }));
  }, [handleClose, dispatch]);

  const handleOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCloseModal();
    }
  }, [onCloseModal]);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => e.key === 'Escape' ? onCloseModal() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [onCloseModal]);

  return (
    <Portal wrapperId="react-portal-modal-container">
      <AnimatePresence>
        {modalOpen.name === name && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-[999] p-5"
            onClick={handleOutsideClick}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="w-[90%] max-w-[1000px] max-h-[600px] bg-[#1b1d23] text-white flex flex-col items-center justify-start rounded-[10px] overflow-hidden md:w-[90%] md:h-auto h-full"
            >
              <div className="flex justify-end w-full p-[10px]">
                <button onClick={onCloseModal} className="text-white cursor-pointer text-base py-2 px-4 bg-transparent border-none">
                  X
                </button>
              </div>
              <div className="w-full px-5 lg:px-10 pb-10 pt-0 overflow-hidden flex flex-col">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Modal;