import type { CitationItem, FormattedCitation } from '../types/citation';
import { formatVnuBibItem, formatVnuInText } from './vnuHanoiEngine';

export type { FormattedCitation };

/**
 * Compatibility bridge for VNU Citation formatting
 */
export function formatVnuCitation(item: CitationItem, index?: number): FormattedCitation {
  const inText = formatVnuInText(item);
  const bib = formatVnuBibItem(item);
  const prefix = index !== undefined ? `[${index}] ` : '';

  return {
    inText,
    bibliographyHtml: `${prefix}${bib.html}`,
    bibliographyPlainText: `${prefix}${bib.plainText}`
  };
}

export { formatVnuInText };
