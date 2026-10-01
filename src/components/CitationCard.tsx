import { useState } from 'react';
import type { CitationItem, CitationStyle } from '../types/citation';

import { formatApaBibItem, formatApaInText } from '../engines/apaEngine';
import { formatIeeeBibItem } from '../engines/ieeeEngine';
import { formatVnuBibItem, formatVnuInText } from '../engines/vnuEngine';
import { Copy, Check, Edit2, Trash2, ExternalLink, Quote, Tag } from 'lucide-react';

interface CitationCardProps {
  item: CitationItem;
  style: CitationStyle;
  index: number;
  onEdit: (item: CitationItem) => void;
  onDelete: (id: string) => void;
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  book: { label: 'Sách', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  book_chapter: { label: 'Chương sách', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  journal: { label: 'Bài báo tạp chí', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  conference: { label: 'Kỷ yếu hội thảo', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  newspaper: { label: 'Báo chí', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  thesis: { label: 'Luận văn / Luận án', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  webpage: { label: 'Tài liệu Internet', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  legal: { label: 'Văn bản pháp luật', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  manuscript: { label: 'Bản thảo chưa in', color: 'bg-slate-100 text-slate-700 border-slate-300' },
};

const LANG_CONFIG: Record<string, string> = {
  vi: '🇻🇳 Tiếng Việt',
  en: '🇬🇧 Tiếng Anh',
  zh: '🇨🇳 Tiếng Trung',
  ru: '🇷🇺 Tiếng Nga',
  fr: '🇫🇷 Tiếng Pháp',
  ja: '🇯🇵 Tiếng Nhật',
  other: '🌐 Ngôn ngữ khác',
};

export const CitationCard: React.FC<CitationCardProps> = ({
  item,
  style,
  index,
  onEdit,
  onDelete,
}) => {
  const [copiedBib, setCopiedBib] = useState(false);
  const [copiedInText, setCopiedInText] = useState(false);

  // Compute formatted Bibliography
  let formattedBib = { html: '', plainText: '' };
  let formattedInText = '';

  if (style === 'apa') {
    formattedBib = formatApaBibItem(item);
    formattedInText = formatApaInText(item);
  } else if (style === 'ieee') {
    formattedBib = formatIeeeBibItem(item, index);
    formattedInText = `[${index}]`;
  } else {
    // VNU
    formattedBib = formatVnuBibItem(item);
    formattedInText = formatVnuInText(item);
  }

  const handleCopyBib = async () => {
    try {
      await navigator.clipboard.writeText(formattedBib.plainText);
      setCopiedBib(true);
      setTimeout(() => setCopiedBib(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyInText = async () => {
    try {
      await navigator.clipboard.writeText(formattedInText);
      setCopiedInText(true);
      setTimeout(() => setCopiedInText(false), 2000);
    } catch {
      // fallback
    }
  };

  const typeInfo = TYPE_CONFIG[item.type] || { label: item.type, color: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all p-5">
      {/* Header tags & Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Index tag if IEEE or general */}
          {style === 'ieee' && (
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-indigo-600 text-white rounded-md">
              [{index}]
            </span>
          )}

          {/* Type Badge */}
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${typeInfo.color}`}>
            <Tag className="w-3 h-3 mr-1 opacity-70" />
            {typeInfo.label}
          </span>

          {/* Language Badge */}
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
            {LANG_CONFIG[item.language] || item.language}
          </span>

          {/* Authors Count */}
          <span className="text-xs text-slate-500">
            {item.authors.length} tác giả {item.authors.some(a => a.isVietnamese) ? '(tác giả Việt)' : ''}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopyInText}
            title="Sao chép trích dẫn trong văn bản (In-text)"
            className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-1 border border-slate-200"
          >
            <Quote className="w-3 h-3" />
            <span>{copiedInText ? 'Đã chép' : formattedInText}</span>
          </button>

          <button
            onClick={handleCopyBib}
            title="Sao chép danh mục tham khảo"
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            {copiedBib ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onEdit(item)}
            title="Chỉnh sửa thông tin"
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            title="Xóa tài liệu"
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Formatted Bibliography Text */}
      <div className="text-sm text-slate-800 leading-relaxed font-serif pt-1 pb-2">
        <div 
          className="citation-content"
          dangerouslySetInnerHTML={{ __html: formattedBib.html }} 
        />
      </div>

      {/* Extra Metadata Badges (DOI, URL, Pages) */}
      <div className="flex flex-wrap items-center gap-3 pt-2 mt-2 border-t border-slate-100 text-xs text-slate-500 font-sans">
        {item.doi && (
          <a
            href={`https://doi.org/${item.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-indigo-600 hover:underline gap-1"
          >
            <span>DOI: {item.doi}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-slate-600 hover:text-indigo-600 hover:underline gap-1 max-w-xs truncate"
          >
            <span>Link nguồn</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {item.pages && (
          <span className="text-slate-500">
            Trang: {item.pages}
          </span>
        )}

        {item.totalPageCount && (
          <span className="text-slate-500">
            Độ dài: {item.totalPageCount}
          </span>
        )}

        {item.publisher && (
          <span className="text-slate-500">
            NXB: {item.publisher} {item.place ? `(${item.place})` : ''}
          </span>
        )}
      </div>
    </div>
  );
};
