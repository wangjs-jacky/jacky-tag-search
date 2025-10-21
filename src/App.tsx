import React, { useState, useCallback } from 'react';
import { TextItem, ViewType, ActionType } from './types/index.js';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { TextCard } from './components/TextCard.js';
import { TextDetail } from './components/TextDetail.js';
import { TextEditor } from './components/TextEditor.js';
import { EmptyState } from './components/EmptyState.js';
import { FloatingButton } from './components/FloatingButton.js';
import { ActionSheet } from './components/ActionSheet.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useSearch } from './hooks/useSearch.js';
import { copyToClipboard, showCopySuccess, showCopyError } from './utils/copy.js';
import { autoCleanTrash, moveToTrash, restoreFromTrash } from './utils/trash.js';
import { validateImportData } from './utils/storage.js';
import './App.css';

// 示例数据
const initialData: TextItem[] = [
  {
    id: "1",
    text: "预计将来会有防雷击电磁脉冲的电气和电子系统，应在设计时将建筑物的金属支撑物、金属框架或钢筋混泥土的钢筋自然构件、金属管道、配电的保护接地系统与防雷装置组成一个接地系统，并应在需要处预埋电位连接板。—公配房、环网室的接地系统建议与建筑主体的接地系统连在一起。（《建筑防雷设计规范》(GB50057-2010)、《电气装置安装工程 接地装置施工及验收规范》(GB50169-2016)）",
    keywords: ["防雷接地", "建筑规范", "接地系统"],
    createTime: "2025-10-19T10:30:00.000Z",
    updateTime: "2025-10-19T10:30:00.000Z",
    copyCount: 0,
    isPinned: false,
    isDeleted: false
  },
  {
    id: "2",
    text: "住宅建筑应按套型设计，套内空间和设施应能满足安全、舒适、卫生等生活起居需求。套型应由卧室、起居室(厅)、厨房和卫生间等组成。（《住宅设计规范》GB50096-2011）",
    keywords: ["住宅设计", "套型设计", "建筑规范"],
    createTime: "2025-10-18T14:20:00.000Z",
    updateTime: "2025-10-18T14:20:00.000Z",
    copyCount: 2,
    isPinned: false,
    isDeleted: false
  },
  {
    id: "3",
    text: "建筑高度大于100m的民用建筑，其楼板的耐火极限不应低于2.00h。（《建筑设计防火规范》GB50016-2014）",
    keywords: ["防火规范", "高层建筑", "耐火极限"],
    createTime: "2025-10-17T09:15:00.000Z",
    updateTime: "2025-10-17T09:15:00.000Z",
    copyCount: 5,
    isPinned: true,
    pinnedTime: "2025-10-20T08:00:00.000Z",
    isDeleted: false
  },
  {
    id: "4",
    text: "电梯井、电缆井应分别独立设置。电缆井、管道井、排烟道、排气道、垃圾道等竖向井道，应分别独立设置，井壁的耐火极限不应低于1.00h。（《建筑设计防火规范》GB50016-2014）",
    keywords: ["电梯井", "电缆井", "防火规范"],
    createTime: "2025-10-16T16:45:00.000Z",
    updateTime: "2025-10-16T16:45:00.000Z",
    copyCount: 1,
    isPinned: false,
    isDeleted: false
  }
];

/**
 * 主应用组件
 */
