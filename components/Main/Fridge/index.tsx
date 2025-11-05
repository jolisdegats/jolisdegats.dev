import { useAppContext } from "@/lib/hooks";
import Shape from "@/components/Main/Shape";
import type { ShapeType } from "@/components/Main/Shape";
import { toggleFridge } from "@/lib/context";
import fridgeOpen from '@/assets/fridge2.png';
import Image from "@/components/UI/Image";


const MarkerFridge = () => {

  const { state : {isFridgeOpen}, dispatch } = useAppContext();

    const shape : ShapeType = {
      onClick: () => dispatch(toggleFridge()),
      type: 'polygon',
      points: "1723.08 781.128 1832.84 763.259 2151.93 765.812 2139.17 1243.17 2037.06 1217.64 2037.06 1460.15 1835.4 1452.49 1720.52 1368.25",

      }
      return (
        <>
        <div style={{ width: '100%', height: '100%' }}>  
    <Image
    alt="fridge"
    src={fridgeOpen} 
    fill 
    className={`object-cover ${isFridgeOpen ? 'opacity-100' : 'opacity-0'}`} />
    </div>

          <Shape shape={shape} index="fridge"/>
        </>
      )
}

export default MarkerFridge;