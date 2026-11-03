import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";

// Read country only; never return or store the visitor's IP.
export const detectCountry = createServerFn({ method: "GET" }).handler(() => {
  setResponseHeader("Cache-Control", "private, no-store");
  const country = getRequestHeader("x-vercel-ip-country");
  return country && /^[A-Z]{2}$/.test(country) ? country : null;
});