export default function App() {
  // 状态管理
  const [currentView, setCurrentView] = useState<ViewType>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TextItem | null>(null);
  const [editingItem, setEditingItem] = useState<TextItem | undefined>(undefined);
  const [isMultiSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [actionSheetItem, setActionSheetItem] = useState<TextItem | null>(null);

  // 数据管理
  const { 
    items, 
    loading, 
    addItem, 
    updateItem, 
    deleteItem, 
    replaceAll 
  } = useLocalStorage();

  // 搜索功能
  const {
    searchText,
    isSearching,
    searchResults,
    startSearch,
    endSearch,
    updateSearchText,
    clearSearch
  } = useSearch(items, currentView);

  // 初始化示例数据
  React.useEffect(() => {
    if (items.length === 0 && !loading) {
      replaceAll(initialData);
    }
  }, [items.length, loading, replaceAll]);

  // 自动清理回收站
  React.useEffect(() => {
    if (items.length > 0) {
      const cleanedItems = autoCleanTrash(items);
      if (cleanedItems.length !== items.length) {
        replaceAll(cleanedItems);
      }
    }
  }, [items, replaceAll]);


  // 处理长按显示操作菜单
  const handleLongPress = useCallback((item: TextItem) => {
    if (!isMultiSelecting) {
      setActionSheetItem(item);
      setActionSheetVisible(true);
    }
  }, [isMultiSelecting]);

  // 处理操作
  const handleAction = useCallback(async (action: ActionType, item?: TextItem) => {
    const targetItem = item || selectedItem || actionSheetItem;
    if (!targetItem) return;

    switch (action) {
      case 'copy':
        const success = await copyToClipboard(targetItem.text);
        if (success) {
          showCopySuccess();
          updateItem(targetItem.id, { 
            copyCount: targetItem.copyCount + 1 
          });
        } else {
          showCopyError();
        }
        break;

      case 'pin':
        updateItem(targetItem.id, { 
          isPinned: true, 
          pinnedTime: new Date().toISOString() 
        });
        break;

      case 'unpin':
        updateItem(targetItem.id, { 
          isPinned: false, 
          pinnedTime: undefined 
        });
        break;

      case 'delete':
        if (confirm('确定要移动到回收站吗？可在30天内恢复')) {
          const updatedItem = moveToTrash(targetItem);
          updateItem(targetItem.id, updatedItem);
        }
        break;

      case 'restore':
        const restoredItem = restoreFromTrash(targetItem);
        updateItem(targetItem.id, restoredItem);
        break;

      case 'permanentDelete':
        if (confirm('确定要永久删除吗？此操作不可恢复')) {
          deleteItem(targetItem.id);
        }
        break;
    }
    
    // 操作完成后关闭 ActionSheet
    if (actionSheetVisible) {
      setActionSheetVisible(false);
      setActionSheetItem(null);
    }
  }, [selectedItem, actionSheetItem, actionSheetVisible, updateItem, deleteItem]);

  // 处理卡片双击复制
  const handleCardCopy = useCallback((item: TextItem) => {
    updateItem(item.id, { 
      copyCount: item.copyCount + 1 
    });
  }, [updateItem]);

  // 处理文本保存
  const handleSaveItem = useCallback((item: TextItem) => {
    if (editingItem && editingItem.id) {
      updateItem(item.id, item);
      // 如果是编辑现有项目，更新详情浮层的内容
      if (selectedItem && selectedItem.id === item.id) {
        setSelectedItem(item);
      }
    } else {
      addItem(item);
    }
    setEditingItem(undefined);
  }, [editingItem, selectedItem, updateItem, addItem]);

  // 处理多选
  const handleMultiSelect = useCallback((itemId: string, selected: boolean) => {
    if (selected) {
      setSelectedIds(prev => [...prev, itemId]);
    } else {
      setSelectedIds(prev => prev.filter(id => id !== itemId));
    }
  }, []);

  // 导出数据
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `text-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [items]);

  // 导入数据
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (validateImportData(data)) {
            if (confirm('导入数据将替换现有数据，确定继续吗？')) {
              replaceAll(data);
              alert('导入成功！');
            }
          } else {
            alert('数据格式不正确，请检查文件内容');
          }
        } catch (error) {
          alert('文件解析失败，请检查文件格式');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [replaceAll]);

  // 渲染空状态
  const renderEmptyState = () => {
    const configs = {
      all: { icon: '📝', title: '暂无笔记', description: '点击右下角按钮添加第一条笔记' },
      pinned: { icon: '📌', title: '暂无置顶笔记', description: '长按笔记卡片可以置顶' },
      trash: { icon: '🗑️', title: '回收站为空', description: '删除的笔记会显示在这里' }
    };
    
    const config = configs[currentView];
    return (
      <EmptyState
        icon={config.icon}
        title={config.title}
        description={config.description}
        action={currentView === 'all' ? {
          label: '添加笔记',
          onClick: () => setEditingItem({} as TextItem)
        } : undefined}
      />
    );
  };

  if (loading) {
    return (
      <div className="app app--loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        currentView={currentView}
        onMenuClick={() => setSidebarOpen(true)}
        onSearchClick={startSearch}
        isSearching={isSearching}
        onBackClick={endSearch}
        searchText={searchText}
        onSearchTextChange={updateSearchText}
        onSearchClear={clearSearch}
      />

      <Sidebar
        isOpen={sidebarOpen}
        currentView={currentView}
        onClose={() => setSidebarOpen(false)}
        onViewChange={setCurrentView}
        onExport={handleExport}
        onImport={handleImport}
      />

      <main className="app__main">
        {searchResults.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="app__content">
            {searchResults.map((item) => (
              <TextCard
                key={item.id}
                item={item}
                searchText={searchText}
                onClick={() => setSelectedItem(item)}
                onLongPress={() => handleLongPress(item)}
                onCopy={handleCardCopy}
                isSelected={selectedIds.includes(item.id)}
                onSelectionChange={(selected) => handleMultiSelect(item.id, selected)}
                showCheckbox={isMultiSelecting}
              />
            ))}
          </div>
        )}
      </main>

      <FloatingButton
        onClick={() => setEditingItem({} as TextItem)}
        position="bottom-right"
        size="small"
      />

      {selectedItem && (
        <TextDetail
          item={selectedItem}
          isVisible={!!selectedItem}
          searchText={searchText}
          onClose={() => setSelectedItem(null)}
          onEdit={() => {
            setEditingItem(selectedItem);
            // 不关闭详情浮层，让两个浮层同时存在
          }}
          onAction={(action) => handleAction(action)}
        />
      )}

      <TextEditor
        isVisible={editingItem !== undefined}
        item={editingItem}
        onClose={() => setEditingItem(undefined)}
        onSave={handleSaveItem}
      />

      <ActionSheet
        isVisible={actionSheetVisible}
        item={actionSheetItem}
        onClose={() => {
          setActionSheetVisible(false);
          setActionSheetItem(null);
        }}
        onAction={(action) => handleAction(action)}
      />
    </div>
  );
}
