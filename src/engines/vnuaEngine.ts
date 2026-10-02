import type { CitationItem, Author, InTextCitationOptions } from '../types/citation';
import { formatAuthorForVnuaBib, getAuthorInTextKey } from '../utils/nameParser';
import type { FormattedBibResult } from './apaEngine';

export const VNUA_NAME = 
  "Định dạng trích dẫn và danh mục tài liệu tham khảo trong tài liệu khoa học của Học viện Nông nghiệp Việt Nam";

export const VNUA_SHORT_DESC = 
  "Định dạng trích dẫn và danh mục tài liệu tham khảo trong tài liệu khoa học của Học viện Nông nghiệp Việt Nam (Kèm theo Quyết định số 491/QĐ-HVN ngày 21 tháng 02 năm 2020)";

/**
 * Format authors in bibliography according to VNUA QĐ 491:
 * - List all authors! No "et al." or "& cs." in bibliography.
 * - Vietnamese: full name in natural order (Hà Xuân Bộ).
 * - Foreign: Surname Initials. (Li H., Goodpaster K. E.).
 * - Connect last author with "&" symbol.
 */
export function formatVnuaAuthors(authors: Author[]): string {
  if (!authors || authors.length === 0) return '';
  if (authors.length === 1) {
    return formatAuthorForVnuaBib(authors[0]);
  }
  if (authors.length === 2) {
    return `${formatAuthorForVnuaBib(authors[0])} & ${formatAuthorForVnuaBib(authors[1])}`;
  }
  const prefix = authors.slice(0, -1).map(a => formatAuthorForVnuaBib(a)).join(', ');
  const last = formatAuthorForVnuaBib(authors[authors.length - 1]);
  return `${prefix} & ${last}`;
}

/**
 * In-text citation according to VNUA QĐ 491:
 * - 1 author:
 *   VN: Nguyễn Văn Toàn (2008) / (Nguyễn Văn Toàn, 2008)
 *   Foreign: Smith (1998) / (Smith, 1998)
 * - 2 authors:
 *   VN: Nguyễn Văn Toàn & Đặng Văn Lâm (2008) / (Nguyễn Văn Toàn & Đặng Văn Lâm, 2008)
 *   Foreign: Smith & Brown (1998) / (Smith & Brown, 1998)
 * - 3+ authors:
 *   Vietnamese text: Author 1 + "& cs." (Nguyễn Văn An & cs., 1999) / (Smith & cs., 1999)
 *   English text: Author 1 + "et al." (Nguyen Van An et al., 1999) / (Smith et al., 1999)
 */
export function formatVnuaInText(
  item: CitationItem,
  options: InTextCitationOptions = {}
): string {
  const { isNarrative = false, pageNumbers, suffixYear = '', isEnglishText = false } = options;
  const etAl = isEnglishText ? 'et al.' : '& cs.';

  let authorPart = '';
  if (!item.authors || item.authors.length === 0) {
    authorPart = item.title.trim().split(/\s+/).slice(0, 3).join(' ');
  } else if (item.authors.length === 1) {
    authorPart = getAuthorInTextKey(item.authors[0], 'vnua');
  } else if (item.authors.length === 2) {
    const a1 = getAuthorInTextKey(item.authors[0], 'vnua');
    const a2 = getAuthorInTextKey(item.authors[1], 'vnua');
    authorPart = `${a1} & ${a2}`;
  } else {
    const a1 = getAuthorInTextKey(item.authors[0], 'vnua');
    authorPart = `${a1} ${etAl}`;
  }

  const yearPart = item.year ? `${item.year}${suffixYear}` : 'k.n.';
  const pagePart = pageNumbers ? `, ${pageNumbers}` : '';

  if (isNarrative) {
    return `${authorPart} (${yearPart}${pagePart})`;
  } else {
    return `(${authorPart}, ${yearPart}${pagePart})`;
  }
}

/**
 * Format Bibliography Item for VNUA according to 11 official categories in QĐ 491:
 */
