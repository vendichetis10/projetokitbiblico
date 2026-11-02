import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Check, Download, Printer, ShieldCheck } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import kit from "@/assets/kit-biblico-5-bonos.webp.asset.json";
import childActivity from "@/assets/adan-actividad-en-casa.webp.asset.json";
import prayerSample from "@/assets/orar-sample.jpg.asset.json";
import loveSample from "@/assets/amor-sample.jpg.asset.json";
import { books, bonuses, deliverables } from "@/lib/kit-deliverables";
import { imageProps } from "@/lib/responsive-images";
import { kitCopy } from "@/lib/kit-copy";
import {
  BASE_PRICE,
  CHECKOUT,
  markets,
  resolveMarket,
  getMarket,
  formatLocalPrice,
  checkoutLink,
  trackKit,
  type Language,
  type Market,
} from "@/lib/kit-market";

const samples = [childActivity, prayerSample, loveSample];
function readSaved(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function save(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* Storage is optional. */
  }
}
function useMarket() {
  const [market, setMarket] = useState<Market>(markets[0]);
  const [language, setLanguage] = useState<Language>("es");
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [href, setHref] = useState(CHECKOUT);
  useEffect(() => {
    setMarket(resolveMarket(location.search, readSaved("kit-country-v2"), navigator.language));
    const lang = new URLSearchParams(location.search).get("lang") || readSaved("kit-language-v2");
    if (lang === "es" || lang === "pt" || lang === "en") setLanguage(lang);
    setHref(checkoutLink(location.search));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    let active = true;
    const load = async () => {
      try {
        const saved = JSON.parse(readSaved("kit-fx-v2") || "null");
        if (saved?.at > Date.now() - 3600000 && saved.rates) {
          setRates(saved.rates);
          return;
        }
        const response = await fetch("https://open.er-api.com/v6/latest/USD", {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        if (active && data.result === "success" && data.rates) {
          const valid: Record<string, number> = { USD: 1 };
          for (const [, , currency] of markets) {
            const rate = Number(data.rates[currency]);
            if (Number.isFinite(rate) && rate > 0) valid[currency] = rate;
          }
          setRates(valid);
          save("kit-fx-v2", JSON.stringify({ at: Date.now(), rates: valid }));
        }
      } catch {
        /* USD remains usable if exchange rates fail. */
      } finally {
        clearTimeout(timeout);
      }
    };
    void load();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const chooseMarket = (country: string) => {
    const next = getMarket(country);
    if (!next) return;
    setMarket(next);
    save("kit-country-v2", country);
    trackKit("kit_market_change", { country, language });
  };
  const chooseLanguage = (lang: Language) => {
    setLanguage(lang);
    save("kit-language-v2", lang);
  };
  const rate = Number(rates[market[2]]);
  const local =
    market[2] !== "USD" && Number.isFinite(rate) && rate > 0
      ? formatLocalPrice(rate, market)
      : null;
  return { market, language, chooseMarket, chooseLanguage, local, href };
}
export function KitPage() {
  const { market, language, chooseMarket, chooseLanguage, local, href } = useMarket();
  const t = kitCopy[language];
  const offerRef = useRef<HTMLElement>(null);
  const offerTracked = useRef(false);
  const [expanded, setExpanded] = useState<{ url: string; label: string } | null>(null);
  useEffect(() => {
    const offer = offerRef.current;
    if (!offer || offerTracked.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          offerTracked.current = true;
          trackKit("kit_offer_view", { country: market[0], language });
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(offer);
    return () => observer.disconnect();
  }, [market, language]);
  const buy = (placement: string, compact = false) => (
    <a
      className={`latam-buy ${compact ? "latam-buy-compact" : ""}`}
      href={href}
      data-placement={placement}
      onClick={() => trackKit("kit_checkout_click", { placement, country: market[0], language })}
    >
      {compact ? t.sticky : t.buy}
      <ArrowRight size={19} aria-hidden="true" />
    </a>
  );
  const price = () => (
    <div className="latam-price">
      {local ? (
        <>
          <span>{t.estimate}</span>
          <strong>≈ {local}</strong>
          <small>
            {t.base}: US$ {BASE_PRICE.toFixed(2)}
          </small>
        </>
      ) : (
        <>
          <span>{t.total}</span>
          <strong>US$ {BASE_PRICE.toFixed(2)}</strong>
        </>
      )}
      <small>{t.single}</small>
    </div>
  );
  const openSample = (i: number) => {
    const sample = samples[i];
    const label = t.sampleLabels[i];
    if (!sample || !label) return;
    setExpanded({ url: sample.url, label });
    trackKit("kit_sample_open", { sample: i + 1, country: market[0], language });
  };
  return (
    <div className="page latam-page">
      <header className="latam-header">
        <div className="latam-container latam-header-inner">
          <a className="latam-brand" href="#inicio">
            <BookOpen aria-hidden="true" size={23} />
            <span>Kit Bíblico Infantil</span>
          </a>
          <div className="latam-selectors">
            <label>
              <span>{t.country}</span>
              <select
                aria-label={t.country}
                value={market[0]}
                onChange={(e) => chooseMarket(e.target.value)}
              >
                {markets.map((m) => (
                  <option key={m[0]} value={m[0]}>
                    {m[1]} · {m[2]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>{t.language}</span>
              <select
                aria-label={t.language}
                value={language}
                onChange={(e) => chooseLanguage(e.target.value as Language)}
              >
                <option value="es">Español</option>
                <option value="pt">Português</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
        </div>
      </header>
      <main>
        <section className="latam-hero" id="inicio" aria-labelledby="kit-heading">
          <div className="latam-container latam-hero-grid">
            <div className="latam-hero-copy">
              <p className="latam-eyebrow">{t.kicker}</p>
              <h1 id="kit-heading">
                {t.title}
                <br />
                <em>{t.accent}</em>
              </h1>
              <p className="latam-lead">{t.intro}</p>
              <p className="latam-bundle">
                <Check size={18} aria-hidden="true" />
                {t.bundle}
              </p>
            </div>
            <figure className="latam-hero-art">
              <img
                {...imageProps(kit.url, "(max-width: 767px) calc(100vw - 32px), 570px")}
                alt={t.bundle}
                width="1448"
                height="1086"
                fetchPriority="high"
              />
              <figcaption>{t.included}</figcaption>
            </figure>
            <div className="latam-hero-purchase">
              {price()}
              {buy("hero")}
              <a className="latam-secondary" href="#actividades">
                {t.see} ↓
              </a>
              <p className="latam-price-note">{local ? t.conversion : t.fallback}</p>
              <p className="latam-format">{t.format}</p>
            </div>
          </div>
          <ul className="latam-container latam-trust">
            {t.trust.map((text, i) => {
              const Icon = [Download, ShieldCheck, Printer][i] || Check;
              return (
                <li key={text}>
                  <Icon size={20} aria-hidden="true" />
                  {text}
                </li>
              );
            })}
          </ul>
        </section>
        <section
          className="latam-section latam-samples"
          id="actividades"
          aria-labelledby="samples-heading"
        >
          <div className="latam-container">
            <div className="latam-heading">
              <p className="latam-eyebrow">{t.sampleKicker}</p>
              <h2 id="samples-heading">{t.sampleTitle}</h2>
              <p>{t.sampleIntro}</p>
            </div>
            <div className="latam-sample-grid">
              {samples.map((sample, i) => (
                <article key={sample.url}>
                  <button
                    className="latam-sample-button"
                    type="button"
                    aria-label={`${t.expand}: ${t.sampleLabels[i]}`}
                    onClick={() => openSample(i)}
                  >
                    <img
                      {...imageProps(sample.url, "(max-width: 767px) 75vw, 320px")}
                      alt={t.sampleLabels[i]}
                      loading="lazy"
                    />
                    <span>{t.expand} ↗</span>
                  </button>
                  <h3>{t.sampleLabels[i]}</h3>
                </article>
              ))}
            </div>
            <p className="latam-note">{t.sampleNote}</p>
            <div className="latam-mini-cta">{buy("samples")}</div>
          </div>
        </section>
        <section className="latam-section" aria-labelledby="books-heading">
          <div className="latam-container">
            <div className="latam-heading">
              <p className="latam-eyebrow">{t.booksKicker}</p>
              <h2 id="books-heading">{t.booksTitle}</h2>
              <p>{t.booksIntro}</p>
            </div>
            <div className="latam-book-grid">
              {books.map((book, i) => (
                <article className="latam-book" key={book.name}>
                  <img
                    {...imageProps(book.image.url, "(max-width: 767px) 100px, 160px")}
                    alt={book.name}
                    loading="lazy"
                  />
                  <div>
                    <span className="latam-tag">
                      {book.pages} {t.pages} · PDF
                    </span>
                    <h3>{book.name}</h3>
                    <p>{t.bookText[i]}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="latam-bonus-heading">
              <h2>{t.bonusTitle}</h2>
            </div>
            <div className="latam-bonus-grid">
              {bonuses.map((bonus, i) => (
                <article key={bonus.name}>
                  <img {...imageProps(bonus.image.url, "120px")} alt={bonus.name} loading="lazy" />
                  <h3>{bonus.name}</h3>
                  <p>{t.bonusText[i]}</p>
                </article>
              ))}
            </div>
            <p className="latam-language-note">{t.note}</p>
          </div>
        </section>
        <section className="latam-section latam-how" aria-labelledby="how-heading">
          <div className="latam-container">
            <div className="latam-heading">
              <h2 id="how-heading">{t.howTitle}</h2>
            </div>
            <ol className="latam-steps">
              {t.steps.map(([title, text], i) => (
                <li key={title}>
                  <span>{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
            <p className="latam-note">{t.print}</p>
          </div>
        </section>
        <section className="latam-section latam-guarantee" aria-labelledby="guarantee-heading">
          <div className="latam-container latam-guarantee-inner">
            <ShieldCheck size={60} aria-hidden="true" />
            <div>
              <h2 id="guarantee-heading">{t.guaranteeTitle}</h2>
              <p>{t.guarantee}</p>
            </div>
          </div>
        </section>
        <section
          ref={offerRef}
          className="latam-section latam-offer"
          id="oferta"
          aria-labelledby="offer-heading"
        >
          <div className="latam-container latam-offer-panel">
            <div className="latam-offer-copy">
              <p className="latam-eyebrow">{t.offerKicker}</p>
              <h2 id="offer-heading">{t.offerTitle}</h2>
              <p>{t.offerIntro}</p>
              <img
                {...imageProps(kit.url, "(max-width: 767px) calc(100vw - 64px), 480px")}
                alt={t.bundle}
                loading="lazy"
                width="1448"
                height="1086"
              />
            </div>
            <div className="latam-order">
              <h3>{t.bundle}</h3>
              <ul>
                {deliverables.map((item) => (
                  <li key={item.name}>
                    <Check size={16} aria-hidden="true" />
                    {item.name}
                  </li>
                ))}
              </ul>
              {price()}
              {buy("offer")}
              <p className="latam-checkout">
                <ShieldCheck size={16} aria-hidden="true" />
                {t.checkout}
              </p>
              <p className="latam-price-note">{local ? t.conversion : t.fallback}</p>
              <p className="latam-note">{t.format}</p>
            </div>
          </div>
        </section>
        <section className="latam-section" aria-labelledby="faq-heading">
          <div className="latam-container latam-faq">
            <div className="latam-heading">
              <h2 id="faq-heading">{t.faqTitle}</h2>
            </div>
            {t.faq.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
            <div className="latam-mini-cta">{buy("faq")}</div>
          </div>
        </section>
      </main>
      <footer className="latam-footer">
        <p>{t.footer}</p>
        <p>{t.note}</p>
        <p>{t.checkout}</p>
      </footer>
      <aside className="latam-sticky" aria-label={t.sticky}>
        <div>
          <span>{t.single}</span>
          <strong>{local ? `≈ ${local}` : "US$ 7.90"}</strong>
        </div>
        {buy("sticky", true)}
      </aside>
      <Dialog.Root
        open={!!expanded}
        onOpenChange={(open) => {
          if (!open) setExpanded(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="latam-dialog-overlay" />
          <Dialog.Content className="latam-dialog" aria-describedby={undefined}>
            <Dialog.Title>{expanded?.label}</Dialog.Title>
            <Dialog.Close className="latam-dialog-close">{t.close} ×</Dialog.Close>
            {expanded && <img src={expanded.url} alt={expanded.label} />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
