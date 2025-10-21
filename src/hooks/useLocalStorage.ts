import { useState, useEffect, useCallback } from 'react';
import { TextItem } from '../types/index.js';
import { loadTextData, saveTextData } from '../utils/storage.js';

/**
 * localStorage 管理 Hook
 */
export function useLocalStorage() {
  const [items, setItems] = useState<TextItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载数据
  useEffect(() => {
    try {
      const data = loadTextData();
      setItems(data);
    } catch (error) {
      console.error('加载数据失败：', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 保存数据
  const saveData = useCallback((newItems: TextItem[]) => {
    try {
      const success = saveTextData(newItems);
      if (success) {
        setItems(newItems);
      }
      return success;
    } catch (error) {
      console.error('保存数据失败：', error);
      return false;
    }
  }, []);

  // 添加新项目
  const addItem = useCallback((item: TextItem) => {
    const newItems = [...items, item];
    return saveData(newItems);
  }, [items, saveData]);

  // 更新项目
  const updateItem = useCallback((id: string, updates: Partial<TextItem>) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, ...updates, updateTime: new Date().toISOString() } : item
    );
    return saveData(newItems);
  }, [items, saveData]);

  // 删除项目
  const deleteItem = useCallback((id: string) => {
    const newItems = items.filter(item => item.id !== id);
    return saveData(newItems);
  }, [items, saveData]);

  // 批量更新
  const batchUpdate = useCallback((updates: Array<{ id: string; updates: Partial<TextItem> }>) => {
    const newItems = items.map(item => {
      const update = updates.find(u => u.id === item.id);
      if (update) {
        return { ...item, ...update.updates, updateTime: new Date().toISOString() };
      }
      return item;
    });
    return saveData(newItems);
  }, [items, saveData]);

  // 批量删除
  const batchDelete = useCallback((ids: string[]) => {
    const newItems = items.filter(item => !ids.includes(item.id));
    return saveData(newItems);
  }, [items, saveData]);

  // 替换所有数据
  const replaceAll = useCallback((newItems: TextItem[]) => {
    return saveData(newItems);
  }, [saveData]);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    batchUpdate,
    batchDelete,
    replaceAll,
    saveData
  };
}
