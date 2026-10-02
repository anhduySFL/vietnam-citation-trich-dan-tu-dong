import React from 'react';
import { X, BookOpen, Sparkles, User, Mail, ShieldAlert } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-[10px] shadow-2xl border-2 border-[#3a8080] w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1b2835] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#3a8080]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#3a8080] text-[#dcfdc3] flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase text-[#dcfdc3]">GIỚI THIỆU HỆ THỐNG</h3>
              <p className="text-[11px] text-slate-300">Vietnam Automatic Citation Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* Slogan */}
          <div className="p-4 rounded-[8px] bg-[#dcfdc3]/40 border border-[#3a8080]/30 text-center">
            <div className="inline-flex items-center gap-1.5 text-[#3a8080] font-bold uppercase tracking-wider text-xs mb-1">
              <Sparkles className="w-4 h-4 text-[#3a8080]" />
              <span>Slogan Hệ Thống</span>
            </div>
            <p className="text-base font-bold text-[#1b2835] font-serif">
              "Nhanh Chóng – Chuẩn Xác – Khoa Học"
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1b2835] uppercase mb-1">Giới thiệu trang web:</h4>
            <p className="text-slate-600">
              Website là công cụ tự động hóa việc trích dẫn và lập danh mục tài liệu tham khảo cho người làm nghiên cứu khoa học.
              Hệ thống đọc trực tiếp siêu dữ liệu từ đường dẫn URL hoặc mã DOI, cho phép người dùng kiểm tra/chỉnh sửa, và tự động xuất ra trích dẫn hoàn chỉnh theo các chuẩn APA, IEEE, VNU (Hanoi) và VNUA.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-[#1b2835] uppercase mb-1">
              <User className="w-4 h-4 text-[#3a8080]" />
              <span>Về Quản trị viên (Admin):</span>
            </div>
            <p className="font-semibold text-slate-800">Anh Duy</p>
            <p className="text-slate-500 flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-[#3a8080]" />
              <span>Email: </span>
              <a href="mailto:duyanhdoan012@gmail.com" className="text-[#3a8080] hover:underline font-medium">
                duyanhdoan012@gmail.com
              </a>
            </p>
          </div>

          <div className="p-3 rounded-[8px] bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Chính sách bảo mật dữ liệu: </span>
              Website không phải là thư viện lưu trữ citation hay citation manager cá nhân.
              Dữ liệu người dùng chỉ tồn tại tạm thời trong bộ nhớ và tự hủy hoàn toàn sau tối đa 15 phút.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-[8px] bg-[#3a8080] hover:bg-[#2b7a70] text-white font-bold text-xs cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
