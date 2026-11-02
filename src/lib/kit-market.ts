export const BASE_PRICE = 7.9;
export const CHECKOUT = "https://pay.kiwify.com/n3l7mr7";
export const markets = [
  ["MX", "México", "MXN", "es-MX"],
  ["CO", "Colombia", "COP", "es-CO"],
  ["CL", "Chile", "CLP", "es-CL"],
  ["PE", "Perú", "PEN", "es-PE"],
  ["AR", "Argentina", "ARS", "es-AR"],
  ["EC", "Ecuador", "USD", "es-EC"],
  ["BO", "Bolivia", "BOB", "es-BO"],
  ["UY", "Uruguay", "UYU", "es-UY"],
  ["PY", "Paraguay", "PYG", "es-PY"],
  ["GT", "Guatemala", "GTQ", "es-GT"],
  ["CR", "Costa Rica", "CRC", "es-CR"],
  ["DO", "Rep. Dominicana", "DOP", "es-DO"],
  ["PA", "Panamá", "USD", "es-PA"],
  ["HN", "Honduras", "HNL", "es-HN"],
  ["SV", "El Salvador", "USD", "es-SV"],
  ["NI", "Nicaragua", "NIO", "es-NI"],
  ["BR", "Brasil", "BRL", "pt-BR"],
  ["US", "United States", "USD", "en-US"],
  ["ES", "España", "EUR", "es-ES"],
  ["OTHER", "Otro país / Other", "USD", "es"],
] as const;
export type Market = (typeof markets)[number];
export type Language = "es" | "pt" | "en";
export function getMarket(code: string | null | undefined): Market | undefined {
  return markets.find((m) => m[0] === code?.toUpperCase());
}
export function resolveMarket(
  query: string,
  saved?: string | null,
  browserLocale?: string,
): Market {
  const params = new URLSearchParams(query);
  const region = browserLocale?.includes("-") ? browserLocale.split("-").at(-1) : undefined;
  return getMarket(params.get("country")) || getMarket(saved) || getMarket(region) || markets[0];
}
export function formatLocalPrice(rate: number, market: Market) {
  const digits = ["COP", "CLP", "PYG", "CRC", "ARS"].includes(market[2]) ? 0 : 2;
  return `${market[2]} ${new Intl.NumberFormat(market[3], { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(BASE_PRICE * rate)}`;
}
export function checkoutLink(search: string) {
  const url = new URL(CHECKOUT);
  const incoming = new URLSearchParams(search);
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "src",
    "sck",
    "fbclid",
    "gclid",
    "ttclid",
  ]) {
    const value = incoming.get(key);
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}
export function trackKit(event: string, detail: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const data = { event, product: "kit-biblico", value: BASE_PRICE, currency: "USD", ...detail };
  const analytics = window as Window & { dataLayer?: unknown[] };
  analytics.dataLayer = analytics.dataLayer || [];
  analytics.dataLayer.push(data);
  window.dispatchEvent(new CustomEvent(event, { detail: data }));
}
