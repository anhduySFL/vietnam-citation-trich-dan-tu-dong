import type { Author } from '../types/citation';

const VIETNAMESE_SURNAMES = new Set([
  'nguyễn', 'trần', 'lê', 'phạm', 'hoàng', 'huỳnh', 'phan', 'vũ', 'võ',
  'đặng', 'bùi', 'đỗ', 'hồ', 'ngô', 'dương', 'lý', 'đoàn', 'đào', 'đinh',
  'mai', 'lâm', 'phùng', 'trịnh', 'lương', 'trương', 'tạ', 'quách', 'cao',
  'châu', 'hà', 'thái', 'vương', 'triệu', 'la', 'tô', 'ung', 'lưu', 'từ'
]);

export function isLikelyVietnameseName(name: string): boolean {
  if (!name) return false;
  const parts = name.trim().toLowerCase().split(/\s+/);
  if (parts.length < 2) return false;
  return VIETNAMESE_SURNAMES.has(parts[0]);
}

export function parseAuthorName(raw: string, isCorporate = false, forcedVietnamese?: boolean): Author {
  const trimmed = raw.trim();
  if (isCorporate) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      rawName: trimmed,
      isCorporate: true,
      isVietnamese: false
    };
  }

  // Detect script like [谢丽芝]
  let originalScript: string | undefined = undefined;
  let cleanName = trimmed;
  const scriptMatch = trimmed.match(/\[(.*?)\]/);
  if (scriptMatch) {
    originalScript = scriptMatch[1];
    cleanName = trimmed.replace(/\[(.*?)\]/, '').trim();
  }

  const isVN = forcedVietnamese !== undefined ? forcedVietnamese : isLikelyVietnameseName(cleanName);

  let family = '';
  let middle = '';
  let given = '';

  if (cleanName.includes(',')) {
    // Foreign comma format: "Smith, John A." or "Lenin, V.I."
    const [last, first] = cleanName.split(',').map(s => s.trim());
    family = last;
    const firstParts = first ? first.split(/\s+/) : [];
    given = firstParts[0] || '';
    middle = firstParts.slice(1).join(' ');
  } else {
    const parts = cleanName.split(/\s+/);
    if (isVN) {
      // Vietnamese: Họ là từ đầu, Tên là từ cuối, Đệm là giữa
      family = parts[0] || '';
      given = parts.length > 1 ? parts[parts.length - 1] : '';
      middle = parts.length > 2 ? parts.slice(1, -1).join(' ') : '';
    } else {
      given = parts[0] || '';
      family = parts.length > 1 ? parts[parts.length - 1] : '';
      middle = parts.length > 2 ? parts.slice(1, -1).join(' ') : '';
    }
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    rawName: cleanName,
    family,
    middle,
    given,
    isVietnamese: isVN,
    isCorporate: false,
    originalScript
  };
}

export function getInitials(str?: string): string {
  if (!str) return '';
  return str
    .split(/[\s.-]+/)
    .filter(Boolean)
    .map(p => `${p.charAt(0).toUpperCase()}.`)
    .join('');
}

export function getInitialsWithSpace(str?: string): string {
  if (!str) return '';
  return str
    .split(/[\s.-]+/)
    .filter(Boolean)
    .map(p => `${p.charAt(0).toUpperCase()}.`)
    .join(' ');
}

/**
 * Format author name for APA Bibliography:
 * - Foreign: Surname, Initials (e.g. Smith, J. A.)
 * - Vietnamese: Tên, Họ Đệm viết tắt hoặc Họ tên đầy đủ chuẩn hóa
 */
export function formatAuthorForApaBib(author: Author): string {
  if (author.isCorporate) return author.rawName;

  if (author.isVietnamese) {
    const initials = [author.family, author.middle]
      .filter(Boolean)
      .map(part => getInitials(part))
      .join('');
    const scriptSuffix = author.originalScript ? ` [${author.originalScript}]` : '';
    return `${author.given}, ${initials}${scriptSuffix}`;
  } else {
    const initials = [author.given, author.middle]
      .filter(Boolean)
      .map(part => getInitials(part))
      .join('');
    const scriptSuffix = author.originalScript ? ` [${author.originalScript}]` : '';
    return `${author.family}, ${initials}${scriptSuffix}`;
  }
}

/**
 * Format author name for IEEE Bibliography:
 * - Foreign: Initials Surname (e.g. J. A. Smith)
 * - Vietnamese: Initials GivenName (e.g. N. B. Châu)
 */
export function formatAuthorForIeeeBib(author: Author): string {
  if (author.isCorporate) return author.rawName;

  if (author.isVietnamese) {
    const initials = [author.family, author.middle]
      .filter(Boolean)
      .map(part => getInitials(part))
      .join('');
    const scriptSuffix = author.originalScript ? ` [${author.originalScript}]` : '';
    return `${initials} ${author.given}${scriptSuffix}`;
  } else {
    const initials = [author.given, author.middle]
      .filter(Boolean)
      .map(part => getInitialsWithSpace(part))
      .join(' ');
    const scriptSuffix = author.originalScript ? ` [${author.originalScript}]` : '';
    return `${initials} ${author.family}${scriptSuffix}`;
  }
}

/**
 * Format author name for VNU (Hanoi) Bibliography:
 * - Vietnamese: Full natural name "Trương Quang Học" (sorted by given name in bibliography)
 * - Foreign: Author 1: Surname Initials (e.g. Sterling E.J.), Author 2+: Initials Surname
 */
export function formatAuthorForVnuBib(author: Author, index: number): string {
  if (author.isCorporate) return author.rawName;

  if (author.isVietnamese) {
    return author.rawName;
  } else {
    const initials = [author.given, author.middle]
      .filter(Boolean)
      .map(part => getInitials(part))
      .join('');
    if (index === 0) {
      return `${author.family} ${initials}`.trim();
    } else {
      return `${initials} ${author.family}`.trim();
    }
  }
}

/**
 * Format author name for VNUA Bibliography (Quyết định số 491/QĐ-HVN):
 * - Tác giả Việt Nam: Sử dụng đầy đủ họ và tên theo tài liệu gốc (không đảo họ tên, không dùng dấu phẩy ngăn họ và tên).
 * - Tác giả Nước ngoài: Họ đứng trước, viết tắt tên đệm và tên kèm theo dấu chấm "." (VD: Li H., Goodpaster K. E.)
 */
export function formatAuthorForVnuaBib(author: Author): string {
  if (author.isCorporate) return author.rawName;

  if (author.isVietnamese) {
    return author.rawName;
  } else {
    // Foreign: Surname Initials with spaces: "Goodpaster K. E." or "Li H."
    const initials = [author.given, author.middle]
      .filter(Boolean)
      .map(part => getInitialsWithSpace(part))
      .join(' ')
      .trim();
    return initials ? `${author.family} ${initials}` : (author.family || author.rawName);
  }
}

export function getAuthorInTextKey(author: Author, style: 'apa' | 'vnu' | 'vnua' | 'ieee'): string {
  if (author.isCorporate) return author.rawName;
  if (style === 'apa') {
    return author.isVietnamese ? (author.given || author.rawName) : (author.family || author.rawName);
  } else if (style === 'vnua' || style === 'vnu') {
    return author.isVietnamese ? author.rawName : (author.family || author.rawName);
  }
  return author.family || author.rawName;
}
