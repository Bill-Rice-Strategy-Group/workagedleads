import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

const PROD_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://agedleadsales.com').hostname;
  } catch {
    return 'agedleadsales.com';
  }
})();
const IS_NON_PROD_DEPLOY =
  !!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';

/**
 * Standalone GA4 — only loads if GTM is NOT configured.
 * When GTM is active, GA4 fires through GTM (no need to load gtag.js twice).
 */
export function GoogleAnalyticsTag() {
  // Skip standalone GA4 if GTM handles it — avoids loading gtag.js twice (~170KB saved)
  if (!GA4_ID || GTM_ID || IS_NON_PROD_DEPLOY) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
if(location.hostname==='${PROD_HOST}'){gtag('config','${GA4_ID}');}`,
        }}
      />
    </>
  );
}

/**
 * Google Tag Manager — loaded afterInteractive so the referrer-bearing page_view
 * fires reliably (lazyOnload can miss it on quick bounces and inflate "Direct").
 * GTM handles GA4, conversion tracking, and any other tags configured in the container.
 */
export function GoogleTagManager() {
  if (!GTM_ID || IS_NON_PROD_DEPLOY) return null;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `if(location.hostname==='${PROD_HOST}'){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');}`,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GtagArgs = [string, ...any[]];

function gtag(...args: GtagArgs) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag === "function") { w.gtag(...args); return; }
  // gtag.js only reads Arguments objects from dataLayer, never plain arrays
  // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unused-vars
  (function (..._a: unknown[]) { w.dataLayer!.push(arguments); })(...args);
}

export function trackEvent(name: string, params?: Record<string, string>) {
  gtag("event", name, params);
}

export function trackNewsletterSignup(location: string, email: string) {
  trackEvent("newsletter_signup", {
    signup_location: location,
    email_domain: email.split("@")[1],
  });
}

// GA4 "generate_lead" — fire only after the lead's API call succeeds.
// The BRSG portfolio report counts this event as a lead.
export function trackLead(leadType: string, location: string) {
  trackEvent("generate_lead", {
    lead_type: leadType,
    form_location: location,
  });
}

export function trackCtaClick(id: string, location: string) {
  trackEvent("cta_click", {
    cta_id: id,
    cta_location: location,
  });
}

// Fires the GA4 event for a tracked outbound click. Event name is one of
// affiliate_click | partner_click | outbound_click — see lib/outbound-classify.ts.
// Mark "affiliate_click" as a Key Event in GA4 admin to count it as a conversion.
export function trackOutboundClick(params: {
  eventName: string;
  partnerSlug?: string;
  partnerName?: string;
  linkUrl: string;
  linkDomain: string;
  linkText?: string;
  linkLocation: string;
}) {
  const payload: Record<string, string> = {
    link_url: params.linkUrl,
    link_domain: params.linkDomain,
    link_location: params.linkLocation,
    outbound: "true",
  };
  if (params.partnerSlug) payload.partner_slug = params.partnerSlug;
  if (params.partnerName) payload.partner_name = params.partnerName;
  if (params.linkText) payload.link_text = params.linkText;
  trackEvent(params.eventName, payload);
}
