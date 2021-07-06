import config from "../../config";

/**
 * Returns the next date for the purposes of calculating expiry times.
 * @param hour the hour to set
 * @param minute the minute to set
 * @returns the next Date with the given hour and minute
 */
export const getNextDate = (
  hour = config.REFRESH_HOUR,
  minute = config.REFRESH_MINUTE
): Date => {
  const d = new Date(Date.now());
  d.setHours(hour, minute, 0, 0);
  if (d.getTime() < Date.now()) {
    const curDate = d.getDate();
    d.setDate(curDate + 1);
  }
  return d;
};
