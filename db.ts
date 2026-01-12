
import Dexie, { type Table } from 'dexie';
import { Surah, Ayah, Hadith, Bookmark } from './types';

// Fix: Subclassing Dexie with a default import ensures that the TypeScript compiler correctly identifies all inherited members, including the 'version' method.
export class AppDatabase extends Dexie {
  surahs!: Table<Surah>;
  ayahs!: Table<Ayah>;
  hadiths!: Table<Hadith>;
  bookmarks!: Table<Bookmark>;

  constructor() {
    super('IslamicAppDB');
    // Fix: Using the version() method inherited from the Dexie base class to define the database schema.
    this.version(1).stores({
      surahs: 'number, name, englishName',
      ayahs: 'id, surahNumber, numberInSurah',
      hadiths: 'id, book_name_bn, hadith_number',
      bookmarks: 'id, type, refId, timestamp'
    });
  }
}

export const db = new AppDatabase();
