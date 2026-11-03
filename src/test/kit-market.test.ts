import { describe, expect, it } from "vitest";
import { checkoutLink, resolveMarket, formatLocalPrice, markets } from "@/lib/kit-market";
import { kitCopy } from "@/lib/kit-copy";

describe("LATAM purchase flow", () => {
  it("lets campaign country override storage and browser locale", () => {
    expect(resolveMarket("?country=CO", "MX", "pt-BR")[0]).toBe("CO");
    expect(resolveMarket("", "MX", "es-CO")[0]).toBe("MX");
    expect(resolveMarket("", null, "es-CO")[0]).toBe("CO");
    expect(resolveMarket("?country=invalid", null, "es")[0]).toBe("MX");
  });
  it("keeps campaign attribution without forwarding arbitrary parameters", () => {
    const url = new URL(
      checkoutLink(
        "?country=CO&lang=es&utm_source=meta&utm_campaign=Familia%20Colombia&fbclid=abc&email=private&redirect=https://evil.example",
      ),
    );
    expect(url.origin + url.pathname).toBe("https://pay.cakto.com.br/3fixz3y_1272141");
    expect(url.searchParams.get("utm_campaign")).toBe("Familia Colombia");
    expect(url.searchParams.get("fbclid")).toBe("abc");
    expect(url.searchParams.has("email")).toBe(false);
    expect(url.searchParams.has("redirect")).toBe(false);
    expect(url.searchParams.has("country")).toBe(false);
  });
  it("prefers detected IP country over browser language while keeping explicit choices", () => {
    expect(resolveMarket("", null, "pt-BR", "MX")[0]).toBe("MX");
    expect(resolveMarket("", null, "pt-BR", "CO")[0]).toBe("CO");
    expect(resolveMarket("?country=BR", null, "pt-BR", "MX")[0]).toBe("BR");
    expect(resolveMarket("", "CO", "pt-BR", "MX")[0]).toBe("CO");
    expect(resolveMarket("", null, "pt-BR", null)[0]).toBe("BR");
  });
  it("uses explicit currency codes and local precision", () => {
    expect(formatLocalPrice(20, markets[0])).toBe("MXN 158.00");
    expect(formatLocalPrice(4000, markets[1])).toBe("COP 31.600");
  });
  it("provides complete language dictionaries and discloses the PDF language", () => {
    for (const locale of Object.values(kitCopy)) {
      expect(Object.keys(locale).sort()).toEqual(Object.keys(kitCopy.es).sort());
      expect(locale.faq).toHaveLength(8);
      expect(locale.bookText).toHaveLength(3);
      expect(locale.bonusText).toHaveLength(5);
      expect(locale.note).toContain("El Amor de Dios");
    }
  });
});
