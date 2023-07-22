/**
 * Capitalize a one-word string.
 * @example furqon -> Furqon
 * @param str: one word string
 * @returns the formatted string
 */

export const capitalizeEveryWord = (str: string): string => {
  const firstLetter = str.charAt(0).toUpperCase()
  const restOfWord = str.slice(1).toLowerCase()
  return firstLetter + restOfWord
}
