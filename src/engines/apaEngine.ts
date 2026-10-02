import type { CitationItem, Author, InTextCitationOptions } from '../types/citation';
import { formatAuthorForApaBib, getAuthorInTextKey } from '../utils/nameParser';

export function formatApaAuthors(authors: Author[]): string {
  if (!authors || authors.length === 0) return '';
  if (authors.length === 1) {
    return formatAuthorForApaBib(authors[0]);
  }
  if (authors.length === 2) {
    return `${formatAuthorForApaBib(authors[0])}, & ${formatAuthorForApaBib(authors[1])}`;
  }
  if (authors.length >= 3 && authors.length <= 5) {
    const list = authors.slice(0, -1).map(a => formatAuthorForApaBib(a)).join(', ');
    const last = formatAuthorForApaBib(authors[authors.length - 1]);
    return `${list}, & ${last}`;
  }
  // 6 or more authors: first 3, "...", last author
  const first3 = authors.slice(0, 3).map(a => formatAuthorForApaBib(a)).join(', ');
  const last = formatAuthorForApaBib(authors[authors.length - 1]);
  return `${first3}, ... ${last}`;
}

export function formatApaInText(
  item: CitationItem,
  options: InTextCitationOptions = {}
): string {
  const { isNarrative = false, pageNumbers, suffixYear = '' } = options;
  const isEn = item.language === 'en';
  const etAl = isEn ? 'et al.' : 'và nnk.';
  const andSymbol = '&';
  const andWord = isEn ? 'and' : '&';

  let authorPart = '';
  if (!item.authors || item.authors.length === 0) {
    const words = item.title.trim().split(/\s+/).slice(0, 4).join(' ');
    authorPart = `"${words}..."`;
  } else if (item.authors.length === 1) {
    authorPart = getAuthorInTextKey(item.authors[0], 'apa');
  } else if (item.authors.length === 2) {
    const a1 = getAuthorInTextKey(item.authors[0], 'apa');
    const a2 = getAuthorInTextKey(item.authors[1], 'apa');
    authorPart = isNarrative ? `${a1} ${andWord} ${a2}` : `${a1} ${andSymbol} ${a2}`;
  } else {
    const a1 = getAuthorInTextKey(item.authors[0], 'apa');
    authorPart = `${a1} ${etAl}`;
  }

  const yearPart = item.year ? `${item.year}${suffixYear}` : (isEn ? 'n.d.' : 'k.n.');
  const pagePart = pageNumbers ? `, ${pageNumbers}` : '';

  if (isNarrative) {
    return `${authorPart} (${yearPart}${pagePart})`;
  } else {
    return `(${authorPart}, ${yearPart}${pagePart})`;
  }
}

export interface FormattedBibResult {
  html: string;
  plainText: string;
}

