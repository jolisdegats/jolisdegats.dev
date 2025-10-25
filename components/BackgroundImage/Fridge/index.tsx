import { useAppContext } from "@/lib/hooks";
import Shape from "@/components/BackgroundImage/Shape";
import type { ShapeType } from "@/components/BackgroundImage/Shape";
import { toggleFridge } from "@/lib/context";
import fridgeOpen from '@/assets/fridge2.png';


const MarkerFridge = () => {

  const { state : {isFridgeOpen}, dispatch } = useAppContext();

    const shape : ShapeType = {
      onClick: () => dispatch(toggleFridge()),
      type: 'polygon',
      points: "1723.08 781.128 1832.84 763.259 2151.93 765.812 2139.17 1243.17 2037.06 1217.64 2037.06 1460.15 1835.4 1452.49 1720.52 1368.25",

      }
      return (
        <>
       {isFridgeOpen && <image  xlinkHref={fridgeOpen.src} className="h-full w-full absolute top-0 right-0"/>}
          <Shape shape={shape} index="fridge"/>
        </>
      )
}

export default MarkerFridge;