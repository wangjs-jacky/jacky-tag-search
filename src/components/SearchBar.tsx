import './SearchBar.css';

interface SearchBarProps {
  isVisible: boolean;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onClose: () => void;
  placeholder?: string;
}

/**
 * 搜索栏组件
 */
export function SearchBar({
  isVisible,
  searchText,
  onSearchTextChange,
  onClose,
  placeholder = '搜索关键字或文本...'
}: SearchBarProps) {
  if (!isVisible) return null;

  return (
    <div className="search-bar">
      <div className="search-bar__container">
        <button 
          className="search-bar__back"
          onClick={onClose}
          aria-label="返回"
        >
          ←
        </button>
        <div className="search-bar__input-container">
          <input
            type="text"
            className="search-bar__input"
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            autoFocus
          />
        </div>
        {searchText && (
          <button 
            className="search-bar__clear"
            onClick={() => onSearchTextChange('')}
            aria-label="清除搜索"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
