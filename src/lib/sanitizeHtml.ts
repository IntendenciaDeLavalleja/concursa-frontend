import DOMPurify from 'dompurify';

export function hasVisibleText(text: string | undefined | null) {
  return /[^\s\p{Default_Ignorable_Code_Point}]/u.test(text ?? '');
}

export function sanitizeHtml(
  html: string | undefined | null,
  { requireText = false } = {},
) {
  if (!html?.trim()) return '';

  const content = DOMPurify.sanitize(html, { RETURN_DOM_FRAGMENT: true });
  if (requireText && !hasVisibleText(content.textContent)) return '';

  // Quill exports word separators as non-breaking spaces.
  const textNodes = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  for (let node = textNodes.nextNode(); node; node = textNodes.nextNode()) {
    node.textContent = node.textContent?.replaceAll('\u00a0', ' ') ?? '';
  }

  const template = document.createElement('template');
  template.content.append(content);
  return template.innerHTML;
}
