import { TextItem } from '../types/index.js';
import { KeywordTag } from './KeywordTag.js';
import { useLongPress } from '../hooks/useLongPress.js';
import { getFriendlyDate } from '../utils/date.js';
import { getHighlightedPreview } from '../utils/highlight.js';
import { copyToClipboard, showCopySuccess, showCopyError } from '../utils/copy.js';
import { HiBookmark } from 'react-icons/hi';
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './TextCard.css';

interface TextCardProps {
  item: TextItem;
  searchText?: string;
  onClick: () => void;
  onLongPress: () => void;
  onCopy?: (item: TextItem) => void;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  showCheckbox?: boolean;
  index?: number; // 添加索引用于交错动画
}

/**
 * 文本卡片组件
 */
export function TextCard({
  item,
  searchText = '',
  onClick,
  onLongPress,
  onCopy,
  isSelected = false,
  onSelectionChange,
  showCheckbox = false,
  index = 0
}: TextCardProps) {
  const [spotlightPosition, setSpotlightPosition] = useState<{ x: number; y: number } | null>(null);
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastClickTimeRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);

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

  // 双击快速复制功能
  const handleDoubleClick = useCallback(async () => {
    try {
      await copyToClipboard(item.text);
      showCopySuccess();
      // 通知父组件更新复制次数
      onCopy?.(item);
    } catch (error) {
      console.error('复制失败:', error);
      showCopyError();
    }
  }, [item, onCopy]);

  // 点击处理函数 - 更简单的版本
  const handleClick = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastClickTimeRef.current;
    
    // 如果两次点击间隔小于 300ms，认为是双击
    if (timeDiff < 300 && clickCountRef.current === 1) {
      // 双击：快速复制
      handleDoubleClick();
      clickCountRef.current = 0;
      lastClickTimeRef.current = 0;
      return;
    }
    
    // 更新点击计数和时间
    clickCountRef.current = 1;
    lastClickTimeRef.current = now;
    
    // 延迟执行单击逻辑
    setTimeout(() => {
      if (clickCountRef.current === 1) {
        // 单击：正常点击
        if (showCheckbox) {
          onSelectionChange?.(!isSelected);
        } else {
          onClick();
        }
      }
      clickCountRef.current = 0;
    }, 150); // 进一步减少延迟时间
  }, [handleDoubleClick, onClick, onSelectionChange, showCheckbox, isSelected]);

  const longPressHandlers = useLongPress({
    onLongPress: () => {
      handleLongPressEnd();
      onLongPress();
    },
    onClick: undefined, // 不使用 useLongPress 的 onClick
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

  // 添加原生点击事件处理
  const handleNativeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleClick();
  };

  const preview = getHighlightedPreview(item.text, searchText, 100);

  // 定义动画变体
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1, // 交错动画延迟
        ease: [0.25, 0.46, 0.45, 0.94] as const, // 自定义缓动函数
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  };

  // 定义聚光灯动画变体
  const spotlightVariants = {
    hidden: {
      scale: 0,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    },
    exit: {
      scale: 1.2,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn" as const
      }
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      className={`text-card ${item.isPinned ? 'text-card--pinned' : ''} ${isSelected ? 'text-card--selected' : ''} ${showCheckbox ? 'text-card--with-checkbox' : ''} ${isSpotlightActive ? 'text-card--spotlight' : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onClick={handleNativeClick}
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
        <motion.div 
          className="text-card__spotlight"
          variants={spotlightVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
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
    </motion.div>
  );
}
