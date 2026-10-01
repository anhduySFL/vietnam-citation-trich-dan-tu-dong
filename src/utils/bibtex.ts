import type { CitationItem } from '../types/citation';

export function exportToBibTeX(items: CitationItem[]): string {
  return items.map(item => {
    let entryType = 'misc';
    switch (item.type) {
      case 'book': entryType = 'book'; break;
      case 'journal': entryType = 'article'; break;
      case 'book_chapter': entryType = 'incollection'; break;
      case 'conference': entryType = 'inproceedings'; break;
      case 'thesis': entryType = 'phdthesis'; break;
      case 'newspaper': entryType = 'article'; break;
      case 'webpage': entryType = 'online'; break;
      case 'legal': entryType = 'misc'; break;
      case 'manuscript': entryType = 'unpublished'; break;
    }

    const citationKey = item.authors[0] 
      ? `${item.authors[0].isVietnamese ? item.authors[0].given : item.authors[0].family}${item.year || ''}`.replace(/\s+/g, '')
      : `ref_${item.id}`;

    const authorNames = item.authors.map(a => a.rawName).join(' and ');
    const fields: string[] = [
      `  title = {${item.title}}`,
      authorNames ? `  author = {${authorNames}}` : '',
      item.year ? `  year = {${item.year}}` : '',
      item.publisher ? `  publisher = {${item.publisher}}` : '',
      item.place ? `  address = {${item.place}}` : '',
      item.journalName ? `  journal = {${item.journalName}}` : '',
      item.volume ? `  volume = {${item.volume}}` : '',
      item.issue ? `  number = {${item.issue}}` : '',
      item.pages ? `  pages = {${item.pages}}` : '',
      item.doi ? `  doi = {${item.doi}}` : '',
      item.bookTitle ? `  booktitle = {${item.bookTitle}}` : '',
      item.institution ? `  school = {${item.institution}}` : '',
      item.url ? `  url = {${item.url}}` : '',
      item.accessDate ? `  urldate = {${item.accessDate}}` : '',
    ].filter(Boolean);

    return `@${entryType}{${citationKey},\n${fields.join(',\n')}\n}`;
  }).join('\n\n');
}
