import { TextItem } from '../types/index.js';
import { STORAGE_KEYS } from '../constants/index.js';

/**
 * 安全地设置 localStorage 项目
 */
export function safeSetItem(key: string, value: any): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error: any) {
    if (error.name === 'QuotaExceededError') {
      alert('存储空间已满，请导出数据后清理');
    } else {
      console.error('存储失败：', error);
    }
    return false;
  }
}

/**
 * 安全地获取 localStorage 项目
 */
export function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error('读取存储失败：', error);
    return defaultValue;
  }
}

/**
 * 保存文本数据到 localStorage
 */
export function saveTextData(data: TextItem[]): boolean {
  return safeSetItem(STORAGE_KEYS.TEXT_DATA, data);
}

/**
 * 从 localStorage 读取文本数据
 */
export function loadTextData(): TextItem[] {
  return safeGetItem(STORAGE_KEYS.TEXT_DATA, []);
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 创建新的文本项
 */
export function createTextItem(text: string, keywords: string[]): TextItem {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    text: text.trim(),
    keywords: keywords.filter(k => k.trim().length > 0),
    createTime: now,
    updateTime: now,
    copyCount: 0,
    isPinned: false,
    isDeleted: false
  };
}

/**
 * 更新文本项
 */
export function updateTextItem(item: TextItem, updates: Partial<TextItem>): TextItem {
  return {
    ...item,
    ...updates,
    updateTime: new Date().toISOString()
  };
}

/**
 * 验证导入数据
 */
export function validateImportData(data: any): boolean {
  if (!Array.isArray(data)) return false;
  
  return data.every(item => {
    return (
      typeof item.id === 'string' &&
      typeof item.text === 'string' &&
      Array.isArray(item.keywords) &&
      typeof item.createTime === 'string' &&
      typeof item.updateTime === 'string' &&
      typeof item.copyCount === 'number' &&
      typeof item.isPinned === 'boolean' &&
      typeof item.isDeleted === 'boolean'
    );
  });
}
