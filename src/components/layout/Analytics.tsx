import Script from "next/script";

/** Google Analytics 4, loaded when the browser is idle. Rendered only when an ID is set. */
export function Analytics({ id }: { id: string }) {
  const safeId = id.replace(/[^A-Z0-9-]/gi, "");
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${safeId}`} strategy="lazyOnload" />
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${safeId}');`}
      </Script>
    </>
  );
}
