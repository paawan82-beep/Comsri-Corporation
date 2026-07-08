/**
 * Lightweight, dependency-free HTML sanitizer used before CMS-authored HTML
 * (WordPress post/product content) is passed to React's dangerouslySetInnerHTML.
 *
 * This deliberately avoids `isomorphic-dompurify`, whose server path loads
 * `jsdom` (~11 MB) — far too large for the Cloudflare Workers free-plan bundle
 * limit, and jsdom does not run on the Workers runtime anyway. Being pure string
 * transforms, it produces identical output on server and client, so SSR and
 * hydrated markup match (no React hydration mismatch).
 *
 * It strips the constructs that turn CMS content into a stored-XSS vector:
 * dangerous elements, inline event handlers, and javascript:/vbscript: URLs.
 * For our own trusted CMS this is adequate defense-in-depth. If you ever need to
 * render genuinely untrusted HTML, move sanitization behind a server API and use
 * a parser-based sanitizer such as `sanitize-html`.
 */

// Paired dangerous elements — removed together with their contents.
const DANGEROUS_ELEMENTS =
  /<(script|style|iframe|object|embed|noscript|template|form|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

// Unpaired / void dangerous tags (e.g. <link>, <meta>, <base>).
const DANGEROUS_VOID = /<(link|meta|base)\b[^>]*>/gi;

export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return "";
  let clean = String(dirty);

  // Drop dangerous elements (and their content) plus stray void tags.
  clean = clean.replace(DANGEROUS_ELEMENTS, "");
  clean = clean.replace(DANGEROUS_VOID, "");

  // Strip inline event-handler attributes: on...="…" / on...='…' / on...=value
  clean = clean.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  clean = clean.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  clean = clean.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");

  // Neutralize script-executing URL schemes in href/src (quoted and unquoted).
  clean = clean.replace(
    /\s(href|src|xlink:href)\s*=\s*"(?:\s|&#\d+;|&#x[0-9a-f]+;)*(?:javascript|vbscript):[^"]*"/gi,
    ' $1="#"'
  );
  clean = clean.replace(
    /\s(href|src|xlink:href)\s*=\s*'(?:\s|&#\d+;|&#x[0-9a-f]+;)*(?:javascript|vbscript):[^']*'/gi,
    " $1='#'"
  );
  clean = clean.replace(
    /\s(href|src|xlink:href)\s*=\s*(?:javascript|vbscript):[^\s>]*/gi,
    ' $1="#"'
  );

  return clean;
}
