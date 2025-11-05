import Image from 'next/image';
import type { ImageProps } from 'next/image';

interface CustomImageProps extends ImageProps {
  onLoad?: () => void;
}

export default function CustomImage(props: CustomImageProps) {
  return <Image {...props} />;
}