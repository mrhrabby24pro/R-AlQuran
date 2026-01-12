
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Bookmark as BookmarkIcon, Download } from 'lucide-react';
import { db } from '../db';
import { dataService } from '../services/api';
import { Surah, Ayah } from '../types';

interface QuranViewProps {
  settings: { fontSize: number; lineHeight: number };
  theme: 'light' | 'dark';
}

const QuranView: React.FC<QuranViewProps> = ({ settings, theme }) => {
  const { surahId } = useParams<{ surahId: string }>();
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSurahs = async () => {
      const data = await db.surahs.toArray();
      setSurahs(data);
    };
    fetchSurahs();
  }, []);

  useEffect(() => {
    if (surahId) {
      loadSurah(parseInt(surahId));
    }
  }, [surahId]);

  const loadSurah = async (num: number) => {
    setLoading(true);
    const surahData = await db.surahs.where('number').equals(num).first();
    setCurrentSurah(surahData || null);
    
    const ayahData = await dataService.fetchSurahDetail(num);
    setAyahs(ayahData);
    setLoading(false);

    // Update last read
    localStorage.setItem('lastRead', JSON.stringify({ surah: num, ayah: 1 }));
  };

  const toggleBookmark = async (ayah: Ayah) => {
    const exists = await db.bookmarks.get(`${ayah.id}`);
    if (exists) {
      await db.bookmarks.delete(`${ayah.id}`);
    } else {
      await db.bookmarks.add({
        id: ayah.id,
        type: 'ayah',
        refId: ayah.id,
        title: `সূরা ${currentSurah?.englishName}, আয়াত ${ayah.numberInSurah}`,
        timestamp: Date.now()
      });
    }
  };

  if (!surahId) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">সূরা তালিকা</h2>
        <div className="grid grid-cols-1 gap-3">
          {surahs.map(s => (
            <button
              key={s.number}
              onClick={() => navigate(`/quran/${s.number}`)}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors text-left"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 font-bold">
                {s.number}
              </div>
              <div className="flex-1">
                <p className="font-bold">{s.englishName}</p>
                <p className="text-xs text-gray-500">{s.numberOfAyahs} আয়াত • {s.englishNameTranslation}</p>
              </div>
              <div className="font-quran text-xl">{s.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/quran')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{currentSurah?.englishName}</h2>
          <p className="text-xs text-gray-500">{currentSurah?.englishNameTranslation} • {currentSurah?.revelationType}</p>
        </div>
        <div className="font-quran text-2xl text-emerald-600">{currentSurah?.name}</div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">ডাটা লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentSurah?.number !== 1 && currentSurah?.number !== 9 && (
            <div className="text-center font-quran text-2xl py-8 text-emerald-600 border-b dark:border-slate-700">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}
          {ayahs.map(ayah => (
            <div 
              key={ayah.id} 
              className={`p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 transition-all`}
            >
              <div className="flex items-center justify-between mb-4 border-b border-gray-50 dark:border-slate-700 pb-2">
                <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">
                  {currentSurah?.number}:{ayah.numberInSurah}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => toggleBookmark(ayah)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400">
                    <BookmarkIcon size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <p 
                dir="rtl" 
                className="font-quran mb-6 text-right leading-relaxed" 
                style={{ fontSize: `${settings.fontSize * 1.5}px` }}
              >
                {ayah.text}
              </p>
              
              <div className="space-y-3">
                <p 
                  className="text-gray-900 dark:text-gray-100 font-medium" 
                  style={{ 
                    fontSize: `${settings.fontSize}px`,
                    lineHeight: settings.lineHeight
                  }}
                >
                  {ayah.bn_text}
                </p>
                {ayah.bn_pronunciation && (
                  <p className="text-gray-500 text-sm italic">
                    {ayah.bn_pronunciation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuranView;
