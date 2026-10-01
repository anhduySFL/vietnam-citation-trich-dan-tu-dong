import type { CitationItem, Author } from '../types/citation';
import { formatAuthorForIeeeBib } from '../utils/nameParser';
import type { FormattedCitation } from './apaEngine';


export function formatIeeeAuthors(authors: Author[], isEnglish = false): string {
  if (!authors || authors.length === 0) return '';
  const andWord = isEnglish ? 'and' : 'và';

  if (authors.length === 1) {
    return formatAuthorForIeeeBib(authors[0]);
  }
  if (authors.length === 2) {
    return `${formatAuthorForIeeeBib(authors[0])} ${andWord} ${formatAuthorForIeeeBib(authors[1])}`;
  }
  if (authors.length >= 3 && authors.length <= 5) {
    const list = authors.slice(0, -1).map(a => formatAuthorForIeeeBib(a)).join(', ');
    const last = formatAuthorForIeeeBib(authors[authors.length - 1]);
    return `${list} ${andWord} ${last}`;
  }
  // 6 or more authors: first 3, "...", last author
  const first3 = authors.slice(0, 3).map(a => formatAuthorForIeeeBib(a)).join(', ');
  const last = formatAuthorForIeeeBib(authors[authors.length - 1]);
  return `${first3}, ... ${last}`;
}

/**
 * Collapse list of reference numbers into ranges:
 * e.g. [2, 3, 4] -> "[2–4]"
 * e.g. [2, 10] -> "[2, 10]"
 * e.g. [2, 3, 4, 7, 9, 10, 11] -> "[2–4, 7, 9–11]"
 */
export function collapseIeeeNumbers(numbers: number[], pageNumber?: string): string {
  if (numbers.length === 0) return '';
  const sorted = Array.from(new Set(numbers)).sort((a, b) => a - b);

  if (sorted.length === 1 && pageNumber) {
    return `[${sorted[0]}, ${pageNumber}]`;
  }

  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    const curr = sorted[i];
    if (curr === prev + 1) {
      prev = curr;
    } else {
      if (start === prev) {
        ranges.push(`${start}`);
      } else if (prev === start + 1) {
        ranges.push(`${start}, ${prev}`);
      } else {
        ranges.push(`${start}–${prev}`);
      }
      start = curr;
      prev = curr;
    }
  }

  return `[${ranges.join(', ')}]`;
}

