const BENGALI_DIGITS = '০১২৩৪৫৬৭৮৯';

export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}

export function formatEnglishDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
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
  let banglaYear = year - 593;
  if (month < 3 || (month === 3 && day < 14)) banglaYear -= 1;

  const monthStarts = [
    [3, 14, 0],
    [4, 15, 1],
    [5, 15, 2],
    [6, 16, 3],
    [7, 16, 4],
    [8, 16, 5],
    [9, 16, 6],
    [10, 15, 7],
    [11, 15, 8],
    [0, 15, 9],
    [1, 14, 10],
    [2, 15, 11],
  ] as const;

  let monthIndex = 0;
  let banglaDay = 1;
  for (let index = monthStarts.length - 1; index >= 0; index -= 1) {
    const [gregorianMonth, startDay, banglaIndex] = monthStarts[index];
    if (month > gregorianMonth || (month === gregorianMonth && day >= startDay)) {
      monthIndex = banglaIndex;
      banglaDay = day - startDay + 1;
      break;
    }
  }

  if (banglaDay <= 0) {
    monthIndex = (monthIndex + 11) % 12;
    banglaDay += 30;
  }

  const weekday = date.toLocaleDateString('bn-BD', { weekday: 'long' });
  return `${weekday}, ${toBengaliDigits(banglaDay)} ${banglaMonths[monthIndex]} ${toBengaliDigits(banglaYear)}`;
}
