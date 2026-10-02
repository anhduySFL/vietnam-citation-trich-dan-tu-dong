import { useState } from 'react';
import { Search, Loader2, Edit3, AlertCircle, Link as LinkIcon, BookOpen } from 'lucide-react';

interface UrlDoiInputProps {
  onAnalyze: (input: string) => Promise<void>;
  onManualInput: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

export const UrlDoiInput: React.FC<UrlDoiInputProps> = ({
  onAnalyze,
  onManualInput,
  isLoading,
  errorMessage,
  onClearError,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onClearError();
    onAnalyze(inputValue.trim());
  };

  return (
    <div className="bg-white rounded-[10px] p-6 sm:p-8 shadow-sm border-2 border-[#3a8080]/30 hover:border-[#3a8080] transition-colors mb-6">
      <div className="flex items-center space-x-2 text-[#3a8080] mb-2 font-bold text-sm tracking-wide uppercase">
        <LinkIcon className="w-4 h-4" />
        <span>Nhập nguồn tài liệu trực tuyến (URL hoặc DOI)</span>
      </div>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        Hỗ trợ URL bài báo khoa học, báo điện tử, trang web cơ quan/tổ chức hoặc mã định danh DOI (ví dụ: <code>10.1016/j.ijedudev.2007.08.001</code>).
        Hệ thống sẽ tự động bóc tách siêu dữ liệu để tạo trích dẫn chính xác.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value);
                if (errorMessage) onClearError();
              }}
              placeholder="Dán link bài viết (https://...) hoặc mã DOI (10.xxxx/...)"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-[10px] border border-slate-300 text-sm focus:ring-2 focus:ring-[#3a8080] focus:border-[#3a8080] focus:outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed bg-slate-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 rounded-[10px] bg-[#3a8080] hover:bg-[#2b7a70] text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#dcfdc3]" />
                <span>Đang phân tích tài liệu...</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 text-[#dcfdc3]" />
                <span>Phân tích tài liệu</span>
              </>
            )}
          </button>
        </div>

        {/* Option to manually enter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <span className="text-slate-500">
            Không có liên kết mạng hoặc tài liệu dạng in giấy?
          </span>
          <button
            type="button"
            onClick={onManualInput}
            className="text-[#3a8080] hover:text-[#1b2835] font-bold inline-flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Nhập thông tin thủ công</span>
          </button>
        </div>
      </form>

      {/* Error notification */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-[10px] bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-900 mb-1">{errorMessage}</p>
              <p className="text-rose-700">
                Bạn vẫn có thể hoàn thành trích dẫn bằng cách điền trực tiếp thông tin vào biểu mẫu thủ công.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onManualInput}
            className="px-3 py-1.5 rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white font-semibold shrink-0 cursor-pointer transition-colors shadow-xs"
          >
            Nhập thủ công ngay
          </button>
        </div>
      )}
    </div>
  );
};