export function formatVnuaBibItem(item: CitationItem): FormattedBibResult {
  const authorsStr = formatVnuaAuthors(item.authors);
  const yearStr = item.year ? ` (${item.year})` : '';
  const authorYear = authorsStr ? `${authorsStr}${yearStr}.` : (yearStr ? `${yearStr.trim()}.` : '');
  const title = item.title.trim();

  let body = '';

  switch (item.type) {
    // 2.1: Bài báo khoa học
    case 'journal': {
      const journalName = item.journalName ? ` ${item.journalName}.` : '';
      let volIssue = '';
      if (item.volume && item.issue) {
        volIssue = ` ${item.volume}(${item.issue}):`;
      } else if (item.volume) {
        volIssue = ` ${item.volume}:`;
      } else if (item.issue) {
        volIssue = ` (${item.issue}):`;
      }
      const pages = item.pages ? ` ${item.pages}.` : (volIssue ? '.' : '');
      const doi = item.doi ? ` DOI: ${item.doi.replace(/^https?:\/\/doi\.org\//, '')}.` : '';

      body = `${authorYear} ${title}.${journalName}${volIssue}${pages}${doi}`;
      break;
    }

    // 2.2: Bài báo khoa học xuất bản online
    case 'journal_online': {
      const journalName = item.journalName ? ` ${item.journalName}.` : '';
      let volIssue = '';
      if (item.volume && item.issue) {
        volIssue = ` ${item.volume}(${item.issue}):`;
      } else if (item.volume) {
        volIssue = ` ${item.volume}:`;
      } else if (item.issue) {
        volIssue = ` (${item.issue}):`;
      }
      const pages = item.pages ? ` ${item.pages}.` : '';
      const doi = item.doi ? ` DOI: ${item.doi.replace(/^https?:\/\/doi\.org\//, '')}.` : '';
      const accessStr = item.url 
        ? (item.accessDate ? ` Truy cập từ ${item.url} ngày ${item.accessDate}.` : ` Truy cập từ ${item.url}.`)
        : '';

      body = `${authorYear} ${title}.${journalName}${volIssue}${pages}${doi}${accessStr}`;
      break;
    }

    // 2.3: Sách in
    case 'book':
    case 'book_print': {
      const editionPart = item.edition ? ` (${item.edition})` : '';
      const pubPart = item.publisher ? `. ${item.publisher}` : '';
      const placePart = item.place ? `, ${item.place}.` : (pubPart ? '.' : '');

      body = `${authorYear} ${title}${editionPart}${pubPart}${placePart}`;
      break;
    }

    // 2.4: Sách E-Book
    case 'book_ebook': {
      const reader = item.readerSoftware ? ` [${item.readerSoftware}]` : ' [ebook]';
      const accessStr = item.doi 
        ? ` DOI: ${item.doi.replace(/^https?:\/\/doi\.org\//, '')}.`
        : (item.url 
            ? (item.accessDate ? ` Truy cập từ trang ${item.url} ngày ${item.accessDate}.` : ` Truy cập từ ${item.url}.`)
            : '');

      body = `${authorYear} ${title}${reader}.${accessStr}`;
      break;
    }

    // 2.5: Sách truy cập từ cơ sở dữ liệu
    case 'book_database': {
      const accessStr = item.doi 
        ? ` DOI: ${item.doi.replace(/^https?:\/\/doi\.org\//, '')}.`
        : (item.url 
            ? (item.accessDate ? ` Truy cập từ ${item.url} ngày ${item.accessDate}.` : ` Truy cập từ ${item.url}.`)
            : '');

      body = `${authorYear} ${title}.${accessStr}`;
      break;
    }

    // 2.6: Chương trong sách
    case 'book_chapter': {
      let inPrefix = ' Trong:';
      if (item.editors && item.editors.length > 0) {
        inPrefix = ` Trong: ${formatVnuaAuthors(item.editors)} (chủ biên).`;
      }
      const bookPart = item.bookTitle ? ` ${item.bookTitle}.` : '';
      const pubPart = item.publisher ? ` ${item.publisher}` : '';
      const placePart = item.place ? `, ${item.place}.` : (pubPart ? '.' : '');
      const pagePart = item.pages ? ` ${item.pages}.` : '';

      body = `${authorYear} ${title}.${inPrefix}${bookPart}${pubPart}${placePart}${pagePart}`;
      break;
    }

    // 2.7: Luận văn, luận án
    case 'thesis': {
      const degree = item.degree || 'Luận án tiến sĩ';
      const inst = item.institution ? `. ${item.institution}` : '';
      const pages = item.pages ? `. ${item.pages}.` : '.';

      body = `${authorYear} ${title}. ${degree}${inst}${pages}`;
      break;
    }

    // 2.8: Sách, tài liệu do cơ quan/tổ chức ban hành
    case 'org_document': {
      const orgName = item.organization || authorsStr || '';
      const editor = item.editors && item.editors.length > 0 ? ` ${formatVnuaAuthors(item.editors)} (chủ biên).` : '';
      const accessStr = item.url 
        ? (item.accessDate ? ` (Truy cập từ ${item.url} ngày ${item.accessDate}).` : ` (Truy cập từ ${item.url}).`)
        : '';

      body = `${orgName}${yearStr}. ${title}.${editor}${accessStr}`;
      break;
    }

    // 2.9: Bài báo đăng trong các tuyển tập, kỷ yếu
    case 'proceedings': {
      const confPart = item.conferenceName ? ` ${item.conferenceName}.` : '';
      const pubPart = item.publisher ? ` ${item.publisher}.` : '';
      const pagePart = item.pages ? ` ${item.pages}.` : '';

      body = `${authorYear} ${title}.${confPart}${pubPart}${pagePart}`;
      break;
    }

    // 2.10: Tài liệu được trình bày tại các Hội nghị, hội thảo
    case 'conference':
    case 'conference_presentation': {
      const confPart = item.conferenceName ? ` ${item.conferenceName}.` : '';
      const datePart = item.conferenceDate ? ` Ngày ${item.conferenceDate}.` : '';
      const locPart = item.conferenceLocation ? ` ${item.conferenceLocation}.` : '';
      const pagePart = item.pages ? ` ${item.pages}.` : '';

      body = `${authorYear} ${title}.${confPart}${datePart}${locPart}${pagePart}`;
      break;
    }

    // 2.11: Tài liệu trực tuyến của cơ quan, tổ chức
    case 'webpage':
    case 'org_online': {
      const org = item.organization || authorsStr || '';
      const accessStr = item.url 
        ? (item.accessDate ? ` Truy cập từ ${item.url} ngày ${item.accessDate}.` : ` Truy cập từ ${item.url}.`)
        : '';

      body = `${org}${yearStr}. ${title}.${accessStr}`;
      break;
    }

    default: {
      body = `${authorYear} ${title}.`;
    }
  }

  // Clean trailing punctuation
  const cleaned = body.replace(/\.\./g, '.').replace(/\s+/g, ' ').trim();
  return {
    html: cleaned,
    plainText: cleaned
  };
}
