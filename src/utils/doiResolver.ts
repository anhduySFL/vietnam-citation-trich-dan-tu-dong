import type { CitationItem, Author, ItemType } from '../types/citation';
import { parseAuthorName } from './nameParser';

export function extractDoi(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  const match = trimmed.match(/(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/i);
  return match ? match[1].replace(/[.,;)]+$/, '') : null;
}

export async function resolveDoi(rawDoi: string): Promise<CitationItem> {
  const cleanDoi = extractDoi(rawDoi);
  if (!cleanDoi) {
    throw new Error('Định dạng mã DOI không hợp lệ. Ví dụ hợp lệ: 10.1016/j.ijedudev.2007.08.001');
  }

  const crossrefUrl = `https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`;
  
  let response: Response;
  try {
    response = await fetch(crossrefUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
  } catch (err: any) {
    throw new Error(`Không thể kết nối đến cơ sở dữ liệu DOI Crossref (${err?.message || 'Lỗi mạng'}).`);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Mã DOI "${cleanDoi}" không tồn tại hoặc chưa được đăng ký trong hệ thống Crossref.`);
    }
    throw new Error(`Crossref phản hồi lỗi mã ${response.status}. Vui lòng thử lại hoặc nhập thủ công.`);
  }

  const json = await response.json();
  const item = json.message;
  if (!item) {
    throw new Error('Không nhận được dữ liệu hợp lệ từ máy chủ Crossref.');
  }

  // Extract authors
  const authors: Author[] = [];
  if (Array.isArray(item.author) && item.author.length > 0) {
    item.author.forEach((a: any) => {
      if (a.name) {
        // Corporate or single name
        authors.push(parseAuthorName(a.name, true));
      } else if (a.family || a.given) {
        const full = [a.family, a.given].filter(Boolean).join(', ');
        authors.push(parseAuthorName(full, false));
      }
    });
  }

  // Extract year & date
  let year: number | undefined = undefined;
  let pubDateStr: string | undefined = undefined;
  const dateParts = item['published-print']?.['date-parts']?.[0] || 
                    item['published-online']?.['date-parts']?.[0] || 
                    item['created']?.['date-parts']?.[0];
  if (Array.isArray(dateParts) && dateParts.length > 0) {
    year = dateParts[0];
    if (dateParts.length >= 3) {
      pubDateStr = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }
  }

  // Determine type
  let itemType: ItemType = 'journal';
  const crType = (item.type || '').toLowerCase();
  if (crType.includes('book') || crType.includes('monograph')) {
    itemType = 'book';
  } else if (crType.includes('chapter')) {
    itemType = 'book_chapter';
  } else if (crType.includes('proceedings') || crType.includes('conference')) {
    itemType = 'conference';
  } else if (crType.includes('dissertation')) {
    itemType = 'thesis';
  }

  const title = (item.title?.[0] || '').trim();
  if (!title) {
    throw new Error('Tài liệu DOI không có thông tin tiêu đề.');
  }

  const journalName = item['container-title']?.[0] || undefined;
  const volume = item.volume || undefined;
  const issue = item.issue || undefined;
  const pages = item.page || undefined;
  const publisher = item.publisher || undefined;
  const url = item.URL || `https://doi.org/${cleanDoi}`;

  const now = Date.now();
  const citationItem: CitationItem = {
    id: Math.random().toString(36).substring(2, 9),
    type: itemType,
    title,
    authors,
    year,
    publicationDate: pubDateStr,
    journalName,
    volume,
    issue,
    pages,
    doi: cleanDoi,
    publisher,
    url,
    language: 'en',
    fieldSources: {
      title: 'crossref',
      authors: 'crossref',
      year: 'crossref',
      journalName: 'crossref',
      doi: 'crossref',
      pages: 'crossref',
      volume: 'crossref',
      issue: 'crossref',
      publisher: 'crossref'
    },
    createdAt: now,
    expiresAt: now + 15 * 60 * 1000
  };

  return citationItem;
}
