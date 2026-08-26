(() => {
  const measurementId = "G-TPNYPSDE2K";
  const pageLocation = `${window.location.origin}${window.location.pathname}`;
  const referrerUrl = document.referrer ? new URL(document.referrer) : null;
  const pageReferrer = referrerUrl ? `${referrerUrl.origin}${referrerUrl.pathname}` : "";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    page_location: pageLocation,
    page_referrer: pageReferrer,
    page_title: document.title,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const googleTag = document.createElement("script");
  googleTag.async = true;
  googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(googleTag);
})();
