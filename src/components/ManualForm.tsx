import { useState, useEffect } from 'react';
import type { CitationItem, ItemType, Author } from '../types/citation';
import { parseAuthorName } from '../utils/nameParser';
import { Plus, Trash2, Check, X, AlertCircle } from 'lucide-react';

interface ManualFormProps {
  initialItem?: CitationItem | null;
  onSave: (item: CitationItem) => void;
  onCancel: () => void;
}

const DOCUMENT_TYPES: { id: ItemType; label: string }[] = [
  { id: 'journal', label: 'Bài báo khoa học' },
  { id: 'journal_online', label: 'Bài báo khoa học xuất bản online' },
  { id: 'book', label: 'Sách in' },
  { id: 'book_ebook', label: 'Sách E-Book' },
  { id: 'book_database', label: 'Sách từ cơ sở dữ liệu' },
  { id: 'book_chapter', label: 'Chương trong sách' },
  { id: 'thesis', label: 'Luận văn / Luận án' },
  { id: 'org_document', label: 'Tài liệu cơ quan/tổ chức ban hành' },
  { id: 'proceedings', label: 'Tuyển tập / Kỷ yếu' },
  { id: 'conference_presentation', label: 'Tài liệu trình bày tại hội nghị' },
  { id: 'org_online', label: 'Tài liệu trực tuyến của cơ quan' },
  { id: 'webpage', label: 'Trang web thông thường' }
];

