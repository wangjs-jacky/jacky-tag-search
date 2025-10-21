import { KEYWORD_COLORS } from '../constants/index.js';
import './KeywordTag.css';

interface KeywordTagProps {
  keyword: string;
  onRemove?: () => void;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  onClick?: () => void;
}

/**
 * 关键字标签组件
 */
export function KeywordTag({ 
  keyword, 
  onRemove, 
  color, 
  size = 'medium',
  clickable = false,
  onClick 
}: KeywordTagProps) {
  // 根据关键字生成一致的颜色
  const getKeywordColor = (keyword: string): string => {
    if (color) return color;
    
    let hash = 0;
    for (let i = 0; i < keyword.length; i++) {
      hash = keyword.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % KEYWORD_COLORS.length;
    return KEYWORD_COLORS[index];
  };

  const tagColor = getKeywordColor(keyword);
  
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <span 
      className={`keyword-tag keyword-tag--${size} ${clickable ? 'keyword-tag--clickable' : ''}`}
      style={{ backgroundColor: tagColor }}
      onClick={handleClick}
    >
      <span className="keyword-tag__text">#{keyword}</span>
      {onRemove && (
        <button 
          className="keyword-tag__remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`移除关键字 ${keyword}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
