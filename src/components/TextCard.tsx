import { TextItem } from '../types/index.js';
import { KeywordTag } from './KeywordTag.js';
import { useLongPress } from '../hooks/useLongPress.js';
import { getFriendlyDate } from '../utils/date.js';
import { getHighlightedPreview } from '../utils/highlight.js';
import './TextCard.css';

interface TextCardProps {
  item: TextItem;
  searchText?: string;
  onClick: () => void;
  onLongPress: () => void;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  showCheckbox?: boolean;
}

/**
 * 文本卡片组件
 */
export function TextCard({
  item,
  searchText = '',
  onClick,
  onLongPress,
  isSelected = false,
  onSelectionChange,
  showCheckbox = false
}: TextCardProps) {
  const longPressHandlers = useLongPress({
    onLongPress,
    onClick: showCheckbox ? () => onSelectionChange?.(!isSelected) : onClick,
    dragThreshold: 15, // 设置15像素的拖动阈值
    longPressThreshold: 8 // 设置8像素的长按阈值，更严格
  });

  const preview = getHighlightedPreview(item.text, searchText, 100);

  return (
    <div 
      className={`text-card ${item.isPinned ? 'text-card--pinned' : ''} ${isSelected ? 'text-card--selected' : ''} ${showCheckbox ? 'text-card--with-checkbox' : ''}`}
      {...longPressHandlers}
    >
      {showCheckbox && (
        <div className="text-card__checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectionChange?.(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      
      <div className="text-card__content">
        <div className="text-card__header">
          <div 
            className="text-card__preview"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
          {item.isPinned && (
            <div className="text-card__pinned-icon" title="已置顶">
              📌
            </div>
          )}
        </div>
        
        {item.keywords.length > 0 && (
          <div className="text-card__keywords">
            {item.keywords.map((keyword, index) => (
              <KeywordTag
                key={index}
                keyword={keyword}
                size="small"
              />
            ))}
          </div>
        )}
        
        <div className="text-card__footer">
          <span className="text-card__date">
            {getFriendlyDate(item.createTime)}
          </span>
          {item.copyCount > 0 && (
            <span className="text-card__copy-count">
              已复制 {item.copyCount} 次
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
