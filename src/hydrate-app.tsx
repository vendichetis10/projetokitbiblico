import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start/client';

export function hydrate() {
 startTransition(() => {
  hydrateRoot(document, <StrictMode><StartClient/></StrictMode>);
 });
}
