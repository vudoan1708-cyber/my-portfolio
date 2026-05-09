'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Pin vh/svh utilities so a hero with h-svh can't drag the iframe height in
// auto-size mode. Harmless in fixed-height mode.
const VIEWPORT_PIN_PX = 760;
const RESET_CSS = `
html, body {
  height: auto !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
}
body { overflow-x: hidden; overflow-y: auto; }
.h-screen, .h-svh, .h-dvh, .h-lvh { height: ${VIEWPORT_PIN_PX}px !important; }
.min-h-screen, .min-h-svh, .min-h-dvh, .min-h-lvh { min-height: ${VIEWPORT_PIN_PX}px !important; }
.max-h-screen, .max-h-svh, .max-h-dvh, .max-h-lvh { max-height: ${VIEWPORT_PIN_PX}px !important; }
`;

export default function IframePreview({
  children,
  width = 390,
  className,
  style,
  title = 'Preview',
}) {
  const iframeRef = useRef(null);
  const [body, setBody] = useState(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setup = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      doc.head.innerHTML = '';

      const charset = doc.createElement('meta');
      charset.setAttribute('charset', 'utf-8');
      doc.head.appendChild(charset);

      const viewport = doc.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', `width=${width}, initial-scale=1`);
      doc.head.appendChild(viewport);

      document
        .querySelectorAll('link[rel="stylesheet"], style')
        .forEach((el) => {
          doc.head.appendChild(el.cloneNode(true));
        });

      const resetStyle = doc.createElement('style');
      resetStyle.textContent = RESET_CSS;
      doc.head.appendChild(resetStyle);

      doc.documentElement.className = document.documentElement.className;
      doc.body.className = document.body.className;

      setBody(doc.body);
    };

    if (iframe.contentDocument?.readyState === 'complete') {
      setup();
    } else {
      iframe.addEventListener('load', setup);
    }

    return () => {
      iframe.removeEventListener('load', setup);
    };
  }, [width]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title={title}
        className={className}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-read; clipboard-write"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          width,
          border: 0,
          display: 'block',
          colorScheme: 'dark',
          ...style,
        }}
      />
      {body && createPortal(children, body)}
    </>
  );
}
