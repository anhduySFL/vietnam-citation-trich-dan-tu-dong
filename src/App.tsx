import { useState, useMemo, useEffect } from 'react';
import type { CitationItem, CitationStyle } from './types/citation';
import { SAMPLE_CITATIONS } from './data/sampleCitations';
import { Navbar } from './components/Navbar';
import { CitationCard } from './components/CitationCard';
import { CitationFormModal } from './components/CitationFormModal';
import { InTextGenerator } from './components/InTextGenerator';
import { BibliographyView } from './components/BibliographyView';
import { StyleGuideModal } from './components/StyleGuideModal';
import { 
  Search, 
  Layers, 
  BookMarked, 
  Quote, 
  Sparkles, 
  Filter, 
  Database
} from 'lucide-react';


export function App() {
  const [citations, setCitations] = useState<CitationItem[]>(() => {
    const saved = localStorage.getItem('viet_citations_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SAMPLE_CITATIONS;
      }
    }
    return SAMPLE_CITATIONS;
  });

  const [currentStyle, setCurrentStyle] = useState<CitationStyle>('apa');
  const [activeTab, setActiveTab] = useState<'cards' | 'bibliography' | 'intext'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLang, setFilterLang] = useState<string>('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CitationItem | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('viet_citations_data', JSON.stringify(citations));
  }, [citations]);

  // Index map for IEEE: [1], [2], [3]... based on item array index
  const itemIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    citations.forEach((item, idx) => {
      map.set(item.id, idx + 1);
    });
    return map;
  }, [citations]);

  // Filtered citations
  const filteredCitations = useMemo(() => {
    return citations.filter(item => {
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) return false;
      // Language filter
      if (filterLang !== 'all' && item.language !== filterLang) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchAuthors = item.authors.some(a => a.rawName.toLowerCase().includes(q));
        const matchYear = `${item.year || ''}`.includes(q);
        const matchJournal = (item.journalName || item.bookTitle || item.publisher || '').toLowerCase().includes(q);
        return matchTitle || matchAuthors || matchYear || matchJournal;
      }
      return true;
    });
  }, [citations, filterType, filterLang, searchQuery]);

  const handleSaveItem = (savedItem: CitationItem) => {
    if (editingItem) {
      setCitations(prev => prev.map(c => (c.id === savedItem.id ? savedItem : c)));
    } else {
      setCitations(prev => [savedItem, ...prev]);
    }
    setEditingItem(null);
  };

  const handleEditItem = (item: CitationItem) => {
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      setCitations(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleResetData = () => {
    if (window.confirm('Khôi phục danh sách dữ liệu mẫu từ tài liệu ĐH Huế và VNU?')) {
      setCitations(SAMPLE_CITATIONS);
    }
  };

  // Stats
  const vietnameseCount = citations.filter(c => c.language === 'vi').length;
  const foreignCount = citations.filter(c => c.language !== 'vi').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar
        currentStyle={currentStyle}
        onStyleChange={setCurrentStyle}
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsFormModalOpen(true);
        }}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onResetData={handleResetData}
        onOpenExportModal={() => setActiveTab('bibliography')}
        itemCount={citations.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner introduction */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Hệ thống chuyển đổi đa chuẩn trích dẫn khoa học</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0 mb-3 font-sans">
              Hệ Thống Trích Dẫn & Tạo Danh Mục TLTK Tự Động
            </h1>
            <p className="text-sm text-indigo-100 leading-relaxed font-sans mb-4">
              Tự động hóa toàn diện quy cách trích dẫn theo <strong>Quy định ĐH Huế (APA & IEEE)</strong> và{' '}
              <strong>NXB Đại học Quốc gia Hà Nội (VNU / Chuẩn Bộ GD&ĐT)</strong>. Tự động nhận diện tác giả Việt Nam,
              xếp thứ tự bảng chữ cái theo tên, gộp dải số IEEE <code>[2–5]</code>, và phân nhóm tài liệu theo từng ngôn ngữ.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-indigo-200">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Tổng cộng: <strong className="text-white">{citations.length} tài liệu</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
                🇻🇳 Tài liệu tiếng Việt: <strong className="text-white">{vietnameseCount}</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
                🌐 Tài liệu tiếng nước ngoài: <strong className="text-white">{foreignCount}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'cards'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Quản Lý Thư Viện ({filteredCitations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('intext')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'intext'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Quote className="w-4 h-4" />
              <span>Trích Dẫn Trong Thân Bài (In-Text)</span>
            </button>
            <button
              onClick={() => setActiveTab('bibliography')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'bibliography'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span>Danh Mục TLTK Hoàn Chỉnh</span>
            </button>
          </div>

          {/* Current Style Indicator */}
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Chuẩn hiện tại:</span>
            <span className="px-2.5 py-1 rounded-full font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              {currentStyle === 'apa' && 'APA (Đại học Huế)'}
              {currentStyle === 'ieee' && 'IEEE (Đại học Huế)'}
              {currentStyle === 'vnu' && 'VNU (NXB ĐHQG Hà Nội)'}
            </span>
          </div>
        </div>

        {/* Tab 1: Cards View */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên bài, tác giả, năm xuất bản, tạp chí..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              {/* Type filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-700"
                >
                  <option value="all">Tất cả loại hình</option>
                  <option value="journal">Bài báo tạp chí</option>
                  <option value="book">Sách / Báo cáo</option>
                  <option value="book_chapter">Chương sách</option>
                  <option value="conference">Kỷ yếu hội thảo</option>
                  <option value="thesis">Luận văn / Luận án</option>
                  <option value="newspaper">Bài báo chí</option>
                  <option value="webpage">Tài liệu Internet</option>
                  <option value="legal">Văn bản pháp luật</option>
                  <option value="manuscript">Bản thảo chưa in</option>
                </select>
              </div>

              {/* Language filter */}
              <div>
                <select
                  value={filterLang}
                  onChange={e => setFilterLang(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-700"
                >
                  <option value="all">Tất cả ngôn ngữ</option>
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">Tiếng Anh</option>
                  <option value="zh">Tiếng Trung</option>
                  <option value="ru">Tiếng Nga</option>
                  <option value="fr">Tiếng Pháp</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              {(searchQuery || filterType !== 'all' || filterLang !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterLang('all');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {/* List of cards */}
            {filteredCitations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <p className="text-slate-500 text-sm">Không tìm thấy tài liệu phù hợp với tìm kiếm.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterLang('all');
                  }}
                  className="mt-3 text-xs text-indigo-600 font-semibold"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredCitations.map(item => (
                  <CitationCard
                    key={item.id}
                    item={item}
                    style={currentStyle}
                    index={itemIndexMap.get(item.id) || 1}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: In-Text Interactive Generator */}
        {activeTab === 'intext' && (
          <InTextGenerator
            items={citations}
            style={currentStyle}
            itemIndexMap={itemIndexMap}
          />
        )}

        {/* Tab 3: Complete Bibliography View */}
        {activeTab === 'bibliography' && (
          <BibliographyView
            items={citations}
            style={currentStyle}
            itemIndexMap={itemIndexMap}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">Vietnam Citation Studio © 2026</p>
          <p className="mt-1">
            Thiết kế chuyên sâu cho các nhà khoa học, nghiên cứu sinh, giảng viên và sinh viên Việt Nam.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <CitationFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        initialData={editingItem}
      />

      <StyleGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}

export default App;
