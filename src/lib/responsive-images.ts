import manifest from './responsive-images.json';

type ResponsiveAsset = { width: number; height: number; variants: { url: string; width: number }[] };
const images: Record<string, ResponsiveAsset> = manifest;

// Thumbnails use only the pixels needed for the display and device density.
// Original URLs remain available for the image lightbox.
export function imageProps(url: string, sizes: string) {
 const image = images[url];
 if (!image || !image.variants.length) return { src: url };
 return {
  src: image.variants[0]!.url,
  srcSet: image.variants.map(v => `${v.url} ${v.width}w`).join(', '),
  sizes,
  width: image.width,
  height: image.height,
 };
}
