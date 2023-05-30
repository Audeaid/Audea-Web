export const outputLanguageList = [
  {
    displayName: 'Same as transcript',
    db: 'TRANSCRIPT',
  },
  {
    displayName: 'Arabic',
    db: 'ARABIC',
  },
  {
    displayName: 'Bahasa Indonesia',
    db: 'BAHASAINDONESIA',
  },
  {
    displayName: 'Chinese',
    db: 'CHINESE',
  },

  {
    displayName: 'English',
    db: 'ENGLISH',
  },
  {
    displayName: 'French',
    db: 'FRENCH',
  },

  {
    displayName: 'Hindi',
    db: 'HINDI',
  },
  {
    displayName: 'Japanese',
    db: 'JAPANESE',
  },
  {
    displayName: 'Russian',
    db: 'RUSSIAN',
  },
  {
    displayName: 'Spanish',
    db: 'SPANISH',
  },

  {
    displayName: 'Urdu',
    db: 'URDU',
  },
];

export const outputLanguageListWithAsk = [
  ...outputLanguageList,
  { displayName: 'Ask me everytime', db: 'ASK' },
];
