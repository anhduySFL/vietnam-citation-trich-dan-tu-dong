import React from 'react';
import type { CitationStyle, StyleDefinition } from '../types/citation';
import { Sparkles, Info } from 'lucide-react';

interface StyleSelectorProps {
  currentStyle: CitationStyle;
  onStyleChange: (style: CitationStyle) => void;
  styles: StyleDefinition[];
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  currentStyle,
  onStyleChange,
  styles
}) => {
  const currentDef = styles.find(s => s.id === currentStyle) || styles[0];

  return (
    <div className="bg-white rounded-[10px] p-5 shadow-sm border border-slate-200 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <label className="font-bold text-[#1b2835] text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#3a8080]" />
          <span>Chọn quy cách trích dẫn:</span>
        </label>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Thay đổi chuẩn sẽ tự động định dạng lại trích dẫn trong nội dung và danh mục
        </span>
      </div>

      {/* Style button pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {styles.map(s => {
          const isSelected = currentStyle === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onStyleChange(s.id)}
              className={`p-3 rounded-[10px] text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#3a8080] text-white border-[#3a8080] shadow-md shadow-[#3a8080]/20 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 font-semibold'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-sans tracking-wide">{s.displayName}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#dcfdc3]" />
                )}
              </div>
              <p className={`text-[11px] line-clamp-2 leading-tight ${isSelected ? 'text-[#dcfdc3]' : 'text-slate-500'}`}>
                {s.shortDescription}
              </p>
            </button>
          );
        })}
      </div>

      {/* Required Quote / Description Note */}
      {currentDef.sourceNote && (
        <div className="mt-3.5 p-3 rounded-[8px] bg-[#dcfdc3]/30 border border-[#3a8080]/30 text-xs text-[#1b2835] flex items-start gap-2 animate-in fade-in">
          <Info className="w-4 h-4 text-[#3a8080] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-[#3a8080]">Căn cứ quy chuẩn: </span>
            <span className="italic font-serif">{currentDef.sourceNote}</span>
          </div>
        </div>
      )}
    </div>
  );
};
