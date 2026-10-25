// Keep the preload and picture candidates identical to avoid duplicate downloads.
export const mockupSizes = '(max-width: 767px) calc(100vw - 48px), 570px';
export const mockupAvifSrcSet = [400, 720, 1080]
 .map(width => `/assets/kit-biblico-5-bonos-w${width}.avif ${width}w`).join(', ');
