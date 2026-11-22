'use client';

import Script from 'next/script';

const isSafeId = (val, pattern) => typeof val === 'string' && pattern.test(val.trim());

export default function MarketingAndAnalyticsScripts() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
  const umamiSrc =
    process.env.NEXT_PUBLIC_UMAMI_SRC?.trim() || 'https://cloud.umami.is/script.js';

  const validGtm = isSafeId(gtmId, /^GTM-[A-Z0-9]+$/i) ? gtmId : null;
  const validGa = isSafeId(gaId, /^G-[A-Z0-9]+$/i) ? gaId : null;
  const validPixel = isSafeId(pixelId, /^\d+$/) ? pixelId : null;
  const validUmamiId = isSafeId(umamiId, /^[0-9a-f-]{8,64}$/i) ? umamiId : null;

  return (
    <>
      {validGtm && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${validGtm}');`}
        </Script>
      )}

      {validGa && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${validGa}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${validGa}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {validUmamiId && (
        <Script
          src={umamiSrc}
          data-website-id={validUmamiId}
          strategy="afterInteractive"
        />
      )}

      {validPixel && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('set', 'autoConfig', false, '${validPixel}');
fbq('dataProcessingOptions', ['LDU'], 0, 0);
fbq('init', '${validPixel}');
fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
