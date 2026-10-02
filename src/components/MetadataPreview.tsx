import React from 'react';
import type { CitationItem } from '../types/citation';
import { CheckCircle2, Edit2, ArrowRight, Tag, User, Calendar, ExternalLink } from 'lucide-react';

interface MetadataPreviewProps {
  item: CitationItem;
  onEdit: () => void;
  onConfirm: () => void;
  onDiscard: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  journal: 'Bài báo khoa học',
  journal_online: 'Bài báo khoa học xuất bản online',
  book: 'Sách in',
  book_print: 'Sách in',
  book_ebook: 'Sách E-Book',
  book_database: 'Sách từ cơ sở dữ liệu',
  book_chapter: 'Chương trong sách',
  thesis: 'Luận văn / Luận án',
  conference: 'Kỷ yếu / Báo cáo hội thảo',
  proceedings: 'Tuyển tập / Kỷ yếu',
  conference_presentation: 'Tài liệu trình bày hội nghị',
  newspaper: 'Bài trên báo chí',
  webpage: 'Tài liệu trực tuyến',
  org_document: 'Tài liệu do cơ quan/tổ chức ban hành',
  org_online: 'Tài liệu trực tuyến của cơ quan/tổ chức'
};

export const MetadataPreview: React.FC<MetadataPreviewProps> = ({
  item,
  onEdit,
  onConfirm,
  onDiscard
}) => {
  const authorNames = item.authors.map(a => a.rawName).join(', ') || 'Chưa xác định tác giả';

  return (
    <div className="bg-white rounded-[10px] p-6 shadow-md border-2 border-[#3a8080] mb-8 animate-in fade-in slide-in-from-top-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2 text-[#3a8080]">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-[#1b2835] tracking-wide uppercase">
            THÔNG TIN ĐÃ NHẬN DIỆN TỪ LIÊN KẾT
          </h3>
        </div>
        <button
          onClick={onDiscard}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Hủy bỏ tài liệu này
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        Vui lòng kiểm tra lại các trường thông tin bên dưới trước khi áp dụng quy cách trích dẫn. Bạn có toàn quyền sửa đổi nếu hệ thống nhận diện chưa đầy đủ.
      </p>

      {/* Grid of identified attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs bg-[#dcfdc3]/20 p-4 rounded-[10px] border border-[#dcfdc3] mb-6">
        {/* Document Type */}
        <div>
          <span className="text-slate-500 font-semibold block mb-0.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#3a8080]" />
            Loại tài liệu:
          </span>
          <span className="font-bold text-[#1b2835] px-2 py-0.5 rounded bg-white border border-[#3a8080]/30 inline-block">
            {TYPE_LABELS[item.type] || item.type}
          </span>
        </div>

        {/* Authors */}
        <div className="md:col-span-2">
          <span className="text-slate-500 font-semibold block mb-0.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#3a8080]" />
            Tác giả:
          </span>
          <span className="font-bold text-[#1b2835]">
            {authorNames}
          </span>
        </div>

        {/* Title */}
        <div className="md:col-span-3">
          <span className="text-slate-500 font-semibold block mb-0.5">Tên tài liệu / Tiêu đề:</span>
          <p className="font-bold text-sm text-[#1b2835] font-serif leading-snug">
            {item.title}
          </p>
        </div>

        {/* Year */}
        <div>
          <span className="text-slate-500 font-semibold block mb-0.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#3a8080]" />
            Năm xuất bản:
          </span>
          <span className="font-bold text-[#1b2835]">
            {item.year || (item.publicationDate ? item.publicationDate : 'Chưa rõ')}
          </span>
        </div>

        {/* Journal / Publisher / Website */}
        <div>
          <span className="text-slate-500 font-semibold block mb-0.5">Tạp chí / NXB / Website:</span>
          <span className="font-bold text-[#1b2835]">
            {item.journalName || item.publisher || item.siteName || 'Chưa rõ'}
          </span>
        </div>

        {/* Volume & Issue */}
        <div>
          <span className="text-slate-500 font-semibold block mb-0.5">Tập / Số:</span>
          <span className="font-bold text-[#1b2835]">
            {item.volume ? `Tập ${item.volume}` : ''} {item.issue ? `(Số ${item.issue})` : ''}
            {!item.volume && !item.issue && 'Không có'}
          </span>
        </div>

        {/* Pages */}
        <div>
          <span className="text-slate-500 font-semibold block mb-0.5">Trang:</span>
          <span className="font-bold text-[#1b2835]">{item.pages || 'Không có'}</span>
        </div>

        {/* DOI */}
        {item.doi && (
          <div className="md:col-span-2">
            <span className="text-slate-500 font-semibold block mb-0.5">Mã DOI:</span>
            <span className="font-mono text-[11px] text-[#3a8080] font-bold">
              {item.doi}
            </span>
          </div>
        )}

        {/* URL */}
        {item.url && (
          <div className="md:col-span-3 truncate">
            <span className="text-slate-500 font-semibold block mb-0.5">Đường dẫn gốc:</span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3a8080] hover:underline text-[11px] truncate flex items-center gap-1"
            >
              <span className="truncate">{item.url}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2.5 rounded-[10px] border border-[#3a8080] text-[#3a8080] hover:bg-[#3a8080]/10 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Chỉnh sửa thông tin</span>
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="px-6 py-2.5 rounded-[10px] bg-[#3a8080] hover:bg-[#2b7a70] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#3a8080]/20 transition-all active:scale-95 cursor-pointer"
        >
          <span>Tạo trích dẫn tài liệu này</span>
          <ArrowRight className="w-4 h-4 text-[#dcfdc3]" />
        </button>
      </div>
    </div>
  );
};
