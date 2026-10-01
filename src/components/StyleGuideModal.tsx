import React, { useState } from 'react';
import { X, BookOpen, Award, CheckCircle, Info } from 'lucide-react';

interface StyleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StyleGuideModal: React.FC<StyleGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'apa' | 'ieee' | 'vnu' | 'comparison'>('apa');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Sổ Tay Hướng Dẫn Quy Tắc Trích Dẫn Khoa Học
              </h3>
              <p className="text-xs text-slate-500">
                Tổng hợp từ Hướng dẫn ĐH Huế & Giáo trình Phương pháp luận NCKH NXB ĐHQG Hà Nội
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('apa')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'apa'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Chuẩn APA (Đại học Huế)
          </button>
          <button
            onClick={() => setActiveTab('ieee')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'ieee'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Chuẩn IEEE (Đại học Huế)
          </button>
          <button
            onClick={() => setActiveTab('vnu')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'vnu'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Chuẩn VNU (NXB ĐHQG Hà Nội)
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'comparison'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Bảng So Sánh Chi Tiết
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 space-y-4 leading-relaxed">
          {activeTab === 'apa' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm mb-1">
                    Nguyên Tắc Cốt Lõi: Tên Tác Giả - Thời Gian (Author-Date)
                  </h4>
                  <p>
                    Dẫn nguồn trong bài bằng tên tác giả và năm xuất bản đặt trong ngoặc đơn. Danh mục cuối bài xếp theo thứ tự bảng chữ cái (A-Z).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
                  <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Trích Dẫn Trong Văn Bản (In-Text)
                  </h5>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                    <li><strong>1 tác giả:</strong> (Tiến, 2010) hoặc Smith (2000).</li>
                    <li><strong>2 tác giả:</strong> (Liệu & Tuấn, 2005) hoặc Smith & Brown (2000).</li>
                    <li><strong>Từ 3 tác giả trở lên:</strong> ghi tác giả đầu + "và nnk." (tiếng Việt) hoặc "et al." (tiếng Anh): <em>(Liên và nnk., 1999)</em> hoặc <em>Thông và nnk. (2001)</em>.</li>
                    <li><strong>Nhiều nguồn cùng lúc:</strong> Sắp xếp theo thứ tự thời gian: <em>(Smith, 1959; Thomson & Jones, 1982; Green, 1990)</em>.</li>
                    <li><strong>Tài liệu đang in:</strong> Thắng và nnk. (đang in).</li>
                    <li><strong>Tổ chức / Cơ quan:</strong> (Bộ Công thương, 2010) hoặc WHO (2015).</li>
                    <li><strong>Trích dẫn nguyên văn:</strong> Thêm số trang: <em>(Obama, 2014, tr.97-98)</em>.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
                  <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Quy Tắc Tên Tác Giả Trong Mục Lục
                  </h5>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                    <li><strong>Người nước ngoài:</strong> Họ, chữ cái đầu tên viết hoa kèm dấu chấm. Ví dụ: <code>Lenin, V.I.</code> hoặc <code>Gaetke, L.M.</code></li>
                    <li><strong>Người Việt Nam:</strong> Tên, các chữ cái đầu họ và đệm viết hoa kèm dấu chấm. Ví dụ: <code>Châu, N.B.</code> hoặc <code>Hương, N. T. L.</code></li>
                    <li><strong>2 tác giả:</strong> Nối bằng ký tự <code>&</code>.</li>
                    <li><strong>3–5 tác giả:</strong> Ghi toàn bộ, nối <code>&</code> trước tác giả cuối.</li>
                    <li><strong>Từ 6 tác giả trở lên:</strong> Ghi 3 tác giả đầu, dùng <code>...</code> và tác giả cuối cùng.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ieee' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm mb-1">
                    Nguyên Tắc Cốt Lõi: Số Trong Ngoặc Vuông (Numeric Style)
                  </h4>
                  <p>
                    Dẫn nguồn bằng số đặt trong ngoặc vuông theo thứ tự xuất hiện lần đầu trong bài viết. Danh mục TLTK ở cuối bài xếp theo thứ tự số tăng dần [1], [2]...
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
                  <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Quy Cách Trích Dẫn Trong Văn Bản
                  </h5>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                    <li>Đặt trong dấu ngoặc vuông đứng trước dấu chấm câu, ví dụ: <code>...năm 2007 là 70 tỷ USD [1].</code></li>
                    <li>Từ 2 TLTK trở lên, cách nhau bằng dấu phẩy: <code>[2, 10]</code>.</li>
                    <li>Nhiều tài liệu liên tục, dùng dấu gạch ngang gộp dải: <code>[2-5]</code>.</li>
                    <li>Trích dẫn trực tiếp có số trang: <code>[4, tr.97]</code>.</li>
                    <li>Dẫn dắt: <code>Theo nhóm nghiên cứu dẫn đầu bởi Hair [8]...</code></li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
                  <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Quy Tắc Tên Tác Giả & Trình Bày
                  </h5>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                    <li><strong>Người nước ngoài:</strong> Tên viết tắt, Họ đầy đủ. Ví dụ: <code>V.I. Lenin</code> hoặc <code>L. M. Gaetke</code>.</li>
                    <li><strong>Người Việt:</strong> Họ đệm viết tắt, Tên đầy đủ. Ví dụ: <code>N.B. Châu</code> hoặc <code>N. T. L Hương</code>.</li>
                    <li>Tên bài báo / chương sách đặt trong ngoặc kép <code>“...”</code>, tên tạp chí / sách in nghiêng.</li>
                    <li>Định dạng lề kiểu <strong>hanging indent</strong> (hàng thứ hai lùi vào thẳng hàng với số thứ tự).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vnu' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm mb-1">
                    Chuẩn NXB ĐHQG Hà Nội & Bộ Giáo Dục & Đào Tạo
                  </h4>
                  <p>
                    Áp dụng cho luận văn thạc sĩ, luận án tiến sĩ và đề tài nghiên cứu khoa học. Bắt buộc phân chia danh mục theo từng nhóm ngôn ngữ riêng biệt.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
                  <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Phân Nhóm Ngôn Ngữ & Sắp Xếp
                  </h5>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                    <li><strong>Tách riêng theo ngôn ngữ:</strong> TÀI LIỆU TIẾNG VIỆT, TÀI LIỆU TIẾNG ANH, TIẾNG PHÁP, TIẾNG NGA,...</li>
                    <li><strong>Tác giả Việt Nam:</strong> Giữ nguyên thứ tự thông thường <code>Nguyễn Văn A</code> (không đảo), nhưng thuật toán xếp thứ tự A-Z theo Tên (A).</li>
                    <li><strong>Tác giả nước ngoài:</strong> Tác giả đầu tiên ghi <code>Họ, Tên viết tắt</code>; các tác giả sau ghi <code>Tên viết tắt Họ</code> (ví dụ: <code>Sterling E.J., M.M. Hurley and Le Duc Minh</code>).</li>
                    <li><strong>Từ 4 tác giả trở lên:</strong> Chỉ ghi tên tác giả thứ nhất + <code>và các cộng sự</code> (hoặc <code>et al.</code>).</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
                  <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Các Loại Tài Liệu Đặc Thù
                  </h5>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                    <li><strong>Văn bản pháp luật:</strong> Ghi rõ số ký hiệu, ngày ban hành của cơ quan và tên văn bản.</li>
                    <li><strong>Bản thảo chưa in (Manuscript):</strong> Kèm chú thích <code>[tài liệu chưa xuất bản]</code> hoặc <code>[forthcoming]</code>.</li>
                    <li><strong>Sách / Luận án:</strong> Ghi rõ tổng số trang ở cuối (ví dụ: <code>389 tr.</code> hoặc <code>448 p.</code>).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Đặc Điểm</th>
                    <th className="p-3">APA (ĐH Huế)</th>
                    <th className="p-3">IEEE (ĐH Huế)</th>
                    <th className="p-3">VNU (ĐHQG Hà Nội)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Hình thức In-text</td>
                    <td className="p-3">(Tác giả, Năm)</td>
                    <td className="p-3">[Số thứ tự]</td>
                    <td className="p-3">[Số] hoặc [Tác giả, Năm]</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Phân nhóm ngôn ngữ</td>
                    <td className="p-3">Gộp chung toàn bộ</td>
                    <td className="p-3">Xếp theo số tăng dần</td>
                    <td className="p-3 font-semibold text-indigo-600">Bắt buộc tách theo ngôn ngữ</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Tên tác giả Việt Nam</td>
                    <td className="p-3">Tên, Họ Đệm viết tắt (Châu, N.B.)</td>
                    <td className="p-3">Họ Đệm viết tắt. Tên (N.B. Châu)</td>
                    <td className="p-3">Giữ nguyên họ tên, xếp ABC theo Tên</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Dấu ngoặc kép bài báo</td>
                    <td className="p-3">Không dùng ngoặc kép</td>
                    <td className="p-3">Đặt trong “Tên bài báo,”</td>
                    <td className="p-3">Đặt trong “Tên bài báo”,</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Rút gọn đồng tác giả</td>
                    <td className="p-3">≥ 6 tác giả: ghi 3 tác giả... tác giả cuối</td>
                    <td className="p-3">≥ 6 tác giả: ghi 3 tác giả... tác giả cuối</td>
                    <td className="p-3">≥ 4 tác giả: tác giả 1 + "và các cộng sự"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
