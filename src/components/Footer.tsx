import React from 'react';
import { BookOpen, Mail, ShieldCheck, Settings, ExternalLink } from 'lucide-react';

interface FooterProps {
  onGoHome: () => void;
  onOpenAbout: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onGoHome,
  onOpenAbout,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-gradient-to-b from-[#2b7a70] via-[#0f4b4f] to-[#000000] text-slate-200 mt-16 border-t-4 border-[#518281] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#518281]/40">
          {/* Col 1: Logo & Slogan */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={onGoHome}>
              <div className="w-9 h-9 rounded-[10px] bg-[#dcfdc3] text-[#1b2835] flex items-center justify-center font-bold shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-[#dcfdc3] tracking-wider uppercase font-sans">
                TRÍCH DẪN TỰ ĐỘNG
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Hệ thống trích dẫn tài liệu tham khảo tự động dựa trên siêu dữ liệu URL/DOI.
              Thiết kế chuyên sâu cho các nhà nghiên cứu, giảng viên, sinh viên Việt Nam theo 
              các chuẩn APA, IEEE, VNU (Hanoi) và VNUA.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#dcfdc3]">
              <ShieldCheck className="w-4 h-4 text-[#dcfdc3]" />
              <span>Chính sách quyền riêng tư: Dữ liệu tạm thời tự hủy tối đa sau 15 phút.</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4 space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[13px] mb-3 text-[#dcfdc3]">
              Liên kết hệ thống
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onGoHome} className="hover:text-[#dcfdc3] transition-colors">
                  Trang chủ
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-[#dcfdc3] transition-colors">
                  Giới thiệu trang web & Slogan
                </button>
              </li>
              <li>
                <a 
                  href="https://tailieutrivan.id.vn" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#dcfdc3] transition-colors inline-flex items-center gap-1"
                >
                  Hệ sinh thái Tri Vân
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="mailto:duyanhdoan012@gmail.com?subject=Góp ý và đề xuất tài liệu" 
                  className="hover:text-[#dcfdc3] transition-colors inline-flex items-center gap-1"
                >
                  Góp ý & đề xuất tài liệu ↗
                </a>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-[#dcfdc3] transition-colors inline-flex items-center gap-1 text-[#dcfdc3]/90 font-semibold">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Quản trị (Thêm quy cách mới)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Author (from Mo ta.pdf) */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[13px] mb-3 text-[#dcfdc3]">
              Liên hệ tác giả
            </h4>
            <div className="space-y-2">
              <p className="font-semibold text-white">Anh Duy</p>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-[#dcfdc3]" />
                <a href="mailto:duyanhdoan012@gmail.com" className="hover:underline text-slate-200">
                  duyanhdoan012@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 pt-1">
                <svg className="w-3.5 h-3.5 text-[#dcfdc3] fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.85 0-1.54-.69-1.54-1.54a1.54 1.54 0 0 1 3.08 0c0 .85-.69 1.54-1.54 1.54m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
                </svg>
                <a 
                  href="https://www.linkedin.com/in/anh-duy-401418316/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline text-[#dcfdc3] font-medium"
                >
                  LinkedIn Profile ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© 2026 TRÍCH DẪN TỰ ĐỘNG. Thiết kế & phát triển phục vụ cộng đồng học thuật Việt Nam.</p>
          <p className="mt-2 sm:mt-0">Tất cả dữ liệu phiên làm việc được giải phóng khỏi bộ nhớ sau 15 phút.</p>
        </div>
      </div>
    </footer>
  );
};
