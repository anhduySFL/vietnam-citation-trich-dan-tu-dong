import type { CitationStyle } from '../types/citation';

import { BookOpen, Sparkles, FileText, Plus, HelpCircle, Download, RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentStyle: CitationStyle;
  onStyleChange: (style: CitationStyle) => void;
  onOpenAddModal: () => void;
  onOpenGuideModal: () => void;
  onResetData: () => void;
  onOpenExportModal: () => void;
  itemCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStyle,
  onStyleChange,
  onOpenAddModal,
  onOpenGuideModal,
  onResetData,
  onOpenExportModal,
  itemCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Vietnam Citation Studio</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  Chuẩn ĐH Huế & VNU
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Hệ thống chuẩn hóa & trích dẫn nghiên cứu khoa học chuyên nghiệp
              </p>
            </div>
          </div>

          {/* Style Selector Tabs */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onStyleChange('apa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentStyle === 'apa'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              APA (ĐH Huế)
            </button>
            <button
              onClick={() => onStyleChange('ieee')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentStyle === 'ieee'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              IEEE (ĐH Huế)
            </button>
            <button
              onClick={() => onStyleChange('vnu')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentStyle === 'vnu'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              VNU (ĐHQG Hà Nội)
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenGuideModal}
              title="Sổ tay quy tắc trích dẫn"
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center text-xs font-medium gap-1"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Quy chuẩn</span>
            </button>

            <button
              onClick={onResetData}
              title="Tải lại mẫu dữ liệu thực tế từ ĐH Huế & VNU"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenExportModal}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Xuất TLTK</span> ({itemCount})
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm TLTK</span>
            </button>
          </div>
        </div>

        {/* Mobile Style Selector */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-100">
          <button
            onClick={() => onStyleChange('apa')}
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              currentStyle === 'apa' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'
            }`}
          >
            APA (ĐH Huế)
          </button>
          <button
            onClick={() => onStyleChange('ieee')}
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              currentStyle === 'ieee' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'
            }`}
          >
            IEEE (ĐH Huế)
          </button>
          <button
            onClick={() => onStyleChange('vnu')}
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              currentStyle === 'vnu' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'
            }`}
          >
            VNU (ĐHQGHN)
          </button>
        </div>
      </div>
    </header>
  );
};
