import { ViewType, ViewConfig } from '../types/index.js';
import { HiDocumentText, HiBookmark, HiTrash } from 'react-icons/hi';

// 存储键名
export const STORAGE_KEYS = {
  TEXT_DATA: 'text-manager-data',
  SETTINGS: 'text-manager-settings'
} as const;

// 视图配置映射
export const VIEW_CONFIGS: Record<ViewType, ViewConfig> = {
  all: {
    type: 'all',
    title: '全部笔记',
    icon: <HiDocumentText />,
    description: '显示所有未删除的笔记'
  },
  pinned: {
    type: 'pinned',
    title: '已置顶',
    icon: <HiBookmark />,
    description: '显示已置顶的笔记'
  },
  trash: {
    type: 'trash',
    title: '回收站',
    icon: <HiTrash />,
    description: '显示已删除的笔记，30天后自动清空'
  }
};

// 颜色配置
export const COLORS = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  text: {
    primary: '#262626',
    secondary: '#8c8c8c',
    disabled: '#bfbfbf'
  },
  border: '#d9d9d9',
  background: '#f5f5f5',
  white: '#ffffff',
  highlight: '#fffbe6'
} as const;

// 关键字标签颜色
export const KEYWORD_COLORS = [
  '#1890ff', '#52c41a', '#faad14', '#f5222d',
  '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'
] as const;

// 动画配置
export const ANIMATION = {
  duration: 300,
  easing: 'ease-in-out'
} as const;

// 搜索配置
export const SEARCH_CONFIG = {
  debounceDelay: 300,
  minSearchLength: 1
} as const;

// 回收站配置
export const TRASH_CONFIG = {
  autoCleanDays: 30
} as const;

// 分页配置
export const PAGINATION = {
  pageSize: 20,
  loadMoreThreshold: 5
} as const;
