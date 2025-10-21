import { ViewType } from '../types/index.js';
import { HiMenu, HiSearch, HiArrowLeft, HiX } from 'react-icons/hi';
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
}

/**
 * 顶部导航栏组件
 */
export function Header({
  currentView: _currentView,
  onMenuClick,
  onSearchClick,
  isSearching = false,
  onBackClick,
  searchText = '',
  onSearchTextChange,
  onSearchClear
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
