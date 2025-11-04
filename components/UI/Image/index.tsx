import Image from 'next/image';

// const Image = ({ src, alt, placeholder, ...props }: ImageProps) => {
//   let blurHash: string | undefined;
  
//   if (placeholder === 'blur') {
//     const extractFilename = (path: string): string => {
//       const basename = path.split('/').pop() || '';
//       return basename.replace(/\.([a-f0-9]{8})(\.[^.]+)$/, '$2').replace(/^\./, '');
//     };
    
//     if (typeof src === 'string') {
//       const filename = extractFilename(src);
//       if (filename) {
//         blurHash = blurHashes[filename as keyof typeof blurHashes];
//       }
//     } else if (src && typeof src === 'object' && 'src' in src) {
//       const filename = extractFilename((src as StaticImageData).src);
//       if (filename) {
//         blurHash = blurHashes[filename as keyof typeof blurHashes];
//       }
//     }
//   }
  
//   return (
//     <NextImage 
//       src={src} 
//       alt={alt} 
//       {...(blurHash ? { blurDataURL: blurHash } : {})}
//       {...props} 
//     />
//   );
// };

export default Image;