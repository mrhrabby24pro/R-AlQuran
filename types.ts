
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  id: string; // SurahNum:AyahNum
  number: number; // Overall number
  numberInSurah: number;
  text: string; // Arabic
  bn_text: string; // Meaning
  bn_pronunciation?: string; // Transliteration
  surahNumber: number;
}

export interface Hadith {
  id: number;
  book_name_bn: string;
  chapter_name_bn: string;
  hadith_number: string;
  bangla_text: string;
  narrator_bn?: string;
}

export interface Bookmark {
  id: string;
  type: 'ayah' | 'hadith';
  refId: string;
  title: string;
  timestamp: number;
}

export interface AppSettings {
  fontSize: number;
  lineHeight: number;
  theme: 'light' | 'dark';
  lastReadAyah?: { surah: number; ayah: number };
}
