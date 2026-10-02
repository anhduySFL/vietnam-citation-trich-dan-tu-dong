import { useState } from 'react';
import type { StyleDefinition } from '../types/citation';
import { registerCustomStyle } from '../engines/styleRegistry';
import { X, Plus, Settings, Check, Shield } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStyleAdded: (style: StyleDefinition) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onStyleAdded
}) => {
  const [styleId, setStyleId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [sourceNote, setSourceNote] = useState('');
  const [authorRules, setAuthorRules] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleAddStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!styleId.trim() || !displayName.trim()) return;

    const newStyle: StyleDefinition = {
      id: styleId.trim().toLowerCase().replace(/\s+/g, '-'),
      displayName: displayName.trim(),
      shortDescription: description.trim() || `Quy cách trích dẫn ${displayName.trim()}`,
      sourceNote: sourceNote.trim() || undefined,
      supportedTypes: ['journal', 'book', 'thesis', 'conference', 'webpage'],
      authorRulesSummary: authorRules.trim() || 'Theo chuẩn đăng ký mới',
      isBuiltin: false
    };

    registerCustomStyle(newStyle);
    onStyleAdded(newStyle);
    setSuccessNotice(true);

    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-[10px] shadow-2xl border-2 border-[#3a8080] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1b2835] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#3a8080]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#3a8080] text-[#dcfdc3] flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase text-[#dcfdc3]">QUẢN TRỊ VIÊN: THÊM QUY CÁCH TRÍCH DẪN</h3>
              <p className="text-[11px] text-slate-300">Mô hình hóa quy chuẩn trích dẫn mới vào hệ thống</p>
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
        <form onSubmit={handleAddStyle} className="p-6 space-y-4 text-xs overflow-y-auto">
          {successNotice ? (
            <div className="p-4 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>Đã đăng ký quy cách mới thành công vào phiên làm việc!</span>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-[8px] bg-[#dcfdc3]/30 border border-[#3a8080]/30 text-slate-700 flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#3a8080] shrink-0 mt-0.5" />
                <p>
                  Chức năng dành cho Quản trị viên để bổ sung các quy cách trích dẫn mở rộng (như Chicago, Harvard, Vancouver hoặc các quy định trường đại học khác) theo mô hình chuẩn hóa.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1b2835] mb-1">Mã định danh (Style ID): *</label>
                  <input
                    type="text"
                    required
                    value={styleId}
                    onChange={e => setStyleId(e.target.value)}
                    placeholder="ví dụ: chicago, vancouver..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-[8px] text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1b2835] mb-1">Tên hiển thị: *</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="ví dụ: Chuẩn Chicago, Chuẩn Vancouver..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-[8px] text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1b2835] mb-1">Mô tả ngắn về quy cách:</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="ví dụ: Quy chuẩn xuất bản của Đại học Chicago..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-[8px] text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1b2835] mb-1">Căn cứ văn bản / Trích dẫn nguồn:</label>
                <textarea
                  rows={2}
                  value={sourceNote}
                  onChange={e => setSourceNote(e.target.value)}
                  placeholder="Nhập thông tin văn bản, quyết định ban hành quy chuẩn..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-[8px] text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1b2835] mb-1">Quy tắc tác giả & sắp xếp:</label>
                <input
                  type="text"
                  value={authorRules}
                  onChange={e => setAuthorRules(e.target.value)}
                  placeholder="ví dụ: Tác giả đầu tiên viết Họ, Tên; các tác giả sau viết bình thường..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-[8px] text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-[8px] text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[8px] bg-[#3a8080] hover:bg-[#2b7a70] text-white font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#dcfdc3]" />
                  <span>Thêm quy cách</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
