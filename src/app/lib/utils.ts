import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

export function sanitizeAndParseHTML(html: string) {
  if (typeof window === 'undefined') return '';
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li',
      'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'blockquote',
      'img', 'span'
    ],
    ALLOWED_ATTR: ['href', 'src', 'class', 'id', 'alt', 'title', 'target']
  });
  return parse(clean);
}

export function stripHTML(html: string): string {
  if (typeof window === 'undefined') return html;
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  return clean.replace(/&nbsp;/g, ' ').trim();
} 