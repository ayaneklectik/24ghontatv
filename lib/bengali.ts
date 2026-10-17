const BENGALI_DIGITS = '০১২৩৪৫৬৭৮৯';

export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}

export function formatEnglishDate(date: Date): string {
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return toBengaliDigits(formatted);
}


/**
 * Parse publication timestamps consistently for Bangladesh.
 * SQL/ISO timestamps without an explicit timezone are treated as Dhaka local
 * wall time; timestamps with Z or an offset remain absolute instants.
 */
export function parseBengaliDateTime(value?: string | null): Date | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  let normalized = raw.replace(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)$/,
    '$1T$2',
  );

  const hasTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(normalized);
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  if (hasTime && !hasTimezone) normalized += '+06:00';

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatBengaliDateTime(value?: string | null): string {
  const date = parseBengaliDateTime(value);
  if (!date) return '';

  return new Intl.DateTimeFormat('bn-BD', {
    timeZone: 'Asia/Dhaka',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatBengaliGregorianDate(date: Date): string {
  return date.toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatBengaliDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const banglaMonths = [
    'বৈশাখ',
    'জ্যৈষ্ঠ',
    'আষাঢ়',
    'শ্রাবণ',
    'ভাদ্র',
    'আশ্বিন',
    'কার্তিক',
    'অগ্রহায়ণ',
    'পৌষ',
    'মাঘ',
    'ফাল্গুন',
    'চৈত্র',
  ];
  const monthStarts = [
    [0, 15, 9],
    [1, 14, 10],
    [2, 15, 11],
    [3, 14, 0],
    [4, 15, 1],
    [5, 15, 2],
    [6, 16, 3],
    [7, 16, 4],
    [8, 16, 5],
    [9, 16, 6],
    [10, 15, 7],
    [11, 15, 8],
  ] as const;

  const currentDate = Date.UTC(year, month, day);
  let activeStart = new Date(Date.UTC(year - 1, 11, 15));
  let monthIndex = 8;

  for (const [gregorianMonth, startDay, banglaIndex] of monthStarts) {
    const start = new Date(Date.UTC(year, gregorianMonth, startDay));
    if (start.getTime() > currentDate) break;
    activeStart = start;
    monthIndex = banglaIndex;
  }

  for (const [gregorianMonth, startDay, banglaIndex] of monthStarts) {
    const start = new Date(Date.UTC(year + 1, gregorianMonth, startDay));
    if (start.getTime() > currentDate) break;
    activeStart = start;
    monthIndex = banglaIndex;
  }

  const banglaDay = Math.floor((currentDate - activeStart.getTime()) / 86_400_000) + 1;
  const activeYear = activeStart.getUTCFullYear();
  const activeMonth = activeStart.getUTCMonth();
  let activeBanglaYear = activeYear - 593;
  if (activeMonth < 3 || (activeMonth === 3 && activeStart.getUTCDate() < 14)) {
    activeBanglaYear -= 1;
  }

  return `${toBengaliDigits(banglaDay)} ${banglaMonths[monthIndex]} ${toBengaliDigits(activeBanglaYear)}`;
}
