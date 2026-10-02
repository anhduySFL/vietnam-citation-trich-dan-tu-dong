import { useState } from 'react';
import type { CitationStyle } from '../types/citation';
import { BookOpen, ExternalLink, ChevronDown, Clock, HelpCircle, Layers } from 'lucide-react';

interface NavbarProps {
  onGoHome: () => void;
  onOpenAbout: () => void;
  onSelectGuideStyle: (style: CitationStyle) => void;
  remainingTimeFormatted?: string;
  hasActiveSession?: boolean;
  currentView: 'generator' | 'guide';
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onOpenAbout,
  onSelectGuideStyle,
  remainingTimeFormatted,
  hasActiveSession,
  currentView
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#1b2835] text-white shadow-md border-b-2 border-[#3a8080]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO & NAME */}
          <div 
            onClick={onGoHome}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-[10px] bg-[#3a8080] flex items-center justify-center text-[#dcfdc3] shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-[#dcfdc3] tracking-wider uppercase font-sans">
                TRÍCH DẪN TỰ ĐỘNG
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Chuẩn APA • IEEE • VNU (Hanoi) • VNUA
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2 sm:space-x-5 text-sm font-semibold">
            {/* Trang chủ */}
            <button
              onClick={onGoHome}
              className={`px-3 py-1.5 rounded-[8px] transition-colors ${
                currentView === 'generator'
                  ? 'bg-[#3a8080] text-white'
                  : 'text-slate-200 hover:text-[#dcfdc3]'
              }`}
            >
              Trang chủ
            </button>

            {/* Giới thiệu */}
            <button
              onClick={onOpenAbout}
              className="px-3 py-1.5 rounded-[8px] text-slate-200 hover:text-[#dcfdc3] transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4 text-[#dcfdc3]" />
              <span>Giới thiệu</span>
            </button>

            {/* Tri Vân (Hệ sinh thái ngoài) */}
            <a
              href="https://tailieutrivan.id.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-[8px] text-slate-200 hover:text-[#dcfdc3] transition-colors flex items-center gap-1 bg-[#3a8080]/30 hover:bg-[#3a8080]/60 border border-[#3a8080]"
              title="Chuyển sang website Tri Vân: tailieutrivan.id.vn"
            >
              <span>Tri Vân</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#dcfdc3]" />
            </a>

            {/* Danh mục (Quy cách trích dẫn dropdown) */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className={`px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-1.5 ${
                  currentView === 'guide'
                    ? 'bg-[#3a8080] text-white'
                    : 'bg-[#3a8080]/40 text-[#dcfdc3] hover:bg-[#3a8080]/70'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Danh mục quy cách</span>
                <span className="sm:hidden">Quy cách</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-[10px] shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Tra cứu quy chuẩn
                  </div>
                  <button
                    onClick={() => {
                      onSelectGuideStyle('apa');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-[#dcfdc3]/40 hover:text-[#1b2835] font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>1. Chuẩn APA</span>
                    <span className="text-[10px] text-slate-400">Tác giả - Năm</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectGuideStyle('ieee');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-[#dcfdc3]/40 hover:text-[#1b2835] font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>2. Chuẩn IEEE</span>
                    <span className="text-[10px] text-slate-400">Số thứ tự [1]</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectGuideStyle('vnu');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-[#dcfdc3]/40 hover:text-[#1b2835] font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>3. VNU (Hanoi)</span>
                    <span className="text-[10px] text-slate-400">Bộ GD&ĐT / ĐHQG</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectGuideStyle('vnua');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-[#dcfdc3]/40 hover:text-[#1b2835] font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>4. VNUA</span>
                    <span className="text-[10px] text-slate-400">QĐ 491/QĐ-HVN</span>
                  </button>
                </div>
              )}
            </div>

            {/* Session Timer indicator (15 min) */}
            {hasActiveSession && (
              <div 
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#dcfdc3] text-[#1b2835] rounded-[8px] font-mono text-xs font-bold shadow-xs border border-[#3a8080]"
                title="Dữ liệu tạm thời của phiên này sẽ tự hủy khi bộ đếm về 00:00"
              >
                <Clock className="w-3.5 h-3.5 text-[#3a8080] animate-pulse" />
                <span>Hết hạn: {remainingTimeFormatted}</span>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
