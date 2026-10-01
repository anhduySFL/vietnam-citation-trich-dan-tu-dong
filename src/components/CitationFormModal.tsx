import { useState, useEffect } from 'react';
import type { CitationItem, ItemType, Author } from '../types/citation';

import { parseAuthorName } from '../utils/nameParser';
import { X, Plus, Trash2, Check, User, Globe, FileText } from 'lucide-react';

interface CitationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CitationItem) => void;
  initialData?: CitationItem | null;
}

const ITEM_TYPES: { id: ItemType; label: string }[] = [
  { id: 'journal', label: 'Bài báo tạp chí' },
  { id: 'book', label: 'Sách / Báo cáo' },
  { id: 'book_chapter', label: 'Chương trong sách' },
  { id: 'conference', label: 'Kỷ yếu hội thảo' },
  { id: 'thesis', label: 'Luận văn / Luận án' },
  { id: 'newspaper', label: 'Bài trên báo chí' },
  { id: 'webpage', label: 'Tài liệu Internet' },
  { id: 'legal', label: 'Văn bản pháp luật' },
  { id: 'manuscript', label: 'Bản thảo chưa in' },
];

export const CitationFormModal: React.FC<CitationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [type, setType] = useState<ItemType>('journal');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<string>('');
  const [language, setLanguage] = useState<'vi' | 'en' | 'fr' | 'ru' | 'zh' | 'ja' | 'other'>('vi');
  const [translatedTitle, setTranslatedTitle] = useState('');

  // Authors
  const [authors, setAuthors] = useState<Author[]>([]);
  const [newAuthorInput, setNewAuthorInput] = useState('');
  const [newAuthorIsVn, setNewAuthorIsVn] = useState(true);
  const [newAuthorIsCorp, setNewAuthorIsCorp] = useState(false);

  // Editors for Book Chapter
  const [editors, setEditors] = useState<Author[]>([]);
  const [newEditorInput, setNewEditorInput] = useState('');

  // Type-specific
  const [publisher, setPublisher] = useState('');
  const [place, setPlace] = useState('');
  const [edition, setEdition] = useState('');
  const [totalPageCount, setTotalPageCount] = useState('');
  const [journalName, setJournalName] = useState('');
  const [volume, setVolume] = useState('');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('');
  const [doi, setDoi] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [conferenceName, setConferenceName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [conferenceLocation, setConferenceLocation] = useState('');
  const [conferenceDate, setConferenceDate] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [newspaperName, setNewspaperName] = useState('');
  const [pubDateExact, setPubDateExact] = useState('');
  const [url, setUrl] = useState('');
  const [accessDate, setAccessDate] = useState('');
  const [siteName, setSiteName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setTitle(initialData.title);
      setYear(initialData.year !== undefined ? `${initialData.year}` : '');
      setLanguage(initialData.language || 'vi');
      setTranslatedTitle(initialData.translatedTitle || '');
      setAuthors(initialData.authors || []);
      setEditors(initialData.editors || []);
      setPublisher(initialData.publisher || '');
      setPlace(initialData.place || '');
      setEdition(initialData.edition || '');
      setTotalPageCount(initialData.totalPageCount || '');
      setJournalName(initialData.journalName || '');
      setVolume(initialData.volume || '');
      setIssue(initialData.issue || '');
      setPages(initialData.pages || '');
      setDoi(initialData.doi || '');
      setBookTitle(initialData.bookTitle || '');
      setConferenceName(initialData.conferenceName || '');
      setOrganizer(initialData.organizer || '');
      setConferenceLocation(initialData.conferenceLocation || '');
      setConferenceDate(initialData.conferenceDate || '');
      setDegree(initialData.degree || '');
      setInstitution(initialData.institution || '');
      setNewspaperName(initialData.newspaperName || '');
      setPubDateExact(initialData.pubDateExact || '');
      setUrl(initialData.url || '');
      setAccessDate(initialData.accessDate || '');
      setSiteName(initialData.siteName || '');
      setDocumentNumber(initialData.documentNumber || '');
      setIssuingAuthority(initialData.issuingAuthority || '');
    } else {
      // Reset form
      setType('journal');
      setTitle('');
      setYear(new Date().getFullYear().toString());
      setLanguage('vi');
      setTranslatedTitle('');
      setAuthors([]);
      setEditors([]);
      setPublisher('');
      setPlace('');
      setEdition('');
      setTotalPageCount('');
      setJournalName('');
      setVolume('');
      setIssue('');
      setPages('');
      setDoi('');
      setBookTitle('');
      setConferenceName('');
      setOrganizer('');
      setConferenceLocation('');
      setConferenceDate('');
      setDegree('');
      setInstitution('');
      setNewspaperName('');
      setPubDateExact('');
      setUrl('');
      setAccessDate('');
      setSiteName('');
      setDocumentNumber('');
      setIssuingAuthority('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddAuthor = () => {
    if (!newAuthorInput.trim()) return;
    const author = parseAuthorName(newAuthorInput.trim(), newAuthorIsCorp, newAuthorIsVn);
    setAuthors(prev => [...prev, author]);
    setNewAuthorInput('');
  };

  const handleRemoveAuthor = (idx: number) => {
    setAuthors(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddEditor = () => {
    if (!newEditorInput.trim()) return;
    const ed = parseAuthorName(newEditorInput.trim(), false, language === 'vi');
    setEditors(prev => [...prev, ed]);
    setNewEditorInput('');
  };

  const handleRemoveEditor = (idx: number) => {
    setEditors(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const item: CitationItem = {
      id: initialData?.id || Math.random().toString(36).substring(2, 9),
      type,
      title: title.trim(),
      authors,
      year: year ? (isNaN(Number(year)) ? year : Number(year)) : undefined,
      language,
      translatedTitle: translatedTitle.trim() || undefined,
      publisher: publisher.trim() || undefined,
      place: place.trim() || undefined,
      edition: edition.trim() || undefined,
      totalPageCount: totalPageCount.trim() || undefined,
      journalName: journalName.trim() || undefined,
      volume: volume.trim() || undefined,
      issue: issue.trim() || undefined,
      pages: pages.trim() || undefined,
      doi: doi.trim() || undefined,
      bookTitle: bookTitle.trim() || undefined,
      editors: editors.length > 0 ? editors : undefined,
      conferenceName: conferenceName.trim() || undefined,
      organizer: organizer.trim() || undefined,
      conferenceLocation: conferenceLocation.trim() || undefined,
      conferenceDate: conferenceDate.trim() || undefined,
      degree: degree.trim() || undefined,
      institution: institution.trim() || undefined,
      newspaperName: newspaperName.trim() || undefined,
      pubDateExact: pubDateExact.trim() || undefined,
      url: url.trim() || undefined,
      accessDate: accessDate.trim() || undefined,
      siteName: siteName.trim() || undefined,
      documentNumber: documentNumber.trim() || undefined,
      issuingAuthority: issuingAuthority.trim() || undefined,
    };

    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              {initialData ? 'Chỉnh Sửa Tài Liệu Tham Khảo' : 'Thêm Tài Liệu Tham Khảo Mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Type selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Loại hình tài liệu tham khảo</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ITEM_TYPES.map(t => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`px-3 py-2 rounded-lg border text-left font-medium transition-all ${
                    type === t.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Tên bài viết / Tiêu đề sách / Luận án <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nhập tên tài liệu..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                Ngôn ngữ
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">Tiếng Anh</option>
                <option value="zh">Tiếng Trung</option>
                <option value="ru">Tiếng Nga</option>
                <option value="fr">Tiếng Pháp</option>
                <option value="ja">Tiếng Nhật</option>
                <option value="other">Ngôn ngữ khác</option>
              </select>
            </div>
          </div>

          {/* Non-Latin Translated Title (if applicable) */}
          {(language === 'zh' || language === 'ru' || language === 'ja' || language === 'other') && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bản dịch tên tài liệu (Đặt trong ngoặc vuông [ ])
              </label>
              <input
                type="text"
                value={translatedTitle}
                onChange={e => setTranslatedTitle(e.target.value)}
                placeholder="Ví dụ: [Nghiên cứu về cơ chế nhận thức...]"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {/* Authors Management */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                Danh sách tác giả ({authors.length})
              </label>
            </div>

            {/* Author list tags */}
            {authors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {authors.map((auth, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs shadow-xs"
                  >
                    <span className="font-medium text-slate-800">
                      {idx + 1}. {auth.rawName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ({auth.isCorporate ? 'Tổ chức' : auth.isVietnamese ? 'VN' : 'Ngoại'})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAuthor(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add author controls */}
            <div className="space-y-2 pt-1 border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAuthorInput}
                  onChange={e => setNewAuthorInput(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A hoặc Smith, J. hoặc WHO"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAuthor();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddAuthor}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm</span>
                </button>
              </div>

              <div className="flex items-center gap-4 text-slate-600 text-[11px]">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAuthorIsVn}
                    onChange={e => setNewAuthorIsVn(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Tác giả người Việt Nam</span>
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAuthorIsCorp}
                    onChange={e => setNewAuthorIsCorp(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Cơ quan / Tổ chức ban hành</span>
                </label>
              </div>
            </div>
          </div>

          {/* Year & Common metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Năm xuất bản</label>
              <input
                type="text"
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="2024 hoặc (đang in)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trang (Pages)</label>
              <input
                type="text"
                value={pages}
                onChange={e => setPages(e.target.value)}
                placeholder="Ví dụ: 79-94"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tổng số trang (nếu có)</label>
              <input
                type="text"
                value={totalPageCount}
                onChange={e => setTotalPageCount(e.target.value)}
                placeholder="Ví dụ: 389 tr. hoặc 448 p."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mã DOI</label>
              <input
                type="text"
                value={doi}
                onChange={e => setDoi(e.target.value)}
                placeholder="10.1016/..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Type Specific Fields */}
          {type === 'journal' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên tạp chí khoa học</label>
                <input
                  type="text"
                  value={journalName}
                  onChange={e => setJournalName(e.target.value)}
                  placeholder="Tạp chí Khoa học..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tập (Volume)</label>
                <input
                  type="text"
                  value={volume}
                  onChange={e => setVolume(e.target.value)}
                  placeholder="126"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số (Issue)</label>
                <input
                  type="text"
                  value={issue}
                  onChange={e => setIssue(e.target.value)}
                  placeholder="5D hoặc 2"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {(type === 'book' || type === 'book_chapter') && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {type === 'book_chapter' && (
                <div className="sm:col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">Tên cuốn sách chứa chương này</label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={e => setBookTitle(e.target.value)}
                    placeholder="Văn hóa - lịch sử Huế..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nhà xuất bản</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={e => setPublisher(e.target.value)}
                  placeholder="Nxb Khoa học và Kỹ thuật"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nơi xuất bản</label>
                <input
                  type="text"
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                  placeholder="Hà Nội, New York..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lần xuất bản (nếu có)</label>
                <input
                  type="text"
                  value={edition}
                  onChange={e => setEdition(e.target.value)}
                  placeholder="2nd ed. hoặc Tái bản lần 2"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {type === 'book_chapter' && (
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/60 space-y-2">
              <label className="font-semibold text-slate-800">Chủ biên / Biên tập cuốn sách (Editors)</label>
              {editors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {editors.map((ed, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs">
                      {ed.rawName}
                      <button type="button" onClick={() => handleRemoveEditor(idx)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEditorInput}
                  onChange={e => setNewEditorInput(e.target.value)}
                  placeholder="Nhập tên chủ biên..."
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddEditor}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  Thêm chủ biên
                </button>
              </div>
            </div>
          )}

          {type === 'conference' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Tên kỷ yếu / Tên hội thảo</label>
                <input
                  type="text"
                  value={conferenceName}
                  onChange={e => setConferenceName(e.target.value)}
                  placeholder="Kỷ yếu Hội thảo Khoa học Quốc gia..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cơ quan tổ chức</label>
                <input
                  type="text"
                  value={organizer}
                  onChange={e => setOrganizer(e.target.value)}
                  placeholder="Đại học Quốc gia Hà Nội..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa điểm tổ chức</label>
                <input
                  type="text"
                  value={conferenceLocation}
                  onChange={e => setConferenceLocation(e.target.value)}
                  placeholder="Hạ Long, Hà Nội..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {type === 'thesis' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cấp bậc / Loại hình luận văn</label>
                <input
                  type="text"
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
                  placeholder="Luận án Tiến sĩ / PhD thesis"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cơ sở đào tạo (Trường/Viện)</label>
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  placeholder="Trường ĐH Kinh tế Tp. HCM"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa điểm</label>
                <input
                  type="text"
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                  placeholder="Tp. HCM, Helsinki..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {type === 'newspaper' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên tờ báo</label>
                <input
                  type="text"
                  value={newspaperName}
                  onChange={e => setNewspaperName(e.target.value)}
                  placeholder="Báo Tuổi Trẻ, Thanh Niên..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ngày tháng năm xuất bản chính xác</label>
                <input
                  type="text"
                  value={pubDateExact}
                  onChange={e => setPubDateExact(e.target.value)}
                  placeholder="Ví dụ: 21/7/2016"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {type === 'webpage' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên trang web / Tạp chí online</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={e => setSiteName(e.target.value)}
                  placeholder="ThanhNienOnline, VnExpress..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Địa chỉ URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="http://..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ngày truy cập</label>
                <input
                  type="text"
                  value={accessDate}
                  onChange={e => setAccessDate(e.target.value)}
                  placeholder="21/7/2016"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {type === 'legal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số / Ký hiệu văn bản</label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={e => setDocumentNumber(e.target.value)}
                  placeholder="18/2014/TT-BNNPTNT hoặc Quyết định số 432/QĐ-TTg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cơ quan ban hành</label>
                <input
                  type="text"
                  value={issuingAuthority}
                  onChange={e => setIssuingAuthority(e.target.value)}
                  placeholder="Thủ tướng Chính phủ / Bộ GD&ĐT..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ngày ban hành</label>
                <input
                  type="text"
                  value={pubDateExact}
                  onChange={e => setPubDateExact(e.target.value)}
                  placeholder="12/4/2012"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {type === 'manuscript' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cơ quan / Đơn vị ấn hành bản thảo</label>
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  placeholder="Trung tâm Nghiên cứu Tài nguyên và Môi trường..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa điểm</label>
                <input
                  type="text"
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                  placeholder="Hà Nội, Thailand..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Cập nhật tài liệu' : 'Lưu tài liệu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
