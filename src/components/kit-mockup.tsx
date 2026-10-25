import { mockupSrcSet, mockupSizes } from '@/lib/kit-mockup';

export function KitMockup({ alt, className, priority = false }: {
 alt: string; className?: string; priority?: boolean;
}) {
 return <img src="/assets/kit-mockup-fast-w400.webp" srcSet={mockupSrcSet}
   sizes={mockupSizes} alt={alt} className={className} decoding="async"
   width="1448" height="1086" loading={priority ? 'eager' : 'lazy'}
   fetchPriority={priority ? 'high' : 'auto'}/>;
}