export function formatIeeeBibItem(item: CitationItem, index: number): FormattedCitation {
  const isEn = item.language === 'en';
  const prefix = `[${index}] `;
  const authorsStr = formatIeeeAuthors(item.authors, isEn);
  const authorPrefix = authorsStr ? `${authorsStr}, ` : '';
  const title = item.title.trim();
  const year = item.year ? `${item.year}` : '';

  let htmlBody = '';
  let plainBody = '';

  switch (item.type) {
    case 'book': {
      const editionPart = item.edition ? `, ${item.edition}` : '';
      const placePub = item.place && item.publisher ? `${item.place}: ${item.publisher}` : (item.publisher || '');
      const pubInfo = [placePub, year].filter(Boolean).join(', ');

      htmlBody = `${prefix}${authorPrefix}<i>${title}</i>${editionPart}. ${pubInfo}.`;
      plainBody = `${prefix}${authorPrefix}${title}${editionPart}. ${pubInfo}.`;
      break;
    }
    case 'book_chapter': {
      const editionPart = item.edition ? `, ${item.edition}` : '';
      const inWord = isEn ? 'in' : 'trong';
      const edWord = isEn ? 'Ed.' : 'Chủ biên';
      const editorsStr = item.editors && item.editors.length > 0 
        ? `, ${formatIeeeAuthors(item.editors, isEn)}, ${edWord}` 
        : '';
      const placePub = item.place && item.publisher ? `${item.place}: ${item.publisher}` : (item.publisher || '');
      const pageInfo = item.pages ? (isEn ? `, pp. ${item.pages}` : `, tr. ${item.pages}`) : '';
      const pubInfo = [placePub, year].filter(Boolean).join(', ');

      htmlBody = `${prefix}${authorPrefix}“${title},” ${inWord} <i>${item.bookTitle || ''}</i>${editionPart}${editorsStr}. ${pubInfo}${pageInfo}.`;
      plainBody = `${prefix}${authorPrefix}“${title},” ${inWord} ${item.bookTitle || ''}${editionPart}${editorsStr}. ${pubInfo}${pageInfo}.`;
      break;
    }
    case 'journal': {
      const journalName = item.journalName ? `<i>${item.journalName}</i>` : '';
      const vol = item.volume ? (isEn ? `, Vol. ${item.volume}` : `, Tập ${item.volume}`) : '';
      const issue = item.issue ? (isEn ? `, No. ${item.issue}` : `, Số ${item.issue}`) : '';
      const pages = item.pages ? (isEn ? `, pp. ${item.pages}` : `, tr. ${item.pages}`) : '';
      const doi = item.doi ? ` DOI: ${item.doi}.` : '';

      htmlBody = `${prefix}${authorPrefix}“${title},” ${journalName}${vol}${issue}${pages}, ${year}.${doi}`;
      plainBody = `${prefix}${authorPrefix}“${title},” ${item.journalName || ''}${vol}${issue}${pages}, ${year}.${doi}`;
      break;
    }
    case 'conference': {
      const inWord = isEn ? 'in' : 'trong';
      const confName = item.conferenceName ? `<i>${item.conferenceName}</i>` : '';
      const loc = item.conferenceLocation ? `, ${item.conferenceLocation}` : '';
      const time = item.conferenceDate ? `, ${item.conferenceDate}` : '';
      const placePub = item.place && item.publisher ? `${item.place}: ${item.publisher}` : (item.publisher || '');
      const pubInfo = [placePub, year].filter(Boolean).join(', ');
      const pageInfo = item.pages ? (isEn ? `, pp. ${item.pages}` : `, tr. ${item.pages}`) : '';

      htmlBody = `${prefix}${authorPrefix}“${title},” ${inWord} ${confName}${loc}${time}, ${pubInfo}${pageInfo}.`;
      plainBody = `${prefix}${authorPrefix}“${title},” ${inWord} ${item.conferenceName || ''}${loc}${time}, ${pubInfo}${pageInfo}.`;
      break;
    }
    case 'newspaper': {
      const paperName = item.newspaperName ? `<i>${item.newspaperName}</i>` : '';
      const datePart = item.pubDateExact ? ` (${item.pubDateExact})` : (year ? ` (${year})` : '');
      const pageInfo = item.pages ? (isEn ? `, pp. ${item.pages}` : `, tr. ${item.pages}`) : '';

      htmlBody = `${prefix}${authorPrefix}“${title},” ${paperName}${datePart}${pageInfo}.`;
      plainBody = `${prefix}${authorPrefix}“${title},” ${item.newspaperName || ''}${datePart}${pageInfo}.`;
      break;
    }
    case 'thesis': {
      const degree = item.degree || (isEn ? 'PhD thesis' : 'Luận án Tiến sĩ');
      const inst = [degree, item.institution, item.place, year].filter(Boolean).join(', ');

      htmlBody = `${prefix}${authorPrefix}“<i>${title}</i>,” ${inst}.`;
      plainBody = `${prefix}${authorPrefix}“${title},” ${inst}.`;
      break;
    }
    case 'webpage': {
      const onlineTag = isEn ? '[Online]' : '[Trực tuyến]';
      const addrTag = isEn ? 'Available:' : 'Địa chỉ:';
      const accessTag = isEn ? 'Accessed' : 'Truy cập';
      const timePart = item.year ? `, ${item.year}` : '';

      htmlBody = `${prefix}${authorPrefix}“${title},”${timePart}. ${onlineTag}. ${addrTag} ${item.url || ''}. [${accessTag} ${item.accessDate || ''}].`;
      plainBody = `${prefix}${authorPrefix}“${title},”${timePart}. ${onlineTag}. ${addrTag} ${item.url || ''}. [${accessTag} ${item.accessDate || ''}].`;
      break;
    }
    case 'legal': {
      const auth = item.issuingAuthority || authorsStr;
      const docNum = item.documentNumber ? `, ${item.documentNumber}` : '';
      const dateExact = item.pubDateExact ? ` ngày ${item.pubDateExact}` : '';

      htmlBody = `${prefix}${auth}${docNum}${dateExact} ${title}, ${year}.`;
      plainBody = `${prefix}${auth}${docNum}${dateExact} ${title}, ${year}.`;
      break;
    }
    default: {
      htmlBody = `${prefix}${authorPrefix}“${title},” ${year}.`;
      plainBody = `${prefix}${authorPrefix}“${title},” ${year}.`;
    }
  }

  return { html: htmlBody.trim(), plainText: plainBody.trim() };
}
