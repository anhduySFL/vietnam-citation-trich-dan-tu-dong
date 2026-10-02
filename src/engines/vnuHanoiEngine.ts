import type { CitationItem, Author, InTextCitationOptions } from '../types/citation';
import { formatAuthorForVnuBib, getAuthorInTextKey } from '../utils/nameParser';
import type { FormattedBibResult } from './apaEngine';

export const VNU_HANOI_NOTE = 
  "Tham khảo Lưu Thế Anh (ch.b.), Võ Thanh Sơn, Lê Thị Vân Huệ, Bùi Ngọc Quý, Phương pháp luận nghiên cứu khoa học trong môi trường và phát triển bền vững, Nxb. Đại học Quốc gia Hà Nội, 2025, 492 tr.";

export function formatVnuAuthors(authors: Author[], isEnglish = false): string {
  if (!authors || authors.length === 0) return '';
  const andWord = isEnglish ? 'and' : 'và';
  const etAl = isEnglish ? 'et al.' : 'và các cộng sự';

  // Rule from VNU: If 4 or more authors in bibliography, first author + "và các cộng sự" / "et al."
  if (authors.length >= 4) {
    return `${formatAuthorForVnuBib(authors[0], 0)} ${etAl}`;
  }

  if (authors.length === 1) {
    return formatAuthorForVnuBib(authors[0], 0);
  }
  if (authors.length === 2) {
    return `${formatAuthorForVnuBib(authors[0], 0)} ${andWord} ${formatAuthorForVnuBib(authors[1], 1)}`;
  }
  // 3 authors
  return `${formatAuthorForVnuBib(authors[0], 0)}, ${formatAuthorForVnuBib(authors[1], 1)} ${andWord} ${formatAuthorForVnuBib(authors[2], 2)}`;
}

export function formatVnuInText(
  item: CitationItem,
  options: InTextCitationOptions = {}
): string {
  const { isNarrative = false, pageNumbers, suffixYear = '' } = options;
  const isEn = item.language === 'en';
  const andWord = isEn ? 'and' : 'và';
  const etAl = isEn ? 'et al.' : 'và cs.';

  let authorPart = '';
  if (!item.authors || item.authors.length === 0) {
    authorPart = item.title.trim().split(/\s+/).slice(0, 3).join(' ');
  } else if (item.authors.length === 1) {
    authorPart = getAuthorInTextKey(item.authors[0], 'vnu');
  } else if (item.authors.length === 2) {
    const a1 = getAuthorInTextKey(item.authors[0], 'vnu');
    const a2 = getAuthorInTextKey(item.authors[1], 'vnu');
    authorPart = `${a1} ${andWord} ${a2}`;
  } else {
    const a1 = getAuthorInTextKey(item.authors[0], 'vnu');
    authorPart = `${a1} ${etAl}`;
  }

  const yearPart = item.year ? `${item.year}${suffixYear}` : (isEn ? 'n.d.' : 'k.n.');
  const pagePart = pageNumbers ? `, ${pageNumbers}` : '';

  if (isNarrative) {
    return `${authorPart} [${yearPart}${pagePart}]`;
  } else {
    return `[${authorPart}, ${yearPart}${pagePart}]`;
  }
}

