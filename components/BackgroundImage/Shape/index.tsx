import { useAppContext } from '@/lib/hooks';
import React, { useEffect, useState } from 'react';

interface CommonShapeProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  title?: string;
}

interface RectangleShapeType extends CommonShapeProps {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PolygonShapeType extends CommonShapeProps {
  type: 'polygon';
  points: string;
}

export type ShapeType = RectangleShapeType | PolygonShapeType;

export type ShapeLinkProps = {
  shape: ShapeType;
  index: number | string;
};

const markerColor = '#75BABD';

const Shape = ({ shape, index }: ShapeLinkProps) => {
  const { state: { showHelpMarkers } } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (showHelpMarkers) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [showHelpMarkers]);

  const markerX = shape.type === 'rectangle' 
    ? shape.x + shape.width / 2 
    : getPolygonCenter(shape.points).x;
  const markerY = shape.type === 'rectangle' 
    ? shape.y + shape.height / 2 
    : getPolygonCenter(shape.points).y;
    
  return (
    <a className="cursor-pointer" key={index} target={shape.href?.startsWith('http') ? "_blank" : "_self"} {...shape} style={{zIndex : 10, ...shape.style}}>
      <g>
        {shape.type === 'rectangle' && (
          <rect
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            className="image-mapper-shape"
            data-index={index}
          />
        )}
        {shape.type === 'polygon' && (
          <polygon
            className="image-mapper-shape"
            data-index={index}
            points={shape.points}
          />
        )}
        {shouldRender && (
          <g 
            transform={`translate(${markerX}, ${markerY})`} 
            className={`pointer-events-none transition-opacity duration-500 ease-in-out 
              ${isVisible ? "opacity-100" : "opacity-0"}`}
          >
            <circle r="20" fill={markerColor} className="animate-pulse" />
            <circle r="10" fill={markerColor} />
          </g>
        )}
      </g>
    </a>
  );
};

export function getPolygonCenter(points: string) {
  const coordinates = points.split(' ').map(Number);
  let sumX = 0, sumY = 0;
  for (let i = 0; i < coordinates.length; i += 2) {
    sumX += coordinates[i];
    sumY += coordinates[i + 1];
  }
  return {
    x: sumX / (coordinates.length / 2),
    y: sumY / (coordinates.length / 2)
  };
}

export default Shape;
