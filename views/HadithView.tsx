
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Hadith } from '../types';
import { Share2, Bookmark as BookmarkIcon } from 'lucide-react';

interface HadithViewProps {
  settings: { fontSize: number; lineHeight: number };
  theme: 'light' | 'dark';
}

const HadithView: React.FC<HadithViewProps> = ({ settings, theme }) => {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);

  useEffect(() => {
    const fetchHadiths = async () => {
      const data = await db.hadiths.toArray();
      setHadiths(data);
    };
    fetchHadiths();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-6">হাদিস সংগ্রহ</h2>
      
      {hadiths.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          কোন হাদিস পাওয়া যায়নি।
        </div>
      ) : (
        hadiths.map(hadith => (
          <div key={hadith.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4 pb-3 border-b dark:border-slate-700">
              <div>
                <h3 className="font-bold text-emerald-600 dark:text-emerald-400">{hadith.book_name_bn}</h3>
                <p className="text-xs text-gray-500">অধ্যায়: {hadith.chapter_name_bn} • নং {hadith.hadith_number}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400">
                  <BookmarkIcon size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <p 
                style={{ 
                  fontSize: `${settings.fontSize}px`, 
                  lineHeight: settings.lineHeight 
                }}
                className="text-gray-900 dark:text-gray-100"
              >
                {hadith.bangla_text}
              </p>
              {hadith.narrator_bn && (
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-500">
                  — {hadith.narrator_bn}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HadithView;