export function formatApaBibItem(item: CitationItem): FormattedBibResult {
  const isEn = item.language === 'en';
  const authorsStr = formatApaAuthors(item.authors);
  const yearStr = item.year ? `(${item.year}).` : (isEn ? '(n.d.).' : '(k.n.).');
  const title = item.title.trim();
  const translated = item.translatedTitle ? ` [${item.translatedTitle}]` : '';

  let htmlBody = '';
  let plainBody = '';

  switch (item.type) {
    case 'book':
    case 'book_print': {
      const placePub = item.place && item.publisher ? ` ${item.place}: ${item.publisher}.` : (item.publisher ? ` ${item.publisher}.` : '');
      htmlBody = `${authorsStr ? `${authorsStr} ${yearStr} ` : ''}<i>${title}</i>${translated}.${placePub}`;
      plainBody = `${authorsStr ? `${authorsStr} ${yearStr} ` : ''}${title}${translated}.${placePub}`;
      break;
    }
    case 'book_chapter': {
      const editorsStr = item.editors && item.editors.length > 0 
        ? (isEn ? `In ${formatApaAuthors(item.editors)} (Eds.), ` : `Trong ${formatApaAuthors(item.editors)} (Chủ biên), `)
        : (isEn ? 'In ' : 'Trong ');
      const pageInfo = item.pages ? (isEn ? ` (pp. ${item.pages})` : ` (tr. ${item.pages})`) : '';
      const bookTitle = item.bookTitle ? `<i>${item.bookTitle}</i>` : '';
      const bookTitlePlain = item.bookTitle || '';
      const placePub = item.place && item.publisher ? ` ${item.place}: ${item.publisher}.` : (item.publisher ? ` ${item.publisher}.` : '');

      htmlBody = `${authorsStr} ${yearStr} ${title}. ${editorsStr}${bookTitle}${pageInfo}.${placePub}`;
      plainBody = `${authorsStr} ${yearStr} ${title}. ${editorsStr.replace(/<i>|<\/i>/g, '')}${bookTitlePlain}${pageInfo}.${placePub}`;
      break;
    }
    case 'journal':
    case 'journal_online': {
      const journalName = item.journalName ? `<i>${item.journalName}</i>` : '';
      const vol = item.volume ? `, <i>${item.volume}</i>` : '';
      const volPlain = item.volume ? `, ${item.volume}` : '';
      const issue = item.issue ? `(${item.issue})` : '';
      const pages = item.pages ? `, ${item.pages}.` : '.';
      const doi = item.doi ? ` https://doi.org/${item.doi.replace(/^https?:\/\/doi\.org\//, '')}` : (item.url ? ` ${item.url}` : '');

      htmlBody = `${authorsStr} ${yearStr} ${title}${translated}. ${journalName}${vol}${issue}${pages}${doi}`;
      plainBody = `${authorsStr} ${yearStr} ${title}${translated}. ${item.journalName || ''}${volPlain}${issue}${pages}${doi}`;
      break;
    }
    case 'conference':
    case 'proceedings':
    case 'conference_presentation': {
      const pageInfo = item.pages ? (isEn ? ` (pp. ${item.pages})` : ` (tr. ${item.pages})`) : '';
      const confInfo = item.conferenceName 
        ? `<i>${item.conferenceName}${item.conferenceLocation ? `, ${item.conferenceLocation}` : ''}${item.year ? `, ${item.year}` : ''}</i>`
        : '';
      const confInfoPlain = item.conferenceName 
        ? `${item.conferenceName}${item.conferenceLocation ? `, ${item.conferenceLocation}` : ''}${item.year ? `, ${item.year}` : ''}`
        : '';
      const pubInfo = item.place && item.publisher ? ` ${item.place}: ${item.publisher}.` : '';

      htmlBody = `${authorsStr} ${yearStr} ${title}. ${confInfo}${pageInfo}.${pubInfo}`;
      plainBody = `${authorsStr} ${yearStr} ${title}. ${confInfoPlain}${pageInfo}.${pubInfo}`;
      break;
    }
    case 'newspaper': {
      const dateStr = item.publicationDate ? `(${item.publicationDate}).` : yearStr;
      const paperName = item.newspaperName ? `<i>${item.newspaperName}</i>` : '';
      const pageInfo = item.pages ? (isEn ? `, pp. ${item.pages}.` : `, tr. ${item.pages}.`) : '.';

      htmlBody = `${authorsStr} ${dateStr} ${title}. ${paperName}${pageInfo}`;
      plainBody = `${authorsStr} ${dateStr} ${title}. ${item.newspaperName || ''}${pageInfo}`;
      break;
    }
    case 'thesis': {
      const degree = item.degree || (isEn ? 'PhD thesis' : 'Luận án tiến sĩ');
      const inst = [degree, item.institution, item.place].filter(Boolean).join(', ');

      htmlBody = `${authorsStr} ${yearStr} <i>${title}</i> (${inst}).`;
      plainBody = `${authorsStr} ${yearStr} ${title} (${inst}).`;
      break;
    }
    case 'webpage':
    case 'org_online': {
      const accessStr = item.accessDate 
        ? (isEn ? `Retrieved ${item.accessDate}, from ${item.url || ''}` : `Truy cập ${item.accessDate}, từ ${item.url || ''}`)
        : (item.url || '');

      if (!authorsStr) {
        htmlBody = `<i>${title}</i>. ${yearStr} ${accessStr}`;
        plainBody = `${title}. ${yearStr} ${accessStr}`;
      } else {
        htmlBody = `${authorsStr} ${yearStr} <i>${title}</i>. ${accessStr}`;
        plainBody = `${authorsStr} ${yearStr} ${title}. ${accessStr}`;
      }
      break;
    }
    default: {
      htmlBody = `${authorsStr} ${yearStr} <i>${title}</i>.`;
      plainBody = `${authorsStr} ${yearStr} ${title}.`;
    }
  }

  return { html: htmlBody.trim(), plainText: plainBody.trim() };
}

export function sortApaBibliography(items: CitationItem[]): CitationItem[] {
  return [...items].sort((a, b) => {
    const authorA = a.authors[0];
    const authorB = b.authors[0];

    const keyA = authorA ? (authorA.isVietnamese ? (authorA.given || authorA.rawName) : (authorA.family || authorA.rawName)) : a.title;
    const keyB = authorB ? (authorB.isVietnamese ? (authorB.given || authorB.rawName) : (authorB.family || authorB.rawName)) : b.title;

    const cmp = keyA.localeCompare(keyB, 'vi', { sensitivity: 'base' });
    if (cmp !== 0) return cmp;

    const yearA = typeof a.year === 'number' ? a.year : parseInt(`${a.year}`) || 0;
    const yearB = typeof b.year === 'number' ? b.year : parseInt(`${b.year}`) || 0;
    return yearA - yearB;
  });
}
