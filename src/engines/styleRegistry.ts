import type { CitationItem, CitationStyle, FormattedCitation, InTextCitationOptions, StyleDefinition } from '../types/citation';
import { formatApaInText, formatApaBibItem } from './apaEngine';
import { formatIeeeBibItem } from './ieeeEngine';
import { formatVnuInText, formatVnuBibItem, VNU_HANOI_NOTE } from './vnuHanoiEngine';
import { formatVnuaInText, formatVnuaBibItem, VNUA_NAME, VNUA_SHORT_DESC } from './vnuaEngine';

export const BUILTIN_STYLES: StyleDefinition[] = [
  {
    id: 'apa',
    displayName: 'Chuẩn APA',
    shortDescription: 'American Psychological Association (Kiểu Tác giả - Năm). Phổ biến trong khoa học xã hội, kinh tế và giáo dục.',
    sourceNote: 'Quy chuẩn theo Publication Manual of the American Psychological Association.',
    supportedTypes: ['journal', 'book', 'book_chapter', 'conference', 'thesis', 'newspaper', 'webpage'],
    authorRulesSummary: 'Tác giả nước ngoài: Họ, Tên viết tắt. Tác giả Việt Nam: Tên, Họ Đệm viết tắt hoặc Họ tên đầy đủ.',
    isBuiltin: true
  },
  {
    id: 'ieee',
    displayName: 'Chuẩn IEEE',
    shortDescription: 'Institute of Electrical and Electronics Engineers (Kiểu Số trong ngoặc vuông). Chuẩn mực trong kỹ thuật, công nghệ thông tin.',
    sourceNote: 'Quy chuẩn theo IEEE Citation Style Guide. Tự động gộp dải số [2–5].',
    supportedTypes: ['journal', 'book', 'book_chapter', 'conference', 'thesis', 'newspaper', 'webpage'],
    authorRulesSummary: 'Tên viết tắt trước Họ (J. A. Smith). Trích dẫn thân bài theo số thứ tự [1], [2-4].',
    isBuiltin: true
  },
  {
    id: 'vnu',
    displayName: 'VNU (Hanoi)',
    shortDescription: 'Quy cách trích dẫn theo Đại học Quốc gia Hà Nội và Bộ Giáo dục & Đào tạo.',
    sourceNote: VNU_HANOI_NOTE,
    supportedTypes: ['journal', 'book', 'book_chapter', 'conference', 'thesis', 'manuscript', 'webpage', 'legal'],
    authorRulesSummary: 'Phân chia danh mục theo ngôn ngữ riêng biệt (Tiếng Việt, Tiếng Anh...). Tác giả Việt xếp A-Z theo tên.',
    isBuiltin: true
  },
  {
    id: 'vnua',
    displayName: 'VNUA',
    shortDescription: VNUA_NAME,
    sourceNote: VNUA_SHORT_DESC,
    supportedTypes: [
      'journal', 'journal_online', 'book_print', 'book_ebook', 'book_database',
      'book_chapter', 'thesis', 'org_document', 'proceedings', 'conference_presentation', 'org_online'
    ],
    authorRulesSummary: 'Liệt kê đầy đủ tất cả tác giả trong danh mục TLTK (không dùng et al.). Nối tác giả bằng ký hiệu "&".',
    isBuiltin: true
  }
];

// In-memory custom styles (can be added by Admin in the current session)
const customStylesRegistry: Map<string, StyleDefinition> = new Map();

export function registerCustomStyle(style: StyleDefinition) {
  customStylesRegistry.set(style.id, style);
}

export function getAllStyles(): StyleDefinition[] {
  return [...BUILTIN_STYLES, ...Array.from(customStylesRegistry.values())];
}

export function getStyleDefinition(styleId: CitationStyle): StyleDefinition {
  const found = getAllStyles().find(s => s.id === styleId);
  return found || BUILTIN_STYLES[0];
}

/**
 * Universal formatter for a single item under any style
 */
export function formatCitation(
  item: CitationItem,
  styleId: CitationStyle,
  index = 1,
  options: InTextCitationOptions = {}
): FormattedCitation {
  if (styleId === 'ieee') {
    const bib = formatIeeeBibItem(item, index);
    const inText = options.pageNumbers ? `[${index}, ${options.pageNumbers}]` : `[${index}]`;
    return {
      inText,
      bibliographyHtml: bib.html,
      bibliographyPlainText: bib.plainText
    };
  }

  if (styleId === 'vnu') {
    const bib = formatVnuBibItem(item);
    const inText = formatVnuInText(item, options);
    return {
      inText,
      bibliographyHtml: bib.html,
      bibliographyPlainText: bib.plainText
    };
  }

  if (styleId === 'vnua') {
    const bib = formatVnuaBibItem(item);
    const inText = formatVnuaInText(item, options);
    return {
      inText,
      bibliographyHtml: bib.html,
      bibliographyPlainText: bib.plainText
    };
  }

  // Default APA
  const bib = formatApaBibItem(item);
  const inText = formatApaInText(item, options);
  return {
    inText,
    bibliographyHtml: bib.html,
    bibliographyPlainText: bib.plainText
  };
}
