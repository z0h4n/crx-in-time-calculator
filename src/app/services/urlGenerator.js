const host = 'mitr.greythr.com';
const path = 'v2/attendance/info/loadDaywiseAttendanceData';

export default function generate(date, month, year) {
  const search = new URLSearchParams();
  search.set('attDate', `${date} ${month} ${year}`);
  search.set('startDate', `01 ${month} ${year}`);
  search.set('_', Date.now());
  return `https://${host}/${path}?${search.toString()}`;
}
