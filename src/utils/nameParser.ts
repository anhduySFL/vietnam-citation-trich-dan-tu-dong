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

  // Handle "Surname, Given M." or natural "Given M. Surname" or "Nguyễn Văn A"
  const isVN = forcedVietnamese !== undefined ? forcedVietnamese : isLikelyVietnameseName(cleanName);

  let family = '';
  let middle = '';
  let given = '';

  if (cleanName.includes(',')) {
    // Foreign style: "Lenin, Vladimir Ilyich" or "Gaetke, L.M."
    const [last, first] = cleanName.split(',').map(s => s.trim());
    family = last;
    const firstParts = first ? first.split(/\s+/) : [];
    given = firstParts[0] || '';
    middle = firstParts.slice(1).join(' ');
  } else {
    const parts = cleanName.split(/\s+/);
    if (isVN) {
      // Vietnamese: Họ là từ đầu tiên, Tên là từ cuối cùng, Đệm là các từ ở giữa
      family = parts[0] || '';
      given = parts.length > 1 ? parts[parts.length - 1] : '';
      middle = parts.length > 2 ? parts.slice(1, -1).join(' ') : '';
    } else {
      // Western natural: "Vladimir Ilyich Lenin" -> Given: Vladimir, Middle: Ilyich, Family: Lenin
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
 * Format author name for APA Bibliography (Đại học Huế):
 * - Người nước ngoài: Họ, các chữ cái đầu tên viết hoa kèm dấu chấm. Ví dụ: Lenin, V.I. hoặc Gaetke, L.M.
 * - Người Việt: Tên, các chữ cái đầu họ và đệm viết hoa kèm dấu chấm. Ví dụ: Châu, N.B. hoặc Hương, N. T. L.
 */
export function formatAuthorForApaBib(author: Author): string {
  if (author.isCorporate) return author.rawName;

  if (author.isVietnamese) {
    const initials = [author.family, author.middle]
      .filter(Boolean)
      .map(part => getInitials(part))
      .join('');
    
    // Add original script if any: Lizhi, X. [谢丽芝]
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
 * Format author name for IEEE Bibliography (Đại học Huế):
 * - Người nước ngoài: Tên viết tắt, Họ đầy đủ. Ví dụ: V.I. Lenin, L. M. Gaetke
 * - Người Việt: Họ đệm viết tắt, Tên đầy đủ. Ví dụ: N.B. Châu, N. T. L Hương
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
 * Format author name for VNU Bibliography:
 * - Người Việt: Giữ nguyên thứ tự thông thường "Trương Quang Học và Nguyễn Đức Ngữ", không đảo tên.
 * - Người nước ngoài:
 *   + Tác giả đầu tiên: Họ, Tên viết tắt (ví dụ: Sterling E.J.)
 *   + Tác giả thứ 2 trở đi: Tên viết tắt Họ (ví dụ: M.M. Hurley and Le Duc Minh)
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
      // First author: Surname Initials (e.g. Sterling E.J.)
      return `${author.family} ${initials}`.trim();
    } else {
      // Subsequent authors: Initials Surname (e.g. M.M. Hurley)
      return `${initials} ${author.family}`.trim();
    }
  }
}

/**
 * Get In-Text primary identifier:
 * - APA ĐH Huế: Người Việt dùng Tên ("Hùng", "Tiến"); Nước ngoài dùng Họ ("Smith", "Obama")
 * - VNU: Người Việt dùng cả Họ Tên ("Nguyễn Văn A"); Nước ngoài dùng Họ ("Goedkoop")
 */
export function getAuthorInTextKey(author: Author, style: 'apa' | 'vnu'): string {
  if (author.isCorporate) return author.rawName;
  if (style === 'apa') {
    return author.isVietnamese ? (author.given || author.rawName) : (author.family || author.rawName);
  } else {
    // VNU
    return author.isVietnamese ? author.rawName : (author.family || author.rawName);
  }
}
