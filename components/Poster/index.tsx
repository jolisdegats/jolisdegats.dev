import Shape from '@/components/Shape'
import type { ShapeType } from '@/components/Shape'

const MarkerPoster = () => {
  const shape: ShapeType = {
    type: 'rectangle',
    x: 781.1282051282051,
    y: 513.0940170940171,
    width: 160.82051282051282,
    height: 257.8233618233618
  }
  return <Shape shape={shape} index="poster" />
}

export default MarkerPoster
