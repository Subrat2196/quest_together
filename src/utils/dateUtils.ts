import { format, isToday, isYesterday, startOfWeek, parseISO, differenceInCalendarDays } from 'date-fns';

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDate(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEE, MMM d');
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'h:mm a');
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function getWeekStart(dateStr?: string): string {
  const d = dateStr ? parseISO(dateStr) : new Date();
  return format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

export function isConsecutiveDay(lastDate: string | null, currentDate: string): boolean {
  if (!lastDate) return false;
  const diff = differenceInCalendarDays(parseISO(currentDate), parseISO(lastDate));
  return diff === 1;
}

export function isSameDay(d1: string, d2: string): boolean {
  return d1 === d2;
}

export function getWeekNumber(dateStr?: string): number {
  const d = dateStr ? parseISO(dateStr) : new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}
