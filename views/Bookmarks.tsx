
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Bookmark } from '../types';
import { Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookmarksView: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const data = await db.bookmarks.orderBy('timestamp').reverse().toArray();
      setBookmarks(data);
    };
    fetchBookmarks();
  }, []);

  const removeBookmark = async (id: string) => {
    await db.bookmarks.delete(id);
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-6">সংরক্ষিত বুকমার্ক</h2>
      
      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 opacity-60">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Trash2 size={32} />
          </div>
          <p>আপনার কোন বুকমার্ক করা নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookmarks.map(bookmark => (
            <div key={bookmark.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md mb-2 inline-block">
                  {bookmark.type === 'ayah' ? 'আয়াত' : 'হাদিস'}
                </span>
                <h3 className="font-bold text-sm">{bookmark.title}</h3>
                <p className="text-[10px] text-gray-400 mt-1">সংরক্ষিত: {new Date(bookmark.timestamp).toLocaleDateString('bn-BD')}</p>
              </div>
              <div className="flex gap-2">
                <Link 
                  to={bookmark.type === 'ayah' ? `/quran/${bookmark.refId.split(':')[0]}` : '/hadith'}
                  className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 rounded-full transition-colors"
                >
                  <ExternalLink size={20} />
                </Link>
                <button 
                  onClick={() => removeBookmark(bookmark.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksView;
