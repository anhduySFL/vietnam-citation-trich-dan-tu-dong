import { useState } from 'react';
import type { CitationItem, CitationStyle } from '../types/citation';
import { formatApaInText } from '../engines/apaEngine';
import { collapseIeeeNumbers } from '../engines/ieeeEngine';
import { formatVnuInText } from '../engines/vnuEngine';
import { Copy, Check, Quote, Sliders, CheckSquare, Square } from 'lucide-react';

interface InTextGeneratorProps {
  items: CitationItem[];
  style: CitationStyle;
  itemIndexMap: Map<string, number>; // For IEEE numbering [1], [2]...
}

export const InTextGenerator: React.FC<InTextGeneratorProps> = ({
  items,
  style,
  itemIndexMap,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    items.length > 0 ? [items[1]?.id || items[0]?.id] : []
  );
  const [isNarrative, setIsNarrative] = useState(false);
  const [pageNumber, setPageNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [customLeadIn, setCustomLeadIn] = useState('Kết quả này');


  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(items.map(i => i.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  const selectedItems = items.filter(i => selectedIds.includes(i.id));

  // Generate In-Text Citation result
  const generateInText = (): string => {
    if (selectedItems.length === 0) return '(Chưa chọn tài liệu)';

    if (style === 'ieee') {
      const numbers = selectedItems.map(item => itemIndexMap.get(item.id) || 1);
      const collapsed = collapseIeeeNumbers(numbers, pageNumber ? (pageNumber.startsWith('tr.') ? pageNumber : `tr. ${pageNumber}`) : undefined);
      
      if (isNarrative) {
        const firstAuthor = selectedItems[0].authors[0];
        const authorName = firstAuthor 
          ? (firstAuthor.isVietnamese ? firstAuthor.given : firstAuthor.family)
          : 'các tác giả';
        return `Theo ${authorName} ${collapsed}`;
      }
      return collapsed;
    }

    if (style === 'apa') {
      if (selectedItems.length === 1) {
        const item = selectedItems[0];
        const pageArg = pageNumber ? (pageNumber.startsWith('tr.') || pageNumber.startsWith('pp.') ? pageNumber : `tr. ${pageNumber}`) : undefined;
        return formatApaInText(item, isNarrative, pageArg);
      } else {
        // Multiple sources: sort chronologically per APA guideline
        const sorted = [...selectedItems].sort((a, b) => {
          const yA = typeof a.year === 'number' ? a.year : parseInt(`${a.year}`) || 0;
          const yB = typeof b.year === 'number' ? b.year : parseInt(`${b.year}`) || 0;
          return yA - yB;
        });

        if (isNarrative) {
          return sorted.map(item => formatApaInText(item, true)).join('; ');
        } else {
          // Parenthetical: (Smith, 1959; Thomson & Jones, 1982; Green, 1990)
          const inners = sorted.map(item => {
            const raw = formatApaInText(item, false);
            return raw.replace(/^\(|\)$/g, '');
          });
          return `(${inners.join('; ')})`;
        }
      }
    }

    if (style === 'vnu') {
      // VNU Style: numeric [5, 21, 49] or author-year [Nguyễn Văn A, 1986]
      if (selectedItems.length === 1) {
        const item = selectedItems[0];
        const pageArg = pageNumber ? (pageNumber.startsWith('tr.') || pageNumber.startsWith('pp.') ? pageNumber : `tr. ${pageNumber}`) : undefined;
        return formatVnuInText(item, isNarrative, pageArg);
      } else {
        if (isNarrative) {
          return selectedItems.map(item => formatVnuInText(item, true)).join(' và ');
        } else {
          const inners = selectedItems.map(item => {
            const raw = formatVnuInText(item, false);
            return raw.replace(/^\[|\]$/g, '');
          });
          return `[${inners.join('; ')}]`;
        }
      }
    }

    return '';
  };

  const citationResult = generateInText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citationResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Bộ Tạo Trích Dẫn Trong Thân Bài (In-Text Citation Generator)
            </h3>
            <p className="text-xs text-slate-500">
              Mô phỏng trích dẫn trực tiếp, gộp dải số IEEE [2–5], và sắp xếp thời gian APA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 bg-indigo-50/50 rounded"
          >
            Chọn tất cả
          </button>
          <button
            onClick={clearAll}
            className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2 py-1 bg-slate-100 rounded"
          >
            Bỏ chọn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Left column: Selection of references */}
        <div className="lg:col-span-5 border border-slate-200 rounded-xl p-3 bg-slate-50/50 max-h-64 overflow-y-auto space-y-1.5">
          <div className="text-xs font-semibold text-slate-500 mb-2 px-1">
            Chọn tài liệu cần trích dẫn ({selectedIds.length}/{items.length}):
          </div>
          {items.map(item => {
            const isChecked = selectedIds.includes(item.id);
            const index = itemIndexMap.get(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                  isChecked
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-900'
                    : 'bg-white border border-slate-200/80 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="mt-0.5 text-indigo-600">
                  {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                </div>
                <div className="flex-1 truncate">
                  <div className="font-semibold truncate">
                    {style === 'ieee' && `[${index}] `}
                    {item.authors[0]?.rawName || item.title} ({item.year || 'k.n.'})
                  </div>
                  <div className="text-slate-500 truncate text-[11px]">{item.title}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Options & Generated Preview */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                Kiểu trích dẫn
              </label>
              <div className="flex items-center gap-3 mt-1.5">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="narrative_mode"
                    checked={!isNarrative}
                    onChange={() => setIsNarrative(false)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-1.5 text-slate-700">Trong ngoặc đơn (Mặc định)</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="narrative_mode"
                    checked={isNarrative}
                    onChange={() => setIsNarrative(true)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-1.5 text-slate-700">Dẫn dắt (Narrative)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Số trang (Trích trực tiếp nguyên văn)
              </label>
              <input
                type="text"
                value={pageNumber}
                onChange={e => setPageNumber(e.target.value)}
                placeholder="Ví dụ: tr. 97-98 hoặc pp. 12-14"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Generated Result Box */}
          <div className="bg-indigo-950 text-white rounded-xl p-4 shadow-inner">
            <div className="flex items-center justify-between text-xs text-indigo-300 mb-1.5">
              <span>KẾT QUẢ ĐỊNH DẠNG THEO CHUẨN {style.toUpperCase()}</span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-indigo-800 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
            <div className="font-mono text-base text-emerald-300 font-bold py-1 select-all">
              {citationResult}
            </div>

            {/* In a mock sentence */}
            <div className="mt-3 pt-3 border-t border-indigo-900/60 text-xs text-indigo-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400">Ví dụ lồng ghép trong văn bản:</span>
                <input
                  type="text"
                  value={customLeadIn}
                  onChange={e => setCustomLeadIn(e.target.value)}
                  placeholder="Tiền tố câu ví dụ..."
                  className="px-2 py-0.5 bg-indigo-900 border border-indigo-700 rounded text-[11px] text-white focus:outline-none"
                />
              </div>
              <p className="mt-1 text-slate-200 italic font-serif">
                "{customLeadIn} đã được công bố rộng rãi trong giới học thuật {citationResult}."
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
