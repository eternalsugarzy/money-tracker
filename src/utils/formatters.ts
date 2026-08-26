export function formatCurrency(amount: number, options?: { showSign?: boolean }): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const formattedNumber = absAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (isNegative) {
    return `-Rp ${formattedNumber}`;
  }
  if (options?.showSign && amount > 0) {
    return `+Rp ${formattedNumber}`;
  }
  return `Rp ${formattedNumber}`;
}

export function formatCompactCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    const val = (abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '');
    return `${sign}Rp ${val}M`;
  }
  if (abs >= 1_000_000) {
    const val = (abs / 1_000_000).toFixed(1).replace(/\.0$/, '');
    return `${sign}Rp ${val}jt`;
  }
  if (abs >= 10_000) {
    const val = (abs / 1_000).toFixed(0);
    return `${sign}Rp ${val}rb`;
  }
  return `${sign}Rp ${abs}`;
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MONTH_SHORT_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

const DAY_NAMES_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

export function formatDateLabel(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate.getTime() === today.getTime()) {
    return 'Hari ini';
  }
  if (targetDate.getTime() === yesterday.getTime()) {
    return 'Kemarin';
  }

  const day = targetDate.getDate();
  const month = MONTH_SHORT_ID[targetDate.getMonth()];
  const year = targetDate.getFullYear();
  const currentYear = today.getFullYear();

  if (year === currentYear) {
    return `${day} ${month}`;
  }
  return `${day} ${month} ${year}`;
}

export function formatFullDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const dayName = DAY_NAMES_ID[date.getDay()];
  const day = date.getDate();
  const monthName = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${monthName} ${year}`;
}

export function formatMonthYear(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return `${MONTH_NAMES_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatPercentage(percentage: number): string {
  return `${Math.round(percentage)}%`;
}

export function formatDetailedDateHeader(dateInput: string | Date): { relative: string; fullDate: string } {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const dayName = DAY_NAMES_ID[targetDate.getDay()];
  const day = targetDate.getDate();
  const monthName = MONTH_NAMES_ID[targetDate.getMonth()];
  const year = targetDate.getFullYear();
  const fullDate = `${dayName}, ${day} ${monthName} ${year}`;

  let relative = '';
  if (targetDate.getTime() === today.getTime()) {
    relative = 'HARI INI';
  } else if (targetDate.getTime() === yesterday.getTime()) {
    relative = 'KEMARIN';
  }

  return { relative, fullDate };
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
