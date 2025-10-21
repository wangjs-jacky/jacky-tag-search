import React from 'react';

// 文本项接口
export interface TextItem {
  id: string;                    // 唯一标识
  text: string;                   // 文本内容
  keywords: string[];             // 关键字数组
  createTime: string;             // 创建时间 (ISO 8601 格式)
  updateTime: string;             // 修改时间 (ISO 8601 格式)
  copyCount: number;              // 复制次数（保留用于统计）
  isPinned: boolean;              // 是否置顶
  isDeleted: boolean;             // 是否在回收站
  deletedTime?: string;           // 删除时间（移到回收站的时间）
  pinnedTime?: string;            // 置顶时间（用于置顶排序）
}

// 视图类型
export type ViewType = 'all' | 'pinned' | 'trash';

// 视图配置
export interface ViewConfig {
  type: ViewType;
  title: string;
  icon: React.ReactNode;
  description: string;
}

// 操作类型
export type ActionType = 'copy' | 'pin' | 'unpin' | 'delete' | 'restore' | 'permanentDelete' | 'multiSelect';

// 操作菜单项
export interface ActionItem {
  type: ActionType;
  label: string;
  icon: string;
  danger?: boolean;
}

// 搜索状态
export interface SearchState {
  isSearching: boolean;
  searchText: string;
  results: TextItem[];
}

// 多选状态
export interface MultiSelectState {
  isMultiSelecting: boolean;
  selectedIds: string[];
}

// 导入导出选项
export interface ImportExportOptions {
  mode: 'merge' | 'replace';
  data: TextItem[];
}
