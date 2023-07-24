/**
 * Calculate the amount of hours until working hours GMT + 7
 * @returns number
 */

import moment from 'moment'

export function hoursBeforeOpen() {
  const currentTime = moment().utcOffset('+07:00')
  const endOfWorkingHours = moment().utcOffset('+07:00').set({ hour: 17, minute: 0, second: 0 })

  if (currentTime.isAfter(endOfWorkingHours)) {
    const startOfNextWorkingDay = moment().utcOffset('+07:00').add(1, 'days').set({ hour: 9, minute: 0, second: 0 })
    return startOfNextWorkingDay.diff(currentTime, 'hours', true)
  } else {
    const startOfCurrentWorkingDay = moment().utcOffset('+07:00').set({ hour: 9, minute: 0, second: 0 })
    return startOfCurrentWorkingDay.diff(currentTime, 'hours', true)
  }
}
