import { useState } from 'react';
import type { CitationItem, CitationStyle } from '../types/citation';
import { formatCitation } from '../engines/styleRegistry';
import { Copy, Check, Quote, BookOpen, Sliders } from 'lucide-react';

interface CitationResultProps {
  item: CitationItem;
  style: CitationStyle;
  index?: number;
}

export const CitationResult: React.FC<CitationResultProps> = ({
  item,
  style,
  index = 1
}) => {
  const [isNarrative, setIsNarrative] = useState(false);
  const [pageNumbers, setPageNumbers] = useState('');
  const [copiedInText, setCopiedInText] = useState(false);
  const [copiedBib, setCopiedBib] = useState(false);

  const formatted = formatCitation(item, style, index, {
    isNarrative,
    pageNumbers: pageNumbers.trim() || undefined
  });

  const handleCopyInText = async () => {
    try {
      await navigator.clipboard.writeText(formatted.inText);
      setCopiedInText(true);
      setTimeout(() => setCopiedInText(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyBib = async () => {
    try {
      await navigator.clipboard.writeText(formatted.bibliographyPlainText);
      setCopiedBib(true);
      setTimeout(() => setCopiedBib(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="bg-white rounded-[10px] p-6 shadow-md border-2 border-[#3a8080] mb-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2 text-[#3a8080]">
          <BookOpen className="w-5 h-5 text-[#3a8080]" />
          <h3 className="font-bold text-base text-[#1b2835] tracking-wide uppercase">
            KẾT QUẢ TRÍCH DẪN ĐÃ TẠO
          </h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#dcfdc3] text-[#1b2835] font-bold border border-[#3a8080]/30">
          Quy cách: {style.toUpperCase()}
        </span>
      </div>

      <div className="space-y-5">
        {/* A. In-text citation */}
        <div className="bg-slate-50 p-4 rounded-[10px] border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="font-bold text-xs text-[#1b2835] flex items-center gap-1.5 uppercase">
              <Quote className="w-3.5 h-3.5 text-[#3a8080]" />
              A. Trích dẫn trong nội dung (In-text citation)
            </span>

            {/* Options */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNarrative}
                  onChange={e => setIsNarrative(e.target.checked)}
                  className="rounded text-[#3a8080]"
                />
                <span className="text-slate-700">Dạng dẫn dắt (Narrative)</span>
              </label>

              <div className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  value={pageNumbers}
                  onChange={e => setPageNumbers(e.target.value)}
                  placeholder="Trang (VD: tr. 97)"
                  className="px-2 py-0.5 border border-slate-300 rounded text-[11px] bg-white w-28 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleCopyInText}
                className="px-3 py-1 bg-[#3a8080] hover:bg-[#2b7a70] text-white rounded-[6px] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedInText ? <Check className="w-3.5 h-3.5 text-[#dcfdc3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInText ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-white rounded-[8px] border border-slate-200 font-mono text-sm text-[#1b2835] font-bold select-all">
            {formatted.inText}
          </div>
        </div>

        {/* B. Bibliography entry */}
        <div className="bg-slate-50 p-4 rounded-[10px] border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-[#1b2835] flex items-center gap-1.5 uppercase">
              <BookOpen className="w-3.5 h-3.5 text-[#3a8080]" />
              B. Danh mục tài liệu tham khảo (Bibliography entry)
            </span>

            <button
              type="button"
              onClick={handleCopyBib}
              className="px-3 py-1 bg-[#3a8080] hover:bg-[#2b7a70] text-white rounded-[6px] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              {copiedBib ? <Check className="w-3.5 h-3.5 text-[#dcfdc3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBib ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div 
            className="p-3 bg-white rounded-[8px] border border-slate-200 font-serif text-sm text-[#1b2835] leading-relaxed citation-hanging select-all"
            dangerouslySetInnerHTML={{ __html: formatted.bibliographyHtml }}
          />
        </div>
      </div>
    </div>
  );
};
