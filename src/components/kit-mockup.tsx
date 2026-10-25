import kit from '@/assets/kit-biblico-5-bonos.webp.asset.json';
import { imageProps } from '@/lib/responsive-images';
import { mockupAvifSrcSet, mockupSizes } from '@/lib/kit-mockup';

export function KitMockup({ alt, className, priority = false }: {
 alt: string; className?: string; priority?: boolean;
}) {
 return <picture>
  <source type="image/avif" srcSet={mockupAvifSrcSet} sizes={mockupSizes}/>
  <img {...imageProps(kit.url, mockupSizes)} alt={alt} className={className}
   width="1448" height="1086" loading={priority ? 'eager' : 'lazy'}
   fetchPriority={priority ? 'high' : 'auto'}/>
 </picture>;
}
