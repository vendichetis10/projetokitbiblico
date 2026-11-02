import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { KitPage } from "@/components/kit-page";
let root: Root | undefined;
let container: HTMLDivElement;
afterEach(async () => {
  if (root) await act(async () => root?.unmount());
  container?.remove();
  vi.unstubAllGlobals();
  sessionStorage.clear();
});
async function mount() {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root?.render(<KitPage />));
}
async function choose(label: string, value: string) {
  const select = container.querySelector<HTMLSelectElement>(`select[aria-label="${label}"]`)!;
  await act(async () => {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
}
describe("Localized sales page", () => {
  it("retains a usable checkout when rates fail and separates language from country", async () => {
    window.history.replaceState(null, "", "/kit-biblico?country=CO&utm_source=meta");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await mount();
    expect(container.querySelector('select[aria-label="País / moneda"]')).toHaveValue("CO");
    expect(container.querySelector("h1")).toHaveTextContent("Un momento menos de pantalla.");
    const purchase = container.querySelector('a[data-placement="hero"]')!;
    expect(purchase.getAttribute("href")).toContain("utm_source=meta");
    expect(purchase.getAttribute("href")).toContain("https://pay.kiwify.com/n3l7mr7");
    expect(container.textContent).toContain("US$ 7.90");
    await choose("Idioma", "en");
    expect(container.querySelector("h1")).toHaveTextContent("One less moment on a screen.");
    expect(container.textContent).toContain("From your inbox to the activity table.");
    expect(container.querySelector('select[aria-label="Country / currency"]')).toHaveValue("CO");
    expect(document.documentElement.lang).toBe("en");
  });
  it("updates all purchase prices for Mexico and Colombia", async () => {
    window.history.replaceState(null, "", "/kit-biblico?country=MX");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({ result: "success", rates: { USD: 1, MXN: 20, COP: 4000 } }),
        }),
    );
    await mount();
    expect(container.textContent?.match(/≈ MXN 158.00/g)).toHaveLength(3);
    await choose("País / moneda", "CO");
    expect(container.textContent?.match(/≈ COP 31.600/g)).toHaveLength(3);
    expect(container.textContent?.match(/Precio base: US\$ 7.90/g)).toHaveLength(2);
  });
});
