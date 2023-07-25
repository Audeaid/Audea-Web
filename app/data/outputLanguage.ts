export type IOutputLanguageType =
  | 'TRANSCRIPT'
  | 'ENGLISH'
  | 'BAHASAINDONESIA'
  | 'CHINESE'
  | 'HINDI'
  | 'JAPANESE'
  | 'SPANISH'
  | 'FRENCH'
  | 'RUSSIAN'
  | 'URDU'
  | 'ARABIC'
  | 'ASK'

export const outputLanguageList = [
  {
    label: 'Same as transcript',
    value: 'same as transcript',
    db: 'TRANSCRIPT',
  },
  {
    label: 'Arabic',
    value: 'arabic',
    db: 'ARABIC',
  },
  {
    label: 'Bahasa Indonesia',
    value: 'bahasa indonesia',
    db: 'BAHASAINDONESIA',
  },
  {
    label: 'Chinese',
    value: 'chinese',
    db: 'CHINESE',
  },

  {
    label: 'English',
    value: 'english',
    db: 'ENGLISH',
  },
  {
    label: 'French',
    value: 'french',
    db: 'FRENCH',
  },

  {
    label: 'Hindi',
    value: 'hindi',
    db: 'HINDI',
  },
  {
    label: 'Japanese',
    value: 'japanese',
    db: 'JAPANESE',
  },
  {
    label: 'Russian',
    value: 'russian',
    db: 'RUSSIAN',
  },
  {
    label: 'Spanish',
    value: 'spanish',
    db: 'SPANISH',
  },

  {
    label: 'Urdu',
    value: 'urdu',
    db: 'URDU',
  },
]

export const outputLanguageListWithAsk = [
  ...outputLanguageList,
  { label: 'Ask me everytime', value: 'ask me everytime', db: 'ASK' },
]
