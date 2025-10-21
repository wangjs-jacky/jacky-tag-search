import { TextItem } from '../types/index.js';
import { TRASH_CONFIG } from '../constants/index.js';
import { getCurrentTimestamp } from './date.js';

/**
 * 检查并清理超过指定天数的已删除笔记
 */
export function autoCleanTrash(items: TextItem[]): TextItem[] {
  const now = new Date().getTime();
  const cleanThreshold = TRASH_CONFIG.autoCleanDays * 24 * 60 * 60 * 1000;
  
  return items.filter(item => {
    if (item.isDeleted && item.deletedTime) {
      const deletedTime = new Date(item.deletedTime).getTime();
      const timeSinceDeleted = now - deletedTime;
      
      // 如果超过清理阈值，永久删除（从数组中移除）
      if (timeSinceDeleted > cleanThreshold) {
        return false;
      }
    }
    return true;
  });
}

/**
 * 将笔记移到回收站
 */
export function moveToTrash(item: TextItem): TextItem {
  return {
    ...item,
    isDeleted: true,
    deletedTime: getCurrentTimestamp(),
    updateTime: getCurrentTimestamp()
  };
}

/**
 * 从回收站恢复笔记
 */
export function restoreFromTrash(item: TextItem): TextItem {
  return {
    ...item,
    isDeleted: false,
    deletedTime: undefined,
    updateTime: getCurrentTimestamp()
  };
}

/**
 * 永久删除笔记
 */
export function permanentDelete(items: TextItem[], id: string): TextItem[] {
  return items.filter(item => item.id !== id);
}

/**
 * 批量永久删除笔记
 */
export function batchPermanentDelete(items: TextItem[], ids: string[]): TextItem[] {
  return items.filter(item => !ids.includes(item.id));
}

/**
 * 清空回收站
 */
export function clearTrash(items: TextItem[]): TextItem[] {
  return items.filter(item => !item.isDeleted);
}

/**
 * 获取回收站统计信息
 */
export function getTrashStats(items: TextItem[]): {
  totalDeleted: number;
  willBeCleaned: number;
  oldestDeleted?: string;
} {
  const deletedItems = items.filter(item => item.isDeleted);
  const now = new Date().getTime();
  const cleanThreshold = TRASH_CONFIG.autoCleanDays * 24 * 60 * 60 * 1000;
  
  const willBeCleaned = deletedItems.filter(item => {
    if (!item.deletedTime) return false;
    const deletedTime = new Date(item.deletedTime).getTime();
    return (now - deletedTime) > cleanThreshold;
  }).length;
  
  const oldestDeleted = deletedItems.length > 0 
    ? deletedItems.reduce((oldest, item) => {
        if (!item.deletedTime) return oldest;
        if (!oldest) return item.deletedTime;
        return new Date(item.deletedTime) < new Date(oldest) ? item.deletedTime : oldest;
      }, undefined as string | undefined)
    : undefined;
  
  return {
    totalDeleted: deletedItems.length,
    willBeCleaned,
    oldestDeleted
  };
}
