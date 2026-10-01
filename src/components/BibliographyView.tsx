import { useState } from 'react';
import type { CitationItem, CitationStyle } from '../types/citation';

import { formatApaBibItem, sortApaBibliography } from '../engines/apaEngine';
import { formatIeeeBibItem } from '../engines/ieeeEngine';
import { formatVnuBibItem, groupAndSortVnuBibliography } from '../engines/vnuEngine';
import { exportToBibTeX } from '../utils/bibtex';
import { Copy, Check, Download, Printer, FileText } from 'lucide-react';

interface BibliographyViewProps {
  items: CitationItem[];
  style: CitationStyle;
  itemIndexMap: Map<string, number>;
}

export const BibliographyView: React.FC<BibliographyViewProps> = ({
  items,
  style,
  itemIndexMap,
}) => {
  const [copied, setCopied] = useState(false);

  // Compute references based on active style
  let renderContent: { title?: string; list: { item: CitationItem; html: string; plain: string; index?: number }[] }[] = [];

  if (style === 'apa') {
    const sorted = sortApaBibliography(items);
    renderContent = [{
      list: sorted.map(item => {
        const res = formatApaBibItem(item);
        return { item, html: res.html, plain: res.plainText };
      })
    }];
  } else if (style === 'ieee') {
    renderContent = [{
      list: items.map(item => {
        const idx = itemIndexMap.get(item.id) || 1;
        const res = formatIeeeBibItem(item, idx);
        return { item, html: res.html, plain: res.plainText, index: idx };
      })
    }];
  } else {
    // VNU: group by language
    const groups = groupAndSortVnuBibliography(items);
    renderContent = groups.map(g => ({
      title: g.label,
      list: g.items.map(item => {
        const res = formatVnuBibItem(item);
        return { item, html: res.html, plain: res.plainText };
      })
    }));
  }

  // Get full plain text
  const getFullPlainText = (): string => {
    return renderContent.map(section => {
      const header = section.title ? `${section.title}\n\n` : '';
      const body = section.list.map(entry => entry.plain).join('\n\n');
      return `${header}${body}`;
    }).join('\n\n---\n\n');
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(getFullPlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
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
        <p style="text-align: center; font-style: italic;">(Định dạng theo chuẩn ${style.toUpperCase()})</p>
        ${renderContent.map(sec => `
          ${sec.title ? `<div class="section-title">${sec.title}</div>` : ''}
          ${sec.list.map(l => `<div class="ref-item">${l.html}</div>`).join('')}
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tai_lieu_tham_khao_${style.toUpperCase()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBibTeX = () => {
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 no-print">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Danh Mục Tài Liệu Tham Khảo Hoàn Chỉnh
          </h3>
          <p className="text-xs text-slate-500">
            {style === 'apa' && 'Sắp xếp tự động theo thứ tự A-Z họ/tên tác giả theo chuẩn APA (ĐH Huế)'}
            {style === 'ieee' && 'Sắp xếp theo thứ tự số tăng dần theo chuẩn IEEE (ĐH Huế)'}
            {style === 'vnu' && 'Tự động phân chia nhóm ngôn ngữ (Việt, Anh,...) và xếp thứ tự A-Z theo chuẩn VNU / Bộ GD&ĐT'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép tất cả' : 'Sao chép toàn bộ'}</span>
          </button>

          <button
            onClick={handleDownloadWord}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất sang Word (.doc)</span>
          </button>

          <button
            onClick={handleDownloadBibTeX}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải .bib (BibTeX)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="In trang"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formatted Reference List View */}
      <div className="mt-6 bg-slate-50/50 p-6 rounded-xl border border-slate-200/80 font-serif text-slate-900 text-[15px] leading-relaxed select-text">
        <h4 className="text-center font-bold text-base uppercase tracking-wider mb-6 text-slate-900 font-sans">
          TÀI LIỆU THAM KHẢO
        </h4>

        {renderContent.map((section, secIdx) => (
          <div key={secIdx} className="mb-6 last:mb-0">
            {section.title && (
              <h5 className="font-bold text-sm text-indigo-900 uppercase tracking-wide mt-4 mb-3 border-b border-indigo-100 pb-1 font-sans">
                {section.title}
              </h5>
            )}

            <div className="space-y-3.5">
              {section.list.map((entry, idx) => (
                <div
                  key={entry.item.id || idx}
                  className={style === 'vnu' ? 'citation-hanging-vnu text-justify' : 'citation-hanging text-justify'}
                  dangerouslySetInnerHTML={{ __html: entry.html }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
