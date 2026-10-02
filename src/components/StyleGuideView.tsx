import React, { useState } from 'react';
import type { CitationStyle } from '../types/citation';
import { ArrowLeft, BookOpen, CheckCircle, Info } from 'lucide-react';
import { VNU_HANOI_NOTE } from '../engines/vnuHanoiEngine';
import { VNUA_SHORT_DESC } from '../engines/vnuaEngine';

interface StyleGuideViewProps {
  initialStyle?: CitationStyle;
  onBackToGenerator: () => void;
}

export const StyleGuideView: React.FC<StyleGuideViewProps> = ({
  initialStyle = 'apa',
  onBackToGenerator
}) => {
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>(initialStyle);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={onBackToGenerator}
        className="mb-6 px-4 py-2 rounded-[8px] bg-white border border-[#3a8080] text-[#3a8080] hover:bg-[#3a8080] hover:text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Về trang tạo trích dẫn</span>
      </button>

      {/* Title */}
      <div className="bg-[#1b2835] text-white rounded-[10px] p-6 mb-8 border-l-4 border-[#3a8080] shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-[#dcfdc3] mb-2 uppercase tracking-wide">
          SỔ TAY QUY CÁCH TRÍCH DẪN KHOA HỌC
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Tài liệu hướng dẫn chi tiết quy chuẩn trích dẫn trong nội dung văn bản và cách lập danh mục tài liệu tham khảo theo từng chuẩn được áp dụng tại các cơ sở đào tạo, viện nghiên cứu tại Việt Nam.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSelectedStyle('apa')}
          className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all ${
            selectedStyle === 'apa'
              ? 'bg-[#3a8080] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          1. Chuẩn APA
        </button>

        <button
          onClick={() => setSelectedStyle('ieee')}
          className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all ${
            selectedStyle === 'ieee'
              ? 'bg-[#3a8080] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          2. Chuẩn IEEE
        </button>

        <button
          onClick={() => setSelectedStyle('vnu')}
          className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all ${
            selectedStyle === 'vnu'
              ? 'bg-[#3a8080] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          3. VNU (Hanoi)
        </button>

        <button
          onClick={() => setSelectedStyle('vnua')}
          className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all ${
            selectedStyle === 'vnua'
              ? 'bg-[#3a8080] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          4. VNUA (QĐ 491/QĐ-HVN)
        </button>
      </div>

      {/* Content for Selected Style */}
      <div className="bg-white rounded-[10px] p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6 text-sm leading-relaxed">
        {/* 1. APA */}
        {selectedStyle === 'apa' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-[#3a8080]" />
              <h2 className="text-lg font-bold text-[#1b2835] uppercase">
                Quy Cách Chuẩn APA (American Psychological Association)
              </h2>
            </div>

            <p className="text-xs text-slate-600">
              Chuẩn APA (Author-Date) là chuẩn trích dẫn phổ biến trong các ngành khoa học xã hội, kinh tế, tâm lý và giáo dục.
              Nguyên tắc cơ bản: dẫn nguồn bằng <strong>Tên tác giả - Năm xuất bản</strong> đặt trong ngoặc đơn.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-200 space-y-2">
                <h4 className="font-bold text-[#3a8080] uppercase">A. Trích dẫn trong văn bản (In-text)</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                  <li><strong>1 tác giả:</strong> (Tiến, 2010) hoặc Smith (2000).</li>
                  <li><strong>2 tác giả:</strong> (Liệu & Tuấn, 2005) hoặc Smith & Brown (2000).</li>
                  <li><strong>Từ 3 tác giả trở lên:</strong> Tác giả đầu + "và nnk." (tiếng Việt) hoặc "et al." (tiếng Anh): <em>(Liên và nnk., 1999)</em>.</li>
                  <li><strong>Nhiều nguồn cùng lúc:</strong> Sắp xếp theo thứ tự thời gian: <em>(Smith, 1959; Thomson & Jones, 1982; Green, 1990)</em>.</li>
                  <li><strong>Trích nguyên văn:</strong> Kèm số trang: <em>(Obama, 2014, tr.97-98)</em>.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-200 space-y-2">
                <h4 className="font-bold text-[#3a8080] uppercase">B. Danh mục tài liệu tham khảo</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                  <li>Sắp xếp thứ tự ABC theo tên tác giả (hoặc tác giả đầu).</li>
                  <li><strong>Người nước ngoài:</strong> Họ, Tên viết tắt (VD: <code>Lenin, V.I.</code> hoặc <code>Gaetke, L.M.</code>).</li>
                  <li><strong>Người Việt Nam:</strong> Tên, Họ Đệm viết tắt (VD: <code>Châu, N.B.</code>).</li>
                  <li>Tên sách, tên tạp chí in nghiêng; tên bài báo để chữ thường (không đặt trong ngoặc kép).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 2. IEEE */}
        {selectedStyle === 'ieee' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-[#3a8080]" />
              <h2 className="text-lg font-bold text-[#1b2835] uppercase">
                Quy Cách Chuẩn IEEE (Institute of Electrical and Electronics Engineers)
              </h2>
            </div>

            <p className="text-xs text-slate-600">
              Chuẩn IEEE là quy chuẩn phổ biến trong các lĩnh vực kỹ thuật, công nghệ thông tin, điện tử viễn thông.
              Nguyên tắc cơ bản: dẫn nguồn bằng <strong>chữ số đặt trong dấu ngoặc vuông [1]</strong> theo thứ tự xuất hiện trong bài viết.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-200 space-y-2">
                <h4 className="font-bold text-[#3a8080] uppercase">A. Trích dẫn trong văn bản</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                  <li>Đặt trước dấu chấm câu, ví dụ: <code>...lên tới 70 tỷ USD [1].</code></li>
                  <li>Nhiều tài liệu liên tục được tự động gộp bằng dấu gạch ngang: <code>[2–5]</code>.</li>
                  <li>Nhiều tài liệu rời rạc cách nhau bằng dấu phẩy: <code>[2, 10]</code>.</li>
                  <li>Có số trang trích dẫn: <code>[4, tr.97]</code>.</li>
                  <li>Tài liệu đã trích dẫn khi trích lại vẫn giữ nguyên số thứ tự ban đầu.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-200 space-y-2">
                <h4 className="font-bold text-[#3a8080] uppercase">B. Danh mục tài liệu tham khảo</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                  <li>Sắp xếp tăng dần theo số thứ tự [1], [2], [3]...</li>
                  <li>Tên viết tắt trước Họ (VD: <code>V.I. Lenin</code>, <code>N.B. Châu</code>).</li>
                  <li>Tên bài báo khoa học hoặc chương sách đặt trong dấu ngoặc kép <code>“...”</code>; tên tạp chí hoặc sách in nghiêng.</li>
                  <li>Định dạng lề kiểu <em>hanging indent</em>.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. VNU (Hanoi) */}
        {selectedStyle === 'vnu' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-[#3a8080]" />
              <h2 className="text-lg font-bold text-[#1b2835] uppercase">
                Quy Cách VNU (Hanoi) - Đại Học Quốc Gia Hà Nội & Bộ GD&ĐT
              </h2>
            </div>

            <div className="p-4 rounded-[8px] bg-[#dcfdc3]/30 border border-[#3a8080]/30 text-xs text-[#1b2835] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#3a8080] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#3a8080]">Căn cứ quy chuẩn: </span>
                <span className="italic font-serif">{VNU_HANOI_NOTE}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-200 space-y-2">
                <h4 className="font-bold text-[#3a8080] uppercase">A. Phân chia nhóm ngôn ngữ</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                  <li><strong>Bắt buộc phân chia danh mục riêng biệt:</strong> <em>TÀI LIỆU TIẾNG VIỆT</em>, <em>TÀI LIỆU TIẾNG ANH</em>, <em>TÀI LIỆU TIẾNG PHÁP</em>...</li>
                  <li>Tài liệu tiếng nước ngoài giữ nguyên bản ngữ, không phiên âm.</li>
                  <li>Tác giả Việt Nam giữ nguyên thứ tự họ tên tự nhiên (<code>Trần Văn Hùng</code>), nhưng sắp xếp theo thứ tự A-Z theo <strong>Tên</strong> (Hùng).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-200 space-y-2">
                <h4 className="font-bold text-[#3a8080] uppercase">B. Quy cách trình bày từng loại</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                  <li><strong>Bài báo:</strong> Tác giả (Năm), “Tên bài báo”, <em>Tên tạp chí</em>, tập, số, tr. X–Y.</li>
                  <li><strong>Sách in:</strong> Tác giả (Năm), <em>Tên sách</em>, NXB, Nơi XB, số trang.</li>
                  <li><strong>Bản thảo chưa in:</strong> Kèm chú thích <code>[tài liệu chưa xuất bản]</code> hoặc <code>[forthcoming]</code>.</li>
                  <li><strong>Văn bản pháp luật:</strong> Số/Ký hiệu ngày... của Cơ quan về Tên văn bản.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 4. VNUA */}
        {selectedStyle === 'vnua' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-[#3a8080]" />
              <div>
                <h2 className="text-lg font-bold text-[#1b2835] uppercase">
                  Quy Cách VNUA (Học Viện Nông Nghiệp Việt Nam)
                </h2>
                <p className="text-xs text-slate-500 font-sans mt-0.5">{VNUA_SHORT_DESC}</p>
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#dcfdc3]/30 border border-[#3a8080]/30 text-xs text-[#1b2835] flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#3a8080] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#3a8080]">Nguyên tắc cốt lõi: </span>
                <span>
                  Liệt kê <strong>đầy đủ họ và tên tất cả các tác giả</strong> trong Danh mục tài liệu tham khảo (tuyệt đối không dùng <em>et al.</em> hay <em>& cs.</em> trong danh mục cuối bài).
                  Tất cả các đồng tác giả đều nối với nhau bằng ký hiệu <strong>&</strong>.
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-[#3a8080] uppercase border-b pb-1">
                11 Nhóm Tài Liệu Được Quy Định Cụ Thể (Kèm theo QĐ 491):
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                <li><strong>2.1 Bài báo khoa học:</strong> Họ tên tác giả (năm xuất bản). Tên bài báo. Tên tạp chí. tập(số): trang hoặc ID và/hoặc DOI:...</li>
                <li><strong>2.2 Bài báo khoa học xuất bản online:</strong> Họ và tên tác giả (năm). Tên bài báo. Tên tạp chí. tập(số): trang. DOI:xxxx hoặc Truy cập từ http://xxxx ngày...</li>
                <li><strong>2.3 Sách in:</strong> Họ tên tác giả/tên cơ quan (năm xuất bản). Tên sách (số tập/lần tái bản). Nhà xuất bản. Thành phố/Tỉnh.</li>
                <li><strong>2.4 Sách E-Book:</strong> Họ tên tác giả (năm xuất bản). Tên sách [phần mềm đọc sách]. Truy cập từ trang http://xxxx ngày… hoặc Doi:xxxx.</li>
                <li><strong>2.5 Sách truy cập từ cơ sở dữ liệu:</strong> Họ tên tác giả (năm xuất bản). Tên sách. Truy cập từ http://xxxx ngày… hoặc DOI: xxxx.</li>
                <li><strong>2.6 Chương trong sách:</strong> Họ tên tác giả (năm xuất bản). Tên chương. Trong: (Tên chủ biên (chủ biên)). Tên sách. Nhà xuất bản, địa điểm. Trang trích dẫn.</li>
                <li><strong>2.7 Luận văn, luận án:</strong> Họ tên tác giả (năm xuất bản). Tiêu đề. Luận văn thạc sĩ/Luận án tiến sĩ. Cơ sở đào tạo. (trang trích dẫn/tổng số trang).</li>
                <li><strong>2.8 Sách, tài liệu do cơ quan/tổ chức ban hành:</strong> Tên cơ quan/tổ chức (Năm xuất bản). Tên tài liệu. Tên chủ biên (nếu có). (Truy cập từ http://xxxx ngày…).</li>
                <li><strong>2.9 Các bài báo đăng trong các tuyển tập, kỷ yếu:</strong> Tên tác giả (năm xuất bản). Tiêu đề bài báo. Tên tuyển tập/kỷ yếu. Nhà xuất bản. trang trích dẫn.</li>
                <li><strong>2.10 Các tài liệu được trình bày tại Hội nghị, hội thảo:</strong> Tên tác giả (năm). Tiêu đề báo cáo. Tên hội nghị/hội thảo. Ngày tổ chức. Nơi tổ chức. trang trích dẫn.</li>
                <li><strong>2.11 Các tài liệu trực tuyến của cơ quan, tổ chức:</strong> Tên tổ chức (năm xuất bản). Tên tài liệu. Truy cập từ http://xxxx ngày…</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
