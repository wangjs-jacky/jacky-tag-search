import { TextItem } from '../types/index.js';
import { KeywordTag } from './KeywordTag.js';
import { useLongPress } from '../hooks/useLongPress.js';
import { getFriendlyDate } from '../utils/date.js';
import { getHighlightedPreview } from '../utils/highlight.js';
import { HiBookmark } from 'react-icons/hi';
import { useState, useRef } from 'react';
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
  const [spotlightPosition, setSpotlightPosition] = useState<{ x: number; y: number } | null>(null);
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleLongPressStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    let x: number, y: number;
    
    if ('touches' in event && event.touches.length > 0) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else if ('clientX' in event) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      return;
    }
    
    setSpotlightPosition({ x, y });
    setIsSpotlightActive(true);
  };

  const handleLongPressEnd = () => {
    setIsSpotlightActive(false);
    setTimeout(() => {
      setSpotlightPosition(null);
    }, 300); // 等待动画完成
  };

  const longPressHandlers = useLongPress({
    onLongPress: () => {
      handleLongPressEnd();
      onLongPress();
    },
    onClick: showCheckbox ? () => onSelectionChange?.(!isSelected) : onClick,
    dragThreshold: 15,
    longPressThreshold: 8
  });

  // 添加鼠标和触摸事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    handleLongPressStart(e);
    longPressHandlers.onMouseDown(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleLongPressStart(e);
    longPressHandlers.onTouchStart(e);
  };

  const preview = getHighlightedPreview(item.text, searchText, 100);

  return (
    <div 
      ref={cardRef}
      className={`text-card ${item.isPinned ? 'text-card--pinned' : ''} ${isSelected ? 'text-card--selected' : ''} ${showCheckbox ? 'text-card--with-checkbox' : ''} ${isSpotlightActive ? 'text-card--spotlight' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseMove={longPressHandlers.onMouseMove}
      onTouchMove={longPressHandlers.onTouchMove}
      onMouseUp={longPressHandlers.onMouseUp}
      onMouseLeave={longPressHandlers.onMouseLeave}
      onTouchEnd={longPressHandlers.onTouchEnd}
      onTouchCancel={longPressHandlers.onTouchCancel}
    >
      {/* 聚光灯效果 */}
      {spotlightPosition && (
        <div 
          className="text-card__spotlight"
          style={{
            left: spotlightPosition.x,
            top: spotlightPosition.y,
            transform: `translate(-50%, -50%)`
          }}
        />
      )}
      
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
              <HiBookmark />
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
