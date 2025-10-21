/**
 * 高亮文本中的匹配关键词
 */
export function highlightText(text: string, searchText: string): string {
  if (!text || !searchText.trim()) {
    return text || '';
  }
  
  const regex = new RegExp(`(${escapeRegExp(searchText)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 检查文本是否包含搜索关键词
 */
export function matchesSearch(text: string, keywords: string[], searchText: string): boolean {
  if (!searchText.trim()) {
    return true;
  }
  
  const searchLower = searchText.toLowerCase();
  const textMatch = text.toLowerCase().includes(searchLower);
  const keywordMatch = keywords.some(k => 
    k.toLowerCase().includes(searchLower)
  );
  
  return textMatch || keywordMatch;
}

/**
 * 获取高亮后的文本片段（用于预览）
 */
export function getHighlightedPreview(text: string, searchText: string, maxLength: number = 100): string {
  if (!text) return '';
  
  if (!searchText.trim()) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  
  const searchLower = searchText.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(searchLower);
  
  if (index === -1) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  
  // 以匹配位置为中心，截取前后文本
  const start = Math.max(0, index - maxLength / 2);
  const end = Math.min(text.length, start + maxLength);
  
  let preview = text.substring(start, end);
  if (start > 0) {
    preview = '...' + preview;
  }
  if (end < text.length) {
    preview = preview + '...';
  }
  
  return highlightText(preview, searchText);
}
