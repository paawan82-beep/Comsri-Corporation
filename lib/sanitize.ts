import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize untrusted HTML (e.g. WordPress post/product content) before it is
 * passed to React's dangerouslySetInnerHTML. Strips <script>, inline event
 * handlers, javascript: URLs, etc. — the things that turn CMS-authored content
 * into a stored-XSS vector. Works on both server (SSR) and client.
 */
export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
}
