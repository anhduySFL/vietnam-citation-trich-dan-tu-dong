export type StandardItemType =
  | 'journal'
  | 'journal_online'
  | 'book'
  | 'book_ebook'
  | 'book_database'
  | 'book_chapter'
  | 'conference'
  | 'conference_presentation'
  | 'proceedings'
  | 'thesis'
  | 'newspaper'
  | 'webpage'
  | 'legal'
  | 'manuscript'
  | 'org_document'
  | 'org_online';

export type ItemType = StandardItemType | string;

export type BuiltinCitationStyle = 'apa' | 'ieee' | 'vnu' | 'vnua';
export type CitationStyle = BuiltinCitationStyle | string;

export type MetadataFieldSource = 
  | 'json-ld'
  | 'citation-meta'
  | 'dublin-core'
  | 'opengraph'
  | 'crossref'
  | 'user'
  | 'inferred';

export interface Author {
  id: string;
  rawName: string;
  family?: string;
  middle?: string;
  given?: string;
  isVietnamese?: boolean;
  isCorporate?: boolean;
  originalScript?: string; // e.g. 谢丽芝 for non-Latin
}

export interface CitationItem {
  id: string;
  type: ItemType;
  title: string;
  authors: Author[];
  year?: number | string;
  publicationDate?: string; // e.g. "2024-05-12" or "23/6/2014"
  language: 'vi' | 'en' | 'fr' | 'ru' | 'zh' | 'ja' | 'other';

  // Publication venue
  journalName?: string;
  volume?: string;
  issue?: string;
  edition?: string;
  pages?: string;           // e.g. "79-94"
  startPage?: string;       // "79"
  endPage?: string;         // "94"
  totalPages?: string;      // e.g. "389 tr." or "448 p."
  doi?: string;

  // Book & Chapter
  bookTitle?: string;
  editors?: Author[];
  publisher?: string;
  place?: string;           // Nơi xuất bản / Thành phố

  // Conference & Proceedings
  conferenceName?: string;
  conferenceLocation?: string;
  conferenceDate?: string;
  organizer?: string;

  // Thesis
  degree?: string;          // Luận án tiến sĩ / Luận văn thạc sĩ / Master thesis
  institution?: string;      // Cơ sở đào tạo (Trường/Viện)

  // Newspaper / Web
  newspaperName?: string;
  siteName?: string;
  url?: string;
  accessDate?: string;      // e.g. "21/07/2024"

  // Corporate & Legal
  organization?: string;
  documentNumber?: string;
  issuingAuthority?: string;

  // E-book & Database specifics
  readerSoftware?: string;  // e.g. "ebook" or "phần mềm đọc sách"
  databaseName?: string;

  // Non-Latin translation
  translatedTitle?: string;

  // Legacy/Compatibility fields
  pubDateExact?: string;
  totalPageCount?: number | string;

  // Source tracking
  fieldSources?: Record<string, MetadataFieldSource>;

  // Session TTL metadata
  createdAt?: number;
  expiresAt?: number;
}

export interface InTextCitationOptions {
  isNarrative?: boolean;
  pageNumbers?: string;
  suffixYear?: string;
  isEnglishText?: boolean;
}

export interface FormattedCitation {
  inText: string;
  bibliographyHtml: string;
  bibliographyPlainText: string;
}

export interface StyleDefinition {
  id: string;
  displayName: string;
  shortDescription: string;
  sourceNote?: string;
  supportedTypes: ItemType[];
  authorRulesSummary: string;
  isBuiltin: boolean;
}
