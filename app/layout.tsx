import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Comsri Hardware E-commerce',
  description: 'Premium Refurbished Laptops and Desktops Online in India.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const fetchSetterPolyfill = `
    (function() {
      try {
        var targets = [typeof window !== "undefined" ? window : null, typeof globalThis !== "undefined" ? globalThis : null, typeof self !== "undefined" ? self : null];
        targets.forEach(function(target) {
          if (!target) return;
          try {
            var originalFetch = target.fetch;
            if (typeof originalFetch === 'function') {
              var customFetch = originalFetch;
              Object.defineProperty(target, 'fetch', {
                get: function() { return customFetch; },
                set: function(val) { customFetch = val; },
                configurable: true,
                enumerable: true
              });
            }
          } catch (err) {
            console.warn('Failed to define fetch setter on target:', err);
          }
        });
      } catch (e) {
        console.warn('Fetch setter patch exception:', e);
      }
    })();
  `;

  return (
    <html lang="en">
      <head suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: fetchSetterPolyfill }} suppressHydrationWarning />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