export function formatVnuBibItem(item: CitationItem): FormattedBibResult {
  const isEn = item.language === 'en';
  const authorsStr = formatVnuAuthors(item.authors, isEn);
  const yearStr = item.year ? `(${item.year})` : '';
  const authorYear = authorsStr ? (yearStr ? `${authorsStr} ${yearStr}` : authorsStr) : yearStr;
  const title = item.title.trim();

  let htmlBody = '';
  let plainBody = '';

  switch (item.type) {
    case 'book':
    case 'book_print': {
      const parts = [
        item.publisher,
        item.place,
        item.totalPages
      ].filter(Boolean).join(', ');
      const desc = parts ? `, ${parts}.` : '.';

      htmlBody = `${authorYear ? `${authorYear}, ` : ''}${title}${desc}`;
      plainBody = `${authorYear ? `${authorYear}, ` : ''}${title}${desc}`;
      break;
    }
    case 'journal':
    case 'journal_online': {
      const volPart = item.volume ? (isEn ? `, ${item.volume}` : `, Tập ${item.volume}`) : '';
      const issuePart = item.issue ? ` (${item.issue})` : '';
      const pageInfo = item.pages ? (isEn ? `, pp. ${item.pages}` : `, tr. ${item.pages}`) : '';

      htmlBody = `${authorYear ? `${authorYear}, ` : ''}“${title}”, ${item.journalName || ''}${volPart}${issuePart}${pageInfo}.`;
      plainBody = `${authorYear ? `${authorYear}, ` : ''}“${title}”, ${item.journalName || ''}${volPart}${issuePart}${pageInfo}.`;
      break;
    }
    case 'book_chapter': {
      const inPrefix = isEn ? 'In: ' : 'Trong: ';
      const edTag = isEn ? '(Eds.)' : '(Biên tập)';
      const editorsStr = item.editors && item.editors.length > 0 
        ? `${inPrefix}${formatVnuAuthors(item.editors, isEn)} ${edTag}, ` 
        : inPrefix;
      const placePub = [item.publisher, item.place].filter(Boolean).join(', ');
      const pageInfo = item.pages ? (isEn ? `, pp. ${item.pages}` : `, tr. ${item.pages}`) : '';

      htmlBody = `${authorYear ? `${authorYear}, ` : ''}“${title}”, ${editorsStr}${item.bookTitle || ''}${placePub ? `, ${placePub}` : ''}${pageInfo}.`;
      plainBody = `${authorYear ? `${authorYear}, ` : ''}“${title}”, ${editorsStr}${item.bookTitle || ''}${placePub ? `, ${placePub}` : ''}${pageInfo}.`;
      break;
    }
    case 'thesis': {
      const degree = item.degree || (isEn ? 'Ph.D. Dissertation' : 'Luận án Tiến sĩ');
      const parts = [
        degree,
        item.institution,
        item.place,
        item.totalPages
      ].filter(Boolean).join(', ');

      htmlBody = `${authorYear ? `${authorYear}, ` : ''}${title}, ${parts}.`;
      plainBody = `${authorYear ? `${authorYear}, ` : ''}${title}, ${parts}.`;
      break;
    }
    case 'conference':
    case 'proceedings':
    case 'conference_presentation': {
      const parts = [
        item.conferenceName,
        item.organizer,
        item.conferenceLocation,
        item.pages ? (isEn ? `pp. ${item.pages}` : `tr. ${item.pages}`) : undefined
      ].filter(Boolean).join(', ');

      htmlBody = `${authorYear ? `${authorYear}, ` : ''}“${title}”, ${parts}.`;
      plainBody = `${authorYear ? `${authorYear}, ` : ''}“${title}”, ${parts}.`;
      break;
    }
    case 'manuscript': {
      const unpubTag = isEn ? '[forthcoming]' : '[tài liệu chưa xuất bản]';
      const parts = [
        item.institution || item.publisher,
        item.place,
        unpubTag
      ].filter(Boolean).join(', ');

      htmlBody = `${authorYear ? `${authorYear}, ` : ''}${title}, ${parts}.`;
      plainBody = `${authorYear ? `${authorYear}, ` : ''}${title}, ${parts}.`;
      break;
    }
    case 'webpage':
    case 'org_online': {
      const accessStr = isEn ? `access on ${item.accessDate || ''}` : `truy cập ngày ${item.accessDate || ''}`;
      const parts = [
        item.siteName,
        accessStr,
        item.url
      ].filter(Boolean).join(', ');

      htmlBody = `${authorYear ? `${authorYear}, ` : ''}${title}, ${parts}.`;
      plainBody = `${authorYear ? `${authorYear}, ` : ''}${title}, ${parts}.`;
      break;
    }
    case 'legal': {
      const docNum = item.documentNumber || '';
      const dateStr = item.publicationDate ? ` ngày ${item.publicationDate}` : '';
      const auth = item.issuingAuthority ? ` của ${item.issuingAuthority}` : '';

      htmlBody = `${docNum}${dateStr}${auth} về ${title}.`;
      plainBody = `${docNum}${dateStr}${auth} về ${title}.`;
      break;
    }
    default: {
      htmlBody = `${authorYear ? `${authorYear}, ` : ''}${title}.`;
      plainBody = `${authorYear ? `${authorYear}, ` : ''}${title}.`;
    }
  }

  return { html: htmlBody.trim(), plainText: plainBody.trim() };
}

export interface VnuLanguageGroup {
  language: string;
  label: string;
  items: CitationItem[];
}

export function groupAndSortVnuBibliography(items: CitationItem[]): VnuLanguageGroup[] {
  const groupsMap: { [lang: string]: CitationItem[] } = {};

  items.forEach(item => {
    const lang = item.language || 'vi';
    if (!groupsMap[lang]) {
      groupsMap[lang] = [];
    }
    groupsMap[lang].push(item);
  });

  const languageLabels: Record<string, string> = {
    vi: 'TÀI LIỆU TIẾNG VIỆT',
    en: 'TÀI LIỆU TIẾNG ANH',
    fr: 'TÀI LIỆU TIẾNG PHÁP',
    ru: 'TÀI LIỆU TIẾNG NGA',
    zh: 'TÀI LIỆU TIẾNG TRUNG',
    ja: 'TÀI LIỆU TIẾNG NHẬT',
    other: 'TÀI LIỆU NGÔN NGỮ KHÁC'
  };

  const priorityOrder = ['vi', 'en', 'fr', 'ru', 'zh', 'ja', 'other'];
  const result: VnuLanguageGroup[] = [];

  priorityOrder.forEach(lang => {
    if (groupsMap[lang] && groupsMap[lang].length > 0) {
      const sorted = [...groupsMap[lang]].sort((a, b) => {
        const authorA = a.authors[0];
        const authorB = b.authors[0];

        let keyA = '';
        let keyB = '';

        if (!authorA) {
          keyA = a.title;
        } else if (authorA.isVietnamese) {
          keyA = authorA.given || authorA.rawName;
        } else {
          keyA = authorA.family || authorA.rawName;
        }

        if (!authorB) {
          keyB = b.title;
        } else if (authorB.isVietnamese) {
          keyB = authorB.given || authorB.rawName;
        } else {
          keyB = authorB.family || authorB.rawName;
        }

        return keyA.localeCompare(keyB, 'vi', { sensitivity: 'base' });
      });

      result.push({
        language: lang,
        label: languageLabels[lang] || `TÀI LIỆU ${lang.toUpperCase()}`,
        items: sorted
      });
    }
  });

  return result;
}
