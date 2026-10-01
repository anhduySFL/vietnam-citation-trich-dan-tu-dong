export type ItemType =
  | 'book'
  | 'book_chapter'
  | 'journal'
  | 'conference'
  | 'newspaper'
  | 'thesis'
  | 'webpage'
  | 'legal'
  | 'manuscript';

export type CitationStyle = 'apa' | 'ieee' | 'vnu';

export interface Author {
  id: string;
  rawName: string;
  family?: string;
  middle?: string;
  given?: string;
  isVietnamese?: boolean;
  isCorporate?: boolean;
  originalScript?: string; // e.g. 谢丽芝 (for non-Latin)
}

export interface CitationItem {
  id: string;
  type: ItemType;
  title: string;
  authors: Author[];
  year?: number | string; // e.g. 2020 or "đang in" / "forthcoming"
  language: 'vi' | 'en' | 'fr' | 'ru' | 'zh' | 'ja' | 'other';
  
  // Specific metadata
  publisher?: string;
  place?: string; // Nơi xuất bản / Địa điểm
  edition?: string; // Lần tái bản (e.g. 2nd ed.)
  totalPageCount?: string; // e.g. "389 tr." or "448 p."
  
  // Journal / Magazine
  journalName?: string;
  volume?: string;
  issue?: string;
  pages?: string; // e.g. "79-94"
  doi?: string;
  
  // Book chapter
  bookTitle?: string;
  editors?: Author[];
  
  // Conference
  conferenceName?: string;
  organizer?: string;
  conferenceLocation?: string;
  conferenceDate?: string;
  
  // Thesis
  degree?: string; // Luận án Tiến sĩ / Luận văn Thạc sĩ / PhD thesis
  institution?: string; // Trường / Viện đào tạo
  
  // Newspaper
  newspaperName?: string;
  pubDateExact?: string; // e.g. "23/6/2014" or "12/4/2012"
  
  // Web / Online
  url?: string;
  accessDate?: string; // e.g. "21/7/2016"
  siteName?: string;
  
  // Legal
  documentNumber?: string; // e.g. "18/2014/TT-BNNPTNT"
  issuingAuthority?: string; // e.g. "Bộ Nông nghiệp và Phát triển Nông thôn"
  
  // Non-Latin translation
  translatedTitle?: string; // e.g. [The novel in modern Arabic literature]
  
  // In-text sequence tracking
  inTextOrder?: number;
}

export interface InTextCitationOptions {
  style: CitationStyle;
  isNarrative?: boolean; // e.g. According to Smith (2020) vs (Smith, 2020)
  pageNumbers?: string;  // e.g. "tr. 97-98"
  suffixYear?: string;   // e.g. 'a', 'b' for same author same year
}
