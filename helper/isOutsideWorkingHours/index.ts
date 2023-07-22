/**
 * Check if right now is outside working hours
 * @returns boolean: true if it is outside working hour
 */

export function isOutsideWorkingHours() {
  const currentTime = new Date()
  const currentHours = currentTime.getHours()
  const currentOffset = currentTime.getTimezoneOffset() / 60
  const gmtPlus7Hours = currentHours + currentOffset + 7 // Add 7 hours for GMT+7

  return gmtPlus7Hours < 9 || gmtPlus7Hours >= 17
}
