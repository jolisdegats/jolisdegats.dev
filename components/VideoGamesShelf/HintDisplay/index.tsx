import { PiHandSwipeLeft, PiHandSwipeRight } from "react-icons/pi";
import { RiSpace } from "react-icons/ri";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

interface HintDisplayProps {
  isVisible: boolean;
}

export const HintDisplay = ({ isVisible }: HintDisplayProps) => {
  return (
    <div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-opacity-30 hover:text-opacity-100 text-sm transition-all duration-500"
      style={{ opacity: isVisible ? 1 : 0, bottom: isVisible ? "40px" : "30px" }}
    >
      <div className="text-center">
        {/* Desktop keyboard hint */}
        <div className="items-center justify-center gap-2 hidden md:flex text-2xl bg-white bg-opacity-0 text-white text-opacity-30">
          <FaLongArrowAltLeft className="border-2 border-white border-opacity-30 rounded-md p-1" />
          /
          <RiSpace className="border-2 border-white border-opacity-30 rounded-md p-1" />
          /
          <FaLongArrowAltRight className="border-2 border-white border-opacity-30 rounded-md p-1" />
        </div>

        {/* Mobile swipe hint */}
        <div className="flex items-center justify-center gap-2 md:hidden text-2xl bg-white bg-opacity-0 text-white text-opacity-30">
          <PiHandSwipeLeft /> / <PiHandSwipeRight />
        </div>
      </div>
    </div>
  );
};
