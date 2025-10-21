import { ViewType } from '../types/index.js';
import { HiMenu, HiSearch, HiArrowLeft, HiX, HiTrash, HiRefresh } from 'react-icons/hi';
import './Header.css';

interface HeaderProps {
  currentView: ViewType;
  onMenuClick: () => void;
  onSearchClick: () => void;
  isSearching?: boolean;
  onBackClick?: () => void;
  searchText?: string;
  onSearchTextChange?: (text: string) => void;
  onSearchClear?: () => void;
  isMultiSelecting?: boolean;
  selectedCount?: number;
  onBatchDelete?: () => void;
  onBatchRestore?: () => void;
  onExitMultiSelect?: () => void;
}

/**
 * 顶部导航栏组件
 */
export function Header({
  currentView,
  onMenuClick,
  onSearchClick,
  isSearching = false,
  onBackClick,
  searchText = '',
  onSearchTextChange,
  onSearchClear,
  isMultiSelecting = false,
  selectedCount = 0,
  onBatchDelete,
  onBatchRestore,
  onExitMultiSelect
}: HeaderProps) {
  if (isSearching) {
    return (
      <header className="header header--searching">
        <button 
          className="header__back-button"
          onClick={onBackClick}
          aria-label="返回"
        >
          <HiArrowLeft />
        </button>
        <div className="header__search-container">
          <input
            type="text"
            className="header__search-input"
            placeholder="搜索关键字或文本..."
            value={searchText}
            onChange={(e) => onSearchTextChange?.(e.target.value)}
            autoFocus
          />
        </div>
        {searchText && (
          <button 
            className="header__clear-button"
            onClick={onSearchClear}
            aria-label="清除搜索"
          >
            <HiX />
          </button>
        )}
      </header>
    );
  }

  if (isMultiSelecting) {
    return (
      <header className="header header--multi-select">
        <button 
          className="header__back-button"
          onClick={onExitMultiSelect}
          aria-label="取消多选"
        >
          <HiX />
        </button>
        <div className="header__title">
          已选择 {selectedCount} 项
        </div>
        {selectedCount > 0 && (
          <>
            {currentView === 'trash' ? (
              <button 
                className="header__restore-button"
                onClick={onBatchRestore}
                aria-label="恢复选中项"
              >
                <HiRefresh />
              </button>
            ) : (
              <button 
                className="header__delete-button"
                onClick={onBatchDelete}
                aria-label="删除选中项"
              >
                <HiTrash />
              </button>
            )}
          </>
        )}
      </header>
    );
  }

  return (
    <header className="header">
      <button 
        className="header__menu-button"
        onClick={onMenuClick}
        aria-label="打开菜单"
      >
        <HiMenu />
      </button>
      <div className="header__title">
      </div>
      <button 
        className="header__search-button"
        onClick={onSearchClick}
        aria-label="搜索"
      >
        <HiSearch />
      </button>
    </header>
  );
}
