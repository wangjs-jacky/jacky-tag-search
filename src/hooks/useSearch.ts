import { useState, useCallback, useMemo } from 'react';
import { TextItem, ViewType } from '../types/index.js';
import { matchesSearch } from '../utils/highlight.js';

/**
 * 搜索功能 Hook
 */
export function useSearch(items: TextItem[], currentView: ViewType) {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // 根据当前视图过滤数据
  const filteredByView = useMemo(() => {
    let filtered = items;
    
    switch (currentView) {
      case 'all':
        filtered = items.filter(item => !item.isDeleted);
        break;
      case 'pinned':
        filtered = items.filter(item => item.isPinned && !item.isDeleted);
        break;
      case 'trash':
        filtered = items.filter(item => item.isDeleted);
        break;
    }
    
    // 排序：置顶的在前，然后按创建时间倒序
    return filtered.sort((a, b) => {
      // 先按置顶排序
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // 如果都是置顶，按置顶时间倒序
      if (a.isPinned && b.isPinned) {
        return new Date(b.pinnedTime!).getTime() - new Date(a.pinnedTime!).getTime();
      }
      
      // 否则按创建时间倒序
      return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
    });
  }, [items, currentView]);

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!searchText.trim()) {
      return filteredByView;
    }
    
    return filteredByView.filter(item => 
      matchesSearch(item.text, item.keywords, searchText)
    );
  }, [filteredByView, searchText]);

  // 开始搜索
  const startSearch = useCallback(() => {
    setIsSearching(true);
  }, []);

  // 结束搜索
  const endSearch = useCallback(() => {
    setIsSearching(false);
    setSearchText('');
  }, []);

  // 更新搜索文本
  const updateSearchText = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  return {
    searchText,
    isSearching,
    searchResults,
    startSearch,
    endSearch,
    updateSearchText,
    clearSearch
  };
}
