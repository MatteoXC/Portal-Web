import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "ul", "ol", "li", "strong", "em", "b", "i", "a",
  "h2", "h3", "h4", "h5", "h6", "img", "br", "span",
  "table", "thead", "tbody", "tr", "th", "td",
  "blockquote", "pre", "code", "hr", "div",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "class", "width", "height"];

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
};
