import dayjs from 'dayjs';

/**
 * 格式化日期显示
 */
export function formatDate(dateString: string, format: string = 'YYYY-MM-DD'): string {
  return dayjs(dateString).format(format);
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(dateString: string): string {
  const now = dayjs();
  const date = dayjs(dateString);
  const diffInMinutes = now.diff(date, 'minute');
  const diffInHours = now.diff(date, 'hour');
  const diffInDays = now.diff(date, 'day');
  
  if (diffInMinutes < 1) {
    return '刚刚';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`;
  } else {
    return formatDate(dateString);
  }
}

/**
 * 获取当前时间戳
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * 检查日期是否在今天
 */
export function isToday(dateString: string): boolean {
  return dayjs(dateString).isSame(dayjs(), 'day');
}

/**
 * 检查日期是否在昨天
 */
export function isYesterday(dateString: string): boolean {
  return dayjs(dateString).isSame(dayjs().subtract(1, 'day'), 'day');
}

/**
 * 获取友好的日期显示
 */
export function getFriendlyDate(dateString: string): string {
  if (isToday(dateString)) {
    return '今天';
  } else if (isYesterday(dateString)) {
    return '昨天';
  } else {
    return formatDate(dateString);
  }
}
