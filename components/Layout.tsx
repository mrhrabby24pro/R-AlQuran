
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Bookmark, Book, Settings, Menu, X, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, theme, setTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { name: 'হোম', icon: Home, path: '/' },
    { name: 'আল-কুরআন', icon: BookOpen, path: '/quran' },
    { name: 'হাদিস', icon: Book, path: '/hadith' },
    { name: 'বুকমার্ক', icon: Bookmark, path: '/bookmarks' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 flex items-center justify-between px-4 py-3 shadow-sm ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">নূর-এ-হিদায়াত</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link to="/settings" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <Settings size={20} />
          </Link>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-[70] h-full w-72 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${theme === 'dark' ? 'bg-slate-800 border-r border-slate-700' : 'bg-white border-r border-gray-200 shadow-xl'}`}>
        <div className="p-6 flex items-center justify-between border-b dark:border-slate-700">
          <span className="text-lg font-bold text-emerald-600">মেনু</span>
          <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
            <X size={24} />
          </button>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'hover:bg-gray-50 dark:hover:bg-slate-700'}`}
            >
              <item.icon size={22} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <p>অফলাইন মোড সক্রিয়</p>
          <p className="mt-1 opacity-70">ভার্সন ১.০.০</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto pb-20 p-4 min-h-[calc(100vh-64px)]">
        {children}
      </main>

      {/* Bottom Nav for Mobile Quick Access */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-50 px-6 py-2 flex justify-between items-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]'}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === item.path ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Layout;
