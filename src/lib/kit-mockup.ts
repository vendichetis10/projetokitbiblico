// Keep the preload and picture candidates identical to avoid duplicate downloads.
export const mockupSizes = '(max-width: 767px) calc(100vw - 48px), 570px';
export const mockupSrcSet = [400, 720, 1080]
 .map(width => `/assets/kit-mockup-fast-w${width}.webp ${width}w`).join(', ');
