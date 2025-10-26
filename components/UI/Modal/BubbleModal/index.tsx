import { changeModal } from "@/lib/context";
import { useAppContext } from "@/lib/hooks";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Portal from "../../Portal";

type BubbleModalProps = {
  children: ReactNode;
  height: string;
  width: string;
  x: string;
  y: string;
  name: string;
};

const BubbleModal = ({
  name, children, height, width, x, y
}: BubbleModalProps) => {
  const { state: { modalOpen }, dispatch } = useAppContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
      
  const onCloseModal = useCallback(() => {
    setIsAnimating(true);
    // Wait for animation to complete
    setTimeout(() => {
      dispatch(changeModal({ name: '' }));
      setIsVisible(false);
      setIsAnimating(false);
    }, 300);
  }, [dispatch]);


  useEffect(() => {
    const handleScroll = () => onCloseModal();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onCloseModal]);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => e.key === 'Escape' ? onCloseModal() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [onCloseModal]);

  useEffect(() => {
    if (modalOpen.name === name) {
      setIsVisible(true);
      setIsAnimating(false);
    }
  }, [modalOpen.name, name]);

  if (!isVisible) return null;

  return (
    <Portal wrapperId="bubble-portal">
      <div className="z-[50] absolute top-0 left-0 w-full h-full" onClick={onCloseModal}></div>
    <div
      ref={modalRef}
      style={{
        position: "absolute",
        height,
        width,
        top: y,
        left: x,
        clipPath: "circle(50% at 50% 50%)",
        WebkitClipPath: "circle(50% at 50% 50%)",
        zIndex: 999,
      }}
      className={`bg-white rounded-full border-4 border-white text-white overflow-hidden ${
        isAnimating ? "modal-content-exit" : "modal-content-enter"
      }`}
    >
      <div className="w-full h-full px-5 lg:px-10 pb-10 pt-0 overflow-hidden">
        {children}
      </div>
    </div>
    </Portal>
  );
};

export default BubbleModal;