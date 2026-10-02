import type { CitationItem, Author, ItemType, MetadataFieldSource } from '../types/citation';
import { parseAuthorName } from './nameParser';
import { extractDoi } from './doiResolver';

export function parseHtmlMetadata(html: string, targetUrl: string): CitationItem {
  const fieldSources: Record<string, MetadataFieldSource> = {};

  let title = '';
  let authors: Author[] = [];
  let year: number | string | undefined = undefined;
  let pubDateStr: string | undefined = undefined;
  let journalName: string | undefined = undefined;
  let volume: string | undefined = undefined;
  let issue: string | undefined = undefined;
  let pages: string | undefined = undefined;
  let doi: string | undefined = undefined;
  let publisher: string | undefined = undefined;
  let siteName: string | undefined = undefined;
  let language: 'vi' | 'en' | 'fr' | 'ru' | 'zh' | 'ja' | 'other' = 'vi';
  let itemType: ItemType = 'webpage';

  // Helper to extract meta tag contents
  const getMeta = (names: string[]): string | undefined => {
    for (const name of names) {
      // name="..." or property="..."
      const reg = new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i');
      const m = html.match(reg);
      if (m && m[1]) return m[1].trim();

      // content="..." before name/property
      const reg2 = new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`, 'i');
      const m2 = html.match(reg2);
      if (m2 && m2[1]) return m2[1].trim();
    }
    return undefined;
  };

  const getAllMeta = (name: string): string[] => {
    const results: string[] = [];
    const reg = new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`, 'gi');
    let match;
    while ((match = reg.exec(html)) !== null) {
      if (match[1]) results.push(match[1].trim());
    }
    return results;
  };

  // 1. JSON-LD / schema.org
  try {
    const jsonLdMatches = html.match(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatches) {
      for (const block of jsonLdMatches) {
        const rawJson = block.replace(/<script[^>]*>|<\/script>/gi, '').trim();
        const data = JSON.parse(rawJson);
        const obj = Array.isArray(data) ? data[0] : (data['@graph'] ? data['@graph'][0] : data);

        if (obj) {
          if (!title && obj.headline) {
            title = obj.headline;
            fieldSources.title = 'json-ld';
          } else if (!title && obj.name) {
            title = obj.name;
            fieldSources.title = 'json-ld';
          }

          if (authors.length === 0 && obj.author) {
            const rawAuthors = Array.isArray(obj.author) ? obj.author : [obj.author];
            rawAuthors.forEach((a: any) => {
              const aName = typeof a === 'string' ? a : (a.name || '');
              if (aName) authors.push(parseAuthorName(aName, a['@type'] === 'Organization'));
            });
            if (authors.length > 0) fieldSources.authors = 'json-ld';
          }

          if (!pubDateStr && (obj.datePublished || obj.dateCreated)) {
            pubDateStr = obj.datePublished || obj.dateCreated;
            fieldSources.publicationDate = 'json-ld';
            const yrMatch = pubDateStr?.match(/(\d{4})/);
            if (yrMatch) {
              year = parseInt(yrMatch[1], 10);
              fieldSources.year = 'json-ld';
            }
          }

          if (!publisher && obj.publisher) {
            publisher = typeof obj.publisher === 'string' ? obj.publisher : (obj.publisher.name || undefined);
            if (publisher) fieldSources.publisher = 'json-ld';
          }

          const schemaType = (obj['@type'] || '').toLowerCase();
          if (schemaType.includes('scholarlyarticle') || schemaType.includes('medicalscholarlyarticle')) {
            itemType = 'journal';
          } else if (schemaType.includes('newsarticle') || schemaType.includes('report')) {
            itemType = 'newspaper';
          } else if (schemaType.includes('book')) {
            itemType = 'book';
          }
        }
      }
    }
  } catch {
    // ignore json-ld parsing error and continue to meta tags
  }

  // 2. citation_* Google Scholar Meta Tags
  const citTitle = getMeta(['citation_title']);
  if (!title && citTitle) {
    title = citTitle;
    fieldSources.title = 'citation-meta';
  }

  const citAuthors = getAllMeta('citation_author');
  if (authors.length === 0 && citAuthors.length > 0) {
    authors = citAuthors.map(a => parseAuthorName(a));
    fieldSources.authors = 'citation-meta';
  }

  const citDate = getMeta(['citation_publication_date', 'citation_date', 'citation_year']);
  if (!pubDateStr && citDate) {
    pubDateStr = citDate;
    fieldSources.publicationDate = 'citation-meta';
    const yrMatch = citDate.match(/(\d{4})/);
    if (yrMatch) {
      year = parseInt(yrMatch[1], 10);
      fieldSources.year = 'citation-meta';
    }
  }

  const citJournal = getMeta(['citation_journal_title', 'citation_journal_abbrev']);
  if (!journalName && citJournal) {
    journalName = citJournal;
    fieldSources.journalName = 'citation-meta';
    itemType = 'journal';
  }

  const citVol = getMeta(['citation_volume']);
  if (!volume && citVol) {
    volume = citVol;
    fieldSources.volume = 'citation-meta';
  }

  const citIssue = getMeta(['citation_issue']);
  if (!issue && citIssue) {
    issue = citIssue;
    fieldSources.issue = 'citation-meta';
  }

  const citFirstPage = getMeta(['citation_firstpage']);
  const citLastPage = getMeta(['citation_lastpage']);
  if (!pages && citFirstPage) {
    pages = citLastPage ? `${citFirstPage}-${citLastPage}` : citFirstPage;
    fieldSources.pages = 'citation-meta';
  }

  const citDoi = getMeta(['citation_doi']);
  if (!doi && citDoi) {
    doi = citDoi;
    fieldSources.doi = 'citation-meta';
  }

  const citPublisher = getMeta(['citation_publisher']);
  if (!publisher && citPublisher) {
    publisher = citPublisher;
    fieldSources.publisher = 'citation-meta';
  }

  // 3. Dublin Core (dc.*)
  if (!title) {
    const dcTitle = getMeta(['dc.title', 'DC.title', 'dcterms.title']);
    if (dcTitle) {
      title = dcTitle;
      fieldSources.title = 'dublin-core';
    }
  }

  if (authors.length === 0) {
    const dcCreators = getAllMeta('dc.creator');
    if (dcCreators.length > 0) {
      authors = dcCreators.map(a => parseAuthorName(a));
      fieldSources.authors = 'dublin-core';
    }
  }

  if (!pubDateStr) {
    const dcDate = getMeta(['dc.date', 'DC.date', 'dcterms.created', 'dcterms.issued']);
    if (dcDate) {
      pubDateStr = dcDate;
      fieldSources.publicationDate = 'dublin-core';
      const yrMatch = dcDate.match(/(\d{4})/);
      if (yrMatch) {
        year = parseInt(yrMatch[1], 10);
        fieldSources.year = 'dublin-core';
      }
    }
  }

  if (!doi) {
    const dcId = getMeta(['dc.identifier', 'DC.identifier']);
    if (dcId) {
      const extracted = extractDoi(dcId);
      if (extracted) {
        doi = extracted;
        fieldSources.doi = 'dublin-core';
      }
    }
  }

  // 4. OpenGraph (og:*)
  if (!title) {
    const ogTitle = getMeta(['og:title', 'twitter:title']);
    if (ogTitle) {
      title = ogTitle;
      fieldSources.title = 'opengraph';
    }
  }

  const ogSiteName = getMeta(['og:site_name', 'twitter:site']);
  if (ogSiteName) {
    siteName = ogSiteName;
    fieldSources.siteName = 'opengraph';
  }

  if (!pubDateStr) {
    const ogDate = getMeta(['article:published_time', 'article:modified_time']);
    if (ogDate) {
      pubDateStr = ogDate;
      fieldSources.publicationDate = 'opengraph';
      const yrMatch = ogDate.match(/(\d{4})/);
      if (yrMatch) {
        year = parseInt(yrMatch[1], 10);
        fieldSources.year = 'opengraph';
      }
    }
  }

  if (authors.length === 0) {
    const ogAuthor = getMeta(['article:author', 'twitter:creator', 'author']);
    if (ogAuthor) {
      authors = [parseAuthorName(ogAuthor)];
      fieldSources.authors = 'opengraph';
    }
  }

  // 5. HTML Fallbacks (<title>, headings)
  if (!title) {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/[\r\n\t]+/g, ' ').trim();
      // Remove trailing site name like "Title - Báo Tuổi Trẻ"
      if (title.includes(' - ')) {
        const parts = title.split(' - ');
        title = parts[0].trim();
        if (!siteName && parts[1]) siteName = parts[1].trim();
      } else if (title.includes(' | ')) {
        const parts = title.split(' | ');
        title = parts[0].trim();
        if (!siteName && parts[1]) siteName = parts[1].trim();
      }
      fieldSources.title = 'inferred';
    }
  }

  // Detect DOI from page text if not found yet
  if (!doi) {
    const extracted = extractDoi(html);
    if (extracted) {
      doi = extracted;
      fieldSources.doi = 'inferred';
    }
  }

  // Language detection
  const htmlLang = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
  if (htmlLang && htmlLang[1]) {
    const langCode = htmlLang[1].substring(0, 2).toLowerCase();
    if (['vi', 'en', 'fr', 'ru', 'zh', 'ja'].includes(langCode)) {
      language = langCode as any;
    }
  } else {
    // Simple heuristic: if title contains Vietnamese tones
    if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(title)) {
      language = 'vi';
    } else {
      language = 'en';
    }
  }

  const now = Date.now();
  const todayStr = new Date().toLocaleDateString('vi-VN');

  return {
    id: Math.random().toString(36).substring(2, 9),
    type: itemType,
    title: title || 'Tài liệu trực tuyến',
    authors,
    year,
    publicationDate: pubDateStr,
    journalName,
    volume,
    issue,
    pages,
    doi,
    publisher,
    siteName,
    url: targetUrl,
    accessDate: todayStr,
    language,
    fieldSources,
    createdAt: now,
    expiresAt: now + 15 * 60 * 1000
  };
}
