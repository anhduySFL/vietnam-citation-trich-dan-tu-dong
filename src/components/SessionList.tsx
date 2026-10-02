import { useState } from 'react';
import type { CitationItem, CitationStyle } from '../types/citation';
import { formatCitation } from '../engines/styleRegistry';
import { groupAndSortVnuBibliography } from '../engines/vnuHanoiEngine';
import { sortApaBibliography } from '../engines/apaEngine';
import { exportToBibTeX } from '../utils/bibtex';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Clock, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface SessionListProps {
  items: CitationItem[];
  style: CitationStyle;
  remainingTimeFormatted: string;
  onRemoveItem: (id: string) => void;
  onClearSession: () => void;
  onSelectItemForEdit?: (item: CitationItem) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  items,
  style,
  remainingTimeFormatted,
  onRemoveItem,
  onClearSession,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);

  if (items.length === 0) return null;

  // Generate full references formatted
  let formattedEntries: { id: string; html: string; plain: string; section?: string }[] = [];

  if (style === 'vnu') {
    const groups = groupAndSortVnuBibliography(items);
    groups.forEach(g => {
      g.items.forEach(it => {
        const res = formatCitation(it, 'vnu');
        formattedEntries.push({
          id: it.id,
          html: res.bibliographyHtml,
          plain: res.bibliographyPlainText,
          section: g.label
        });
      });
    });
  } else if (style === 'apa') {
    const sorted = sortApaBibliography(items);
    formattedEntries = sorted.map(it => {
      const res = formatCitation(it, 'apa');
      return {
        id: it.id,
        html: res.bibliographyHtml,
        plain: res.bibliographyPlainText
      };
    });
  } else {
    // IEEE or VNUA: order by appearance
    formattedEntries = items.map((it, idx) => {
      const res = formatCitation(it, style, idx + 1);
      return {
        id: it.id,
        html: res.bibliographyHtml,
        plain: res.bibliographyPlainText
      };
    });
  }

  const getFullPlainText = () => {
    let currentSection = '';
    const lines: string[] = [];

    formattedEntries.forEach(entry => {
      if (entry.section && entry.section !== currentSection) {
        currentSection = entry.section;
        lines.push(`\n=== ${currentSection} ===\n`);
      }
      lines.push(entry.plain);
    });

    return lines.join('\n\n');
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(getFullPlainText());
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadTxt = () => {
    const text = getFullPlainText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Danh_muc_TLTK_${style.toUpperCase()}_tam_thoi.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>DANH MỤC TÀI LIỆU THAM KHẢO</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; }
        .section-title { font-weight: bold; margin-top: 18pt; margin-bottom: 8pt; text-transform: uppercase; }
        .ref-item { margin-bottom: 8pt; text-align: justify; text-indent: -1.5cm; padding-left: 1.5cm; }
      </style>
      </head>
      <body>
        <h2 style="text-align: center; text-transform: uppercase;">DANH MỤC TÀI LIỆU THAM KHẢO</h2>
        <p style="text-align: center; font-style: italic;">(Quy cách: ${style.toUpperCase()})</p>
        ${formattedEntries.map(e => `
          ${e.section ? `<div class="section-title">${e.section}</div>` : ''}
          <div class="ref-item">${e.html}</div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Danh_muc_TLTK_${style.toUpperCase()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBib = () => {
    const bib = exportToBibTeX(items);
    const blob = new Blob([bib], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `references.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-[10px] p-6 shadow-md border-2 border-[#3a8080]/60 mb-12">
      {/* Session Header & Countdown */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-base text-[#1b2835] uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#3a8080]" />
            DANH MỤC CỦA PHIÊN HIỆN TẠI ({items.length} tài liệu)
          </h3>
          <p className="text-xs text-slate-500">
            Dữ liệu chỉ tồn tại tạm thời trong bộ nhớ và không được lưu trữ vào bất kỳ cơ sở dữ liệu nào.
          </p>
        </div>

        {/* 15-min TTL Warning Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
          <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Thời gian tồn tại còn lại: </span>
          <span className="font-mono font-bold text-sm text-rose-600">{remainingTimeFormatted}</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-3 bg-[#dcfdc3]/20 px-3 rounded-[8px] my-4 border border-[#dcfdc3]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAll}
            className="px-3 py-1.5 bg-[#3a8080] hover:bg-[#2b7a70] text-white rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-[#dcfdc3]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Đã sao chép tất cả' : 'Sao chép toàn bộ danh mục'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadWord}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#1b2835] border border-slate-300 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#3a8080]" />
            <span>Xuất file Word (.doc)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#1b2835] border border-slate-300 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Tải .TXT</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadBib}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#1b2835] border border-slate-300 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tải .BIB (BibTeX)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh mục trong phiên này?')) {
              onClearSession();
            }
          }}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 px-2 py-1 hover:bg-rose-50 rounded cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Hủy phiên / Xóa tất cả</span>
        </button>
      </div>

      {/* List of items in current session */}
      <div className="space-y-3 font-serif text-slate-900 text-sm leading-relaxed pt-2">
        {formattedEntries.map((entry, idx) => (
          <div 
            key={entry.id || idx}
            className="group flex items-start justify-between gap-3 p-3 rounded-[8px] bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 transition-colors"
          >
            <div className="flex-1 citation-hanging">
              {entry.section && (
                <div className="font-bold text-xs font-sans text-[#3a8080] uppercase tracking-wider mb-1">
                  {entry.section}
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: entry.html }} />
            </div>

            <button
              type="button"
              onClick={() => onRemoveItem(entry.id)}
              className="p-1 text-slate-400 hover:text-rose-600 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
              title="Xóa tài liệu này khỏi phiên"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          Lưu ý: Dữ liệu không được lưu trữ vĩnh viễn. Khi hết hạn phiên hoặc tải lại trang, danh mục sẽ được tự động xóa sạch để bảo vệ quyền riêng tư.
        </span>
      </div>
    </div>
  );
};
