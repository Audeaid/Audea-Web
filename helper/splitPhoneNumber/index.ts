/**
 * Phone number formatter. Usually used for formatting WhatsApp messages.
 * @example +62812121212 -> 62812121212
 * @param phoneNumber: internationally format phone number +62812121212
 * @returns the formatted string
 */

export function splitPhoneNumber(phoneNumber: string): string {
  let number = phoneNumber.replace(/\D/g, '') // Remove non-digit characters
  if (number.startsWith('+')) {
    number = number.substring(1) // Remove leading plus sign
  }
  return number
}
