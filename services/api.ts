
import { db } from '../db';
import { MOCK_SURAHS, MOCK_HADITHS } from '../constants';
import { Surah, Ayah, Hadith } from '../types';

/**
 * Service to handle data fetching from public APIs.
 * Using alquran.cloud as a primary source for Quranic data.
 */
export const dataService = {
  async initializeData() {
    const surahCount = await db.surahs.count();
    if (surahCount === 0) {
      // Seed with basic Surah list if empty
      await db.surahs.bulkAdd(MOCK_SURAHS as Surah[]);
      await db.hadiths.bulkAdd(MOCK_HADITHS as Hadith[]);
    }
  },

  async syncSurahList() {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const result = await response.json();
      if (result.code === 200) {
        await db.surahs.clear();
        await db.surahs.bulkAdd(result.data);
        return true;
      }
    } catch (error) {
      console.error("Failed to sync Surah list", error);
    }
    return false;
  },

  async fetchSurahDetail(surahNumber: number) {
    // Check if we have ayahs cached locally for this surah
    const cachedAyahs = await db.ayahs.where('surahNumber').equals(surahNumber).toArray();
    if (cachedAyahs.length > 0) return cachedAyahs;

    try {
      // Fetch Arabic + Bangla translation in one go using parallel requests
      const [arRes, bnRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/bn.bengali`)
      ]);

      const arData = await arRes.json();
      const bnData = await bnRes.json();

      if (arData.code === 200 && bnData.code === 200) {
        const ayahs: Ayah[] = arData.data.ayahs.map((ayah: any, index: number) => ({
          id: `${surahNumber}:${ayah.numberInSurah}`,
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: ayah.text,
          bn_text: bnData.data.ayahs[index].text,
          surahNumber: surahNumber
        }));

        await db.ayahs.bulkPut(ayahs);
        return ayahs;
      }
    } catch (error) {
      console.error("Failed to fetch surah detail", error);
    }
    return [];
  }
};
