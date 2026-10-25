import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader, setResponseHeader } from '@tanstack/react-start/server';

// Vercel already resolves the request country. Render it on the first frame
// instead of changing the hero after a third-party geolocation round trip.
export const getRequestCountry = createServerFn({ method: 'GET' }).handler(() => {
 setResponseHeader('Vary', 'X-Vercel-IP-Country');
 const country = getRequestHeader('x-vercel-ip-country')?.toUpperCase() ?? '';
 return /^[A-Z]{2}$/.test(country) ? country : '';
});
