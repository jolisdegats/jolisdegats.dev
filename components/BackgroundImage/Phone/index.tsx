import Shape, { ShapeType } from "@/components/BackgroundImage/Shape";
import phoneOn from '@/assets/phone.webp';
import { togglePhone } from "@/lib/context";
import { useAppContext } from "@/lib/hooks";
import Image from "next/image";


export const MarkerPhone = () => {
    const { dispatch } = useAppContext(); 
    const shape : ShapeType= {
        type:"rectangle",
        onClick:() => dispatch(togglePhone()),
        title: '',
        x:1531.6239316239316 ,
        y:1003.2136752136752, 
        width:86.79202279202286,
        height:12.763532763533021 
    }
    return <Shape shape={shape} index="phone"/>
}

export const ImagePhone = ()=>{
    const { state : {isPhoneOn} } = useAppContext(); 
    return <div style={{ width: '100%', height: '100%' }}>  
    <Image 
    alt="phone"
    src={phoneOn} 
    fill 
    className={`object-cover ${isPhoneOn ? 'opacity-100' : 'opacity-0'}`} />
    </div>
   }
