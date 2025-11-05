
import type { ShapeType } from "@/components/Main/Shape";
import Shape from "@/components/Main/Shape";

const MarkerComputer = () => {
    const shape : ShapeType = {
        href: 'https://github.com/jolisdegats',
        title: 'Github - Jolisdegats',
        type: 'polygon',
        points: "1243.17 1018.53 1263.59 1005.77 1278.91 987.897 1281.46 1021.08 1141.06 1018.53 1125.74 993.003 1128.3 860.262 1289.12 857.709 1263.59 875.578 1243.17 985.345 1220.19 1000.66",
      }
    return (
        <Shape shape={shape} index="computer"/>
    )
}

export { MarkerComputer };