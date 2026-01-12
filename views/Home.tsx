
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Book, Star, Clock, ArrowRight } from 'lucide-react';
import { db } from '../db';
import { Surah } from '../types';

const HomeView: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [lastRead, setLastRead] = useState<{surah: number, ayah: number} | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      const data = await db.surahs.limit(5).toArray();
      setSurahs(data);
    };
    
    const savedLastRead = localStorage.getItem('lastRead');
    if (savedLastRead) {
      setLastRead(JSON.parse(savedLastRead));
    }

    fetchSurahs();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <section className="bg-emerald-600 dark:bg-emerald-700 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">আস-সালামু আলাইকুম</h2>
          <p className="opacity-90 text-sm mb-4">আপনার দিনটি কুরআন ও সুন্নাহর আলোয় আলোকিত হোক।</p>
          
          {lastRead && (
            <Link 
              to={`/quran/${lastRead.surah}`}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl backdrop-blur-md transition-all text-sm font-medium"
            >
              <Clock size={16} />
              পড়া চালিয়ে যান: সূরা {lastRead.surah}, আয়াত {lastRead.ayah}
            </Link>
          )}
        </div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      </section>

      {/* Quick Access */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/quran" className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <BookOpen size={24} />
          </div>
          <span className="font-bold">আল-কুরআন</span>
        </Link>
        <Link to="/hadith" className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Book size={24} />
          </div>
          <span className="font-bold">হাদিস</span>
        </Link>
      </div>

      {/* Featured Surahs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">সূরা সমূহ</h3>
          <Link to="/quran" className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-1">
            সব দেখুন <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {surahs.map((surah) => (
            <Link 
              key={surah.number}
              to={`/quran/${surah.number}`}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-emerald-300 transition-all group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-slate-700 font-bold text-emerald-600">
                {surah.number}
              </div>
              <div className="flex-1">
                <h4 className="font-bold">{surah.englishName}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{surah.numberOfAyahs} আয়াত • {surah.englishNameTranslation}</p>
              </div>
              <div className="font-quran text-xl text-right">
                {surah.name}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
