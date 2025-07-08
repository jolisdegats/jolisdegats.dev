import Shape, { ShapeType } from "@/components/BackgroundImage/Shape";
import { useAppContext } from "@/lib/hooks";
import { changeModal } from "@/lib/context/ actions";
import Modal from "@/components/UI/Modal";
import Image from "next/image";
import avatar from "@/assets/avatar.webp";
import Head from "next/head";

export const MarkerMe = () => {
    const { dispatch } = useAppContext(); 
   
    const onClickOnMe = () => {
        dispatch(changeModal({name : "me"}));
    }

    const shape : ShapeType= {
        onClick:onClickOnMe,
        title: 'me',
        type: 'polygon',
        points: "1284.01 964.923 1268.7 998.108 1243.17 1021.08 1222.75 1003.21 1284.01 852.604 1296.77 732.627 1340.17 704.547 1391.23 717.311 1416.75 793.892 1455.04 890.895 1480.57 993.003 1480.57 1164.03 1439.73 1215.09 1406.54 1240.62 1335.07 1250.83 1337.62 1317.2 1465.25 1301.88 1447.38 1414.2 1337.62 1358.04 1271.25 1426.96 1266.14 1350.38 1235.51 1337.62 1179.35 1360.59 1187.01 1317.2 1209.98 1263.59 1171.69 1100.22 1255.93 1092.56",
    }
    return <>
    <Head>
    <link rel="preload" href={avatar.src} as="image" type="image/webp"/>
    </Head>
    <Modal name="me">
       <div className="max-h-[80vh] overflow-auto p-4">
         <div className="flex flex-col lg:flex-row items-center gap-8 h-full">
           <div className="text-white w-full lg:w-1/2 order-1 lg:order-1">
             <p className="text-3xl font-bold mb-5">Hey, I&apos;m Julie,</p>
             <div className="text-sm">
               <p>I&apos;ve been hooked on technology ever since I got my first computer at 4 (blame my parents!), and that passion never faded.</p>
               <br/>
               <p>After spending years in marketing and strategy at startups, I felt the pull towards a more concrete and technical form of problem-solving. That&apos;s where web development came in! This career switch enabled me to blend creativity with logic as I explored frontend development and enjoyed some backend challenges along the way.</p>
               <br/>
               <p>When I&apos;m not coding, you&apos;ll find me working on some DIY projects, solving escape rooms, or binge-watching anime. I have a soft spot for pasta and French cuisine (but please note that coriander is my sworn enemy).</p>
               <br/>
               <p>Ready to connect and create awesome things together!</p>
             </div>
           </div>
           <div className="lg:h-full w-full lg:w-1/2 order-2 lg:order-2">
             <div className="relative h-[300px] lg:h-full w-full">
               <Image src={avatar.src} alt="avatar" fill className="object-cover" sizes="400px"/>
             </div>
           </div>
         </div>
       </div>
    </Modal>
    <Shape shape={shape} index="me"/>
    </>
}