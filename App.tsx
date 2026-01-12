
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeView from './views/Home';
import QuranView from './views/QuranView';
import HadithView from './views/HadithView';
import BookmarksView from './views/Bookmarks';
import SettingsView from './views/Settings';
import { dataService } from './services/api';
import { DEFAULT_FONT_SIZE, DEFAULT_LINE_HEIGHT } from './constants';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [settings, setSettings] = useState({
    fontSize: Number(localStorage.getItem('fontSize')) || DEFAULT_FONT_SIZE,
    lineHeight: Number(localStorage.getItem('lineHeight')) || DEFAULT_LINE_HEIGHT
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    dataService.initializeData();
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fontSize', settings.fontSize.toString());
    localStorage.setItem('lineHeight', settings.lineHeight.toString());
  }, [settings]);

  return (
    <Router>
      <Layout theme={theme} setTheme={setTheme}>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/quran" element={<QuranView settings={settings} theme={theme} />} />
          <Route path="/quran/:surahId" element={<QuranView settings={settings} theme={theme} />} />
          <Route path="/hadith" element={<HadithView settings={settings} theme={theme} />} />
          <Route path="/bookmarks" element={<BookmarksView />} />
          <Route path="/settings" element={<SettingsView settings={settings} setSettings={setSettings} />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
