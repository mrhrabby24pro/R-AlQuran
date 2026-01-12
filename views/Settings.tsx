
import React from 'react';
import { Type, Minus, Plus, RefreshCw, Trash2, Info } from 'lucide-react';
import { db } from '../db';
import { dataService } from '../services/api';

interface SettingsProps {
  settings: { fontSize: number; lineHeight: number };
  setSettings: React.Dispatch<React.SetStateAction<{ fontSize: number; lineHeight: number }>>;
}

const SettingsView: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  
  const adjustFont = (amount: number) => {
    setSettings(prev => ({ ...prev, fontSize: Math.max(12, Math.min(40, prev.fontSize + amount)) }));
  };

  const adjustLineHeight = (amount: number) => {
    setSettings(prev => ({ ...prev, lineHeight: Math.max(1.2, Math.min(2.5, prev.lineHeight + amount)) }));
  };

  const clearCache = async () => {
    if (confirm('আপনি কি নিশ্চিত যে সমস্ত ক্যাশে করা ডাটা মুছে ফেলতে চান? এটি শুধুমাত্র আয়াতগুলো মুছবে, বুকমার্ক নয়।')) {
      await db.ayahs.clear();
      alert('ক্যাশে সফলভাবে মুছে ফেলা হয়েছে।');
    }
  };

  const syncAll = async () => {
    alert('ডাটা সিন্ক্রোনাইজেশন শুরু হয়েছে...');
    await dataService.syncSurahList();
    alert('সুরা তালিকা আপডেট করা হয়েছে।');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">সেটিংস</h2>

      {/* Typography Settings */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-6">
        <div className="flex items-center gap-3 text-emerald-600 border-b dark:border-slate-700 pb-3">
          <Type size={20} />
          <h3 className="font-bold">ফন্ট ও ডিসপ্লে</h3>
        </div>

        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">ফন্ট সাইজ</span>
            <div className="flex items-center gap-4">
              <button onClick={() => adjustFont(-2)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-emerald-100"><Minus size={16} /></button>
              <span className="w-8 text-center font-bold">{settings.fontSize}</span>
              <button onClick={() => adjustFont(2)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-emerald-100"><Plus size={16} /></button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">লাইন হাইট</span>
            <div className="flex items-center gap-4">
              <button onClick={() => adjustLineHeight(-0.1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-emerald-100"><Minus size={16} /></button>
              <span className="w-8 text-center font-bold">{settings.lineHeight.toFixed(1)}</span>
              <button onClick={() => adjustLineHeight(0.1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-emerald-100"><Plus size={16} /></button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-500 mb-2">প্রিভিউ টেক্সট:</p>
          <p style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineHeight }}>
            এটি একটি উদাহরণ টেক্সট যা আপনার ফন্ট সাইজ এবং লাইন হাইট দেখায়।
          </p>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
        <h3 className="font-bold border-b dark:border-slate-700 pb-3 text-emerald-600">ডাটা ম্যানেজমেন্ট</h3>
        
        <div className="space-y-3 pt-2">
          <button 
            onClick={syncAll}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <RefreshCw size={18} className="text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-bold">সার্ভার থেকে সিঙ্ক করুন</p>
                <p className="text-[10px] text-gray-500">নতুন আপডেট চেক করতে এটি ব্যবহার করুন</p>
              </div>
            </div>
          </button>

          <button 
            onClick={clearCache}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={18} className="text-red-600" />
              <div className="text-left">
                <p className="text-sm font-bold text-red-600">ক্যাশে মুছে ফেলুন</p>
                <p className="text-[10px] text-gray-500 text-red-400">অফলাইন ডাটা পরিষ্কার করুন</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* About */}
      <section className="text-center pb-8">
        <div className="inline-flex items-center gap-2 text-gray-400 mb-2">
          <Info size={16} />
          <span className="text-xs uppercase tracking-wider font-bold">অ্যাপ সম্পর্কে</span>
        </div>
        <p className="text-sm text-gray-500">নূর-এ-হিদায়াত - একটি সম্পূর্ণ অফলাইন ইসলামিক অ্যাপ</p>
        <p className="text-xs text-gray-400 mt-1">ডেভলপড বাই: আপনার নাম</p>
      </section>
    </div>
  );
};

export default SettingsView;