export const ManualForm: React.FC<ManualFormProps> = ({
  initialItem,
  onSave,
  onCancel
}) => {
  const [type, setType] = useState<ItemType>(initialItem?.type || 'journal');
  const [title, setTitle] = useState(initialItem?.title || '');
  const [venue, setVenue] = useState(initialItem?.journalName || initialItem?.publisher || initialItem?.siteName || '');
  const [year, setYear] = useState<string>(initialItem?.year !== undefined ? `${initialItem?.year}` : '');
  const [volume, setVolume] = useState(initialItem?.volume || '');
  const [issue, setIssue] = useState(initialItem?.issue || '');
  const [edition, setEdition] = useState(initialItem?.edition || '');
  const [totalPages, setTotalPages] = useState(initialItem?.totalPages || '');
  const [startPage, setStartPage] = useState(initialItem?.startPage || '');
  const [endPage, setEndPage] = useState(initialItem?.endPage || '');
  const [url, setUrl] = useState(initialItem?.url || '');
  const [doi, setDoi] = useState(initialItem?.doi || '');
  const [place, setPlace] = useState(initialItem?.place || '');
  const [institution, setInstitution] = useState(initialItem?.institution || '');
  const [degree, setDegree] = useState(initialItem?.degree || '');
  const [bookTitle, setBookTitle] = useState(initialItem?.bookTitle || '');
  const [conferenceDate, setConferenceDate] = useState(initialItem?.conferenceDate || '');
  const [conferenceLocation, setConferenceLocation] = useState(initialItem?.conferenceLocation || '');
  const [readerSoftware, setReaderSoftware] = useState(initialItem?.readerSoftware || '');
  const [language, setLanguage] = useState<'vi' | 'en' | 'fr' | 'ru' | 'zh' | 'ja' | 'other'>(initialItem?.language || 'vi');

  // Authors
  const [authors, setAuthors] = useState<Author[]>(initialItem?.authors || []);
  const [authorInput, setAuthorInput] = useState('');
  const [isVnAuthor, setIsVnAuthor] = useState(true);
  const [isCorpAuthor, setIsCorpAuthor] = useState(false);

  // Validation error
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialItem) {
      setType(initialItem.type);
      setTitle(initialItem.title);
      setVenue(initialItem.journalName || initialItem.publisher || initialItem.siteName || '');
      setYear(initialItem.year !== undefined ? `${initialItem.year}` : '');
      setVolume(initialItem.volume || '');
      setIssue(initialItem.issue || '');
      setEdition(initialItem.edition || '');
      setTotalPages(initialItem.totalPages || '');
      setStartPage(initialItem.startPage || '');
      setEndPage(initialItem.endPage || '');
      setUrl(initialItem.url || '');
      setDoi(initialItem.doi || '');
      setPlace(initialItem.place || '');
      setInstitution(initialItem.institution || '');
      setDegree(initialItem.degree || '');
      setBookTitle(initialItem.bookTitle || '');
      setConferenceDate(initialItem.conferenceDate || '');
      setConferenceLocation(initialItem.conferenceLocation || '');
      setReaderSoftware(initialItem.readerSoftware || '');
      setLanguage(initialItem.language || 'vi');
      setAuthors(initialItem.authors || []);
    }
  }, [initialItem]);

  const handleAddAuthor = () => {
    if (!authorInput.trim()) return;
    const auth = parseAuthorName(authorInput.trim(), isCorpAuthor, isVnAuthor);
    setAuthors(prev => [...prev, auth]);
    setAuthorInput('');
  };

  const handleRemoveAuthor = (idx: number) => {
    setAuthors(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Required fields validation
    if (!title.trim()) {
      setValidationError('Chưa đủ thông tin để tạo trích dẫn chính xác: Vui lòng nhập Tên tài liệu/Tác phẩm.');
      return;
    }

    if (authors.length === 0 && !venue.trim()) {
      setValidationError('Chưa đủ thông tin để tạo trích dẫn chính xác: Cần ít nhất 1 Tác giả hoặc Cơ quan ban hành.');
      return;
    }

    setValidationError(null);

    // Compute combined pages string
    let pagesCombined = '';
    if (startPage && endPage) {
      pagesCombined = `${startPage}-${endPage}`;
    } else if (startPage) {
      pagesCombined = startPage;
    }

    const now = Date.now();
    const item: CitationItem = {
      id: initialItem?.id || Math.random().toString(36).substring(2, 9),
      type,
      title: title.trim(),
      authors,
      year: year ? (isNaN(Number(year)) ? year : Number(year)) : undefined,
      language,
      journalName: type.includes('journal') ? venue.trim() : undefined,
      publisher: (type.includes('book') || type.includes('proceedings')) ? venue.trim() : undefined,
      siteName: (type.includes('web') || type.includes('online')) ? venue.trim() : undefined,
      organization: (type.includes('org') || isCorpAuthor) ? venue.trim() : undefined,
      volume: volume.trim() || undefined,
      issue: issue.trim() || undefined,
      edition: edition.trim() || undefined,
      totalPages: totalPages.trim() || undefined,
      startPage: startPage.trim() || undefined,
      endPage: endPage.trim() || undefined,
      pages: pagesCombined || undefined,
      doi: doi.trim() || undefined,
      url: url.trim() || undefined,
      accessDate: new Date().toLocaleDateString('vi-VN'),
      place: place.trim() || undefined,
      institution: institution.trim() || undefined,
      degree: degree.trim() || undefined,
      bookTitle: bookTitle.trim() || undefined,
      conferenceName: (type.includes('conference') || type.includes('proceedings')) ? venue.trim() : undefined,
      conferenceDate: conferenceDate.trim() || undefined,
      conferenceLocation: conferenceLocation.trim() || undefined,
      readerSoftware: readerSoftware.trim() || undefined,
      fieldSources: {
        title: 'user',
        authors: 'user',
        year: 'user'
      },
      createdAt: now,
      expiresAt: now + 15 * 60 * 1000
    };

    onSave(item);
  };

  return (
    <div className="bg-white rounded-[10px] p-6 shadow-md border-2 border-[#3a8080] mb-8 animate-in fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
        <div>
          <h3 className="font-bold text-base text-[#1b2835] uppercase tracking-wide">
            {initialItem ? 'CHỈNH SỬA THÔNG TIN TÀI LIỆU' : 'NHẬP THÔNG TIN TÀI LIỆU THỦ CÔNG'}
          </h3>
          <p className="text-xs text-slate-500">
            Các ô đánh số 1 đến 4 và số 11 giữ cố định; các ô còn lại kích hoạt phù hợp theo loại hình tài liệu.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {validationError && (
        <div className="mb-5 p-3 rounded-[8px] bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Document Type Selector (Loại) */}
        <div className="bg-slate-50 p-3.5 rounded-[10px] border border-slate-200">
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wider text-[#3a8080]">
            Bấm để chọn loại tài liệu:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {DOCUMENT_TYPES.map(t => (
              <button
                type="button"
                key={t.id}
                onClick={() => setType(t.id)}
                className={`px-3 py-2 rounded-[8px] text-left text-xs font-semibold transition-all border ${
                  type === t.id
                    ? 'bg-[#3a8080] text-white border-[#3a8080] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#3a8080]/50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 11 Fields Layout matching Mo ta.pdf */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Tác giả */}
          <div className="lg:col-span-2 bg-[#dcfdc3]/15 p-3 rounded-[10px] border border-[#dcfdc3]">
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#1b2835]">
                [1] Tên tác giả:
              </label>
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVnAuthor}
                    onChange={e => setIsVnAuthor(e.target.checked)}
                    className="rounded text-[#3a8080]"
                  />
                  <span>Tác giả Việt</span>
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCorpAuthor}
                    onChange={e => setIsCorpAuthor(e.target.checked)}
                    className="rounded text-[#3a8080]"
                  />
                  <span>Tổ chức/CQ</span>
                </label>
              </div>
            </div>

            {/* Current author tags */}
            {authors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {authors.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs">
                    <span className="font-semibold text-slate-800">{a.rawName}</span>
                    <button type="button" onClick={() => handleRemoveAuthor(i)} className="text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={authorInput}
                onChange={e => setAuthorInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAuthor();
                  }
                }}
                placeholder="Nhập tên tác giả (VD: Nguyễn Văn Toàn hoặc Smith, J.)..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
              />
              <button
                type="button"
                onClick={handleAddAuthor}
                className="px-3 py-1.5 bg-[#3a8080] hover:bg-[#2b7a70] text-white rounded-[8px] font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
          </div>

          {/* 2. Tên tác phẩm / Tiêu đề */}
          <div className="lg:col-span-2 bg-[#dcfdc3]/15 p-3 rounded-[10px] border border-[#dcfdc3]">
            <label className="block font-bold text-[#1b2835] mb-1">
              [2] Tên tác phẩm / Tiêu đề bài viết: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề sách, bài báo hoặc luận án..."
              className="w-full px-3 py-2 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
            />
          </div>

          {/* 3. Tạp chí / NXB / Nơi đăng bài */}
          <div className="lg:col-span-2 bg-slate-50 p-3 rounded-[10px] border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">
              [3] Tạp chí / NXB / Nơi đăng bài:
            </label>
            <input
              type="text"
              value={venue}
              onChange={e => setVenue(e.target.value)}
              placeholder="Tên Tạp chí khoa học, Nhà xuất bản, hoặc Tên website..."
              className="w-full px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
            />
          </div>

          {/* 4. Năm xuất bản */}
          <div className="bg-slate-50 p-3 rounded-[10px] border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">
              [4] Năm xuất bản:
            </label>
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="2024 hoặc (đang in)"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
            />
          </div>

          {/* 5. Tập (Volume) */}
          <div className="bg-slate-50 p-3 rounded-[10px] border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">
              [5] Tập (Volume):
            </label>
            <input
              type="text"
              value={volume}
              onChange={e => setVolume(e.target.value)}
              placeholder="Ví dụ: 16 hoặc 45"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
            />
          </div>

          {/* 6. Số (Issue) */}
          <div className="bg-slate-50 p-3 rounded-[10px] border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">
              [6] Số (Issue):
            </label>
            <input
              type="text"
              value={issue}
              onChange={e => setIssue(e.target.value)}
              placeholder="Ví dụ: 5 hoặc 7.1"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
            />
          </div>

          {/* 7. Lần tái bản (Edition) */}
          <div className="bg-slate-50 p-3 rounded-[10px] border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">
              [7] Lần tái bản (Edition):
            </label>
            <input
              type="text"
              value={edition}
              onChange={e => setEdition(e.target.value)}
              placeholder="Ví dụ: 3rd ed. hoặc Tái bản lần 2"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
            />
          </div>

          {/* 8. Tổng số trang */}
          <div className="bg-slate-50 p-3 rounded-[10px] border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">
              [8] Tổng số trang (nếu có):
            </label>
            <input
              type="text"
              value={totalPages}
              onChange={e => setTotalPages(e.target.value)}
              placeholder="Ví dụ: 492 tr. hoặc 234 pages"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
            />
          </div>

          {/* 9. Từ trang */}
          <div className="bg-slate-50 p-3 rounded-[10px] border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">
              [9] Từ trang...:
            </label>
            <input
              type="text"
              value={startPage}
              onChange={e => setStartPage(e.target.value)}
              placeholder="Ví dụ: 433"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
            />
          </div>

          {/* 10. Đến trang */}
          <div className="bg-slate-50 p-3 rounded-[10px] border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">
              [10] ...đến trang:
            </label>
            <input
              type="text"
              value={endPage}
              onChange={e => setEndPage(e.target.value)}
              placeholder="Ví dụ: 438"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
            />
          </div>

          {/* 11. Link truy cập & DOI */}
          <div className="lg:col-span-2 bg-slate-50 p-3 rounded-[10px] border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">
              [11] Link truy cập (URL) hoặc DOI:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
              />
              <input
                type="text"
                value={doi}
                onChange={e => setDoi(e.target.value)}
                placeholder="DOI: 10.xxxx/..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-[8px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3a8080]"
              />
            </div>
          </div>
        </div>

        {/* Extra fields if book chapter or thesis or conference */}
        {(type === 'book_chapter' || type === 'thesis' || type === 'conference_presentation' || type === 'book_ebook') && (
          <div className="p-3 bg-amber-50/50 rounded-[10px] border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {type === 'book_chapter' && (
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Tên cuốn sách chứa chương:</label>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={e => setBookTitle(e.target.value)}
                  placeholder="Giáo trình..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                />
              </div>
            )}
            {type === 'thesis' && (
              <>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Cơ sở đào tạo (Trường/Viện):</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    placeholder="Học viện Nông nghiệp Việt Nam..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Cấp bậc:</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    placeholder="Luận án tiến sĩ / Luận văn thạc sĩ"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  />
                </div>
              </>
            )}
            {type === 'conference_presentation' && (
              <>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Ngày tổ chức:</label>
                  <input
                    type="text"
                    value={conferenceDate}
                    onChange={e => setConferenceDate(e.target.value)}
                    placeholder="Ngày 12-15/04/1990"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Nơi tổ chức:</label>
                  <input
                    type="text"
                    value={conferenceLocation}
                    onChange={e => setConferenceLocation(e.target.value)}
                    placeholder="Hà Nội, Vietnam"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  />
                </div>
              </>
            )}
            {type === 'book_ebook' && (
              <div>
                <label className="block font-bold text-slate-800 mb-1">Phần mềm đọc sách:</label>
                <input
                  type="text"
                  value={readerSoftware}
                  onChange={e => setReaderSoftware(e.target.value)}
                  placeholder="Ví dụ: ebook hoặc Kindle"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                />
              </div>
            )}
            <div>
              <label className="block font-bold text-slate-800 mb-1">Thành phố / Nơi xuất bản:</label>
              <input
                type="text"
                value={place}
                onChange={e => setPlace(e.target.value)}
                placeholder="Hà Nội, TP. Hồ Chí Minh..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-[8px] text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-[8px] bg-[#3a8080] hover:bg-[#2b7a70] text-white font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#dcfdc3]" />
            <span>{initialItem ? 'Cập nhật tài liệu' : 'Tạo trích dẫn'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
