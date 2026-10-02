import { useState } from 'react';
import type { CitationItem, CitationStyle, StyleDefinition } from './types/citation';
import { useSessionTtl } from './utils/useSessionTtl';
import { fetchMetadata } from './utils/metadataFetcher';
import { getAllStyles } from './engines/styleRegistry';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { UrlDoiInput } from './components/UrlDoiInput';
import { MetadataPreview } from './components/MetadataPreview';
import { ManualForm } from './components/ManualForm';
import { StyleSelector } from './components/StyleSelector';
import { CitationResult } from './components/CitationResult';
import { SessionList } from './components/SessionList';
import { StyleGuideView } from './components/StyleGuideView';
import { AboutModal } from './components/AboutModal';
import { AdminModal } from './components/AdminModal';
import { AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export function App() {
  // Session TTL management (Strict 15-minute in-memory lifecycle, zero localStorage)
  const {
    items,
    remainingFormatted,
    expirationNotice,
    dismissNotice,
    addItem,
    removeItem,
    clearSession,
    hasActiveSession
  } = useSessionTtl();

  // Active view: 'generator' (Trang chủ) vs 'guide' (Trang tra cứu quy cách)
  const [currentView, setCurrentView] = useState<'generator' | 'guide'>('generator');
  const [guideInitialStyle, setGuideInitialStyle] = useState<CitationStyle>('apa');

  // Active citation style
  const [currentStyle, setCurrentStyle] = useState<CitationStyle>('apa');
  const [stylesList, setStylesList] = useState<StyleDefinition[]>(getAllStyles());

  // Input & Acquisition state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Workflow states
  const [stagedItem, setStagedItem] = useState<CitationItem | null>(null); // For Metadata Preview
  const [isManualFormOpen, setIsManualFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CitationItem | null>(null);
  const [latestCreatedItem, setLatestCreatedItem] = useState<CitationItem | null>(null);

  // Modals
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // URL / DOI Analysis
  const handleAnalyze = async (input: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const parsedItem = await fetchMetadata(input);
      setStagedItem(parsedItem);
      setIsManualFormOpen(false);
    } catch (err: any) {
      setAnalysisError(err?.message || 'Không thể tự động đọc siêu dữ liệu từ liên kết này.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // User confirms metadata from preview -> Create Citation
  const handleConfirmMetadata = () => {
    if (!stagedItem) return;
    addItem(stagedItem);
    setLatestCreatedItem(stagedItem);
    setStagedItem(null);
  };

  // User chooses to edit metadata from preview
  const handleEditStaged = () => {
    setEditingItem(stagedItem);
    setIsManualFormOpen(true);
  };

  // Manual form save (either new or edited)
  const handleSaveManualItem = (item: CitationItem) => {
    addItem(item);
    setLatestCreatedItem(item);
    setStagedItem(null);
    setEditingItem(null);
    setIsManualFormOpen(false);
  };

  // Switch to standalone style guide view
  const handleOpenGuide = (style: CitationStyle) => {
    setGuideInitialStyle(style);
    setCurrentView('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f7faf7] text-[#1b2835] flex flex-col font-sans selection:bg-[#3a8080] selection:text-white">
      {/* Header */}
      <Navbar
        onGoHome={() => setCurrentView('generator')}
        onOpenAbout={() => setIsAboutOpen(true)}
        onSelectGuideStyle={handleOpenGuide}
        remainingTimeFormatted={remainingFormatted}
        hasActiveSession={hasActiveSession}
        currentView={currentView}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Expiration Notice Toast (when 15-minute TTL expires) */}
        {expirationNotice && (
          <div className="mb-6 p-4 rounded-[10px] bg-rose-100 border-2 border-rose-400 text-rose-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{expirationNotice}</span>
            </div>
            <button
              onClick={dismissNotice}
              className="text-rose-800 hover:text-black font-semibold underline text-xs cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {/* View 1: Standalone Style Guide Page */}
        {currentView === 'guide' ? (
          <StyleGuideView
            initialStyle={guideInitialStyle}
            onBackToGenerator={() => setCurrentView('generator')}
          />
        ) : (
          /* View 2: Main Citation Generator Workflow (Trang chủ) */
          <div>
            {/* Hero / Workflow Headline */}
            <div className="bg-gradient-to-r from-[#1b2835] via-[#244246] to-[#0f4b4f] rounded-[10px] p-6 sm:p-8 text-white shadow-md mb-8 border-b-4 border-[#3a8080]">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3a8080]/40 rounded-full text-xs font-bold text-[#dcfdc3] border border-[#3a8080] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#dcfdc3]" />
                <span>Hệ Thống Trích Dẫn Tài Liệu Tham Khảo Tự Động</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#dcfdc3] tracking-wide font-sans mb-2 uppercase">
                TRÍCH DẪN TỰ ĐỘNG THEO CHUẨN KHOA HỌC
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
                Quy trình tinh gọn: <strong>Dán link URL/DOI</strong> → <strong>Hệ thống đọc siêu dữ liệu</strong> → <strong>Kiểm tra & chỉnh sửa</strong> → <strong>Chọn chuẩn trích dẫn</strong> → <strong>Sao chép trích dẫn hoàn chỉnh</strong>.
                Dữ liệu phiên làm việc được bảo mật và tự hủy hoàn toàn sau tối đa 15 phút.
              </p>
            </div>

            {/* STEP 1: URL / DOI Input */}
            <UrlDoiInput
              onAnalyze={handleAnalyze}
              onManualInput={() => {
                setEditingItem(null);
                setStagedItem(null);
                setIsManualFormOpen(true);
              }}
              isLoading={isAnalyzing}
              errorMessage={analysisError}
              onClearError={() => setAnalysisError(null)}
            />

            {/* STEP 2A: Metadata Preview ("THÔNG TIN ĐÃ NHẬN DIỆN") */}
            {stagedItem && (
              <MetadataPreview
                item={stagedItem}
                onEdit={handleEditStaged}
                onConfirm={handleConfirmMetadata}
                onDiscard={() => setStagedItem(null)}
              />
            )}

            {/* STEP 2B: Manual / Edit Form (11 fields from Mo ta.pdf) */}
            {isManualFormOpen && (
              <ManualForm
                initialItem={editingItem}
                onSave={handleSaveManualItem}
                onCancel={() => {
                  setIsManualFormOpen(false);
                  setEditingItem(null);
                }}
              />
            )}

            {/* STEP 3: Style Selector (Chuẩn APA, Chuẩn IEEE, VNU (Hanoi), VNUA) */}
            <StyleSelector
              currentStyle={currentStyle}
              onStyleChange={setCurrentStyle}
              styles={stylesList}
            />

            {/* STEP 4: Latest Citation Result Display */}
            {latestCreatedItem ? (
              <CitationResult
                item={latestCreatedItem}
                style={currentStyle}
                index={items.findIndex(it => it.id === latestCreatedItem.id) + 1 || 1}
              />
            ) : (
              /* Placeholder before generating */
              <div className="bg-white rounded-[10px] p-8 text-center border-2 border-dashed border-slate-300 text-slate-400 text-xs mb-8">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-600 mb-1">
                  [Trích dẫn hoàn chỉnh sẽ hiện ra tại đây...]
                </p>
                <p>
                  Hãy nhập URL/DOI ở trên hoặc chọn "Nhập thông tin thủ công" để tạo trích dẫn đầu tiên.
                </p>
              </div>
            )}

            {/* STEP 5: Current Session References (Danh mục của phiên hiện tại) */}
            <SessionList
              items={items}
              style={currentStyle}
              remainingTimeFormatted={remainingFormatted}
              onRemoveItem={removeItem}
              onClearSession={clearSession}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onGoHome={() => setCurrentView('generator')}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onStyleAdded={(newStyle) => {
          setStylesList(getAllStyles());
          setCurrentStyle(newStyle.id);
        }}
      />
    </div>
  );
}

export default App;
