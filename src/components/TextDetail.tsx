import React from 'react';
import { TextItem, ActionType } from '../types/index.js';
import { KeywordTag } from './KeywordTag.js';
import { ActionSheet } from './ActionSheet.js';
import { useSwipe } from '../hooks/useSwipe.js';
import { formatDate } from '../utils/date.js';
import { highlightText } from '../utils/highlight.js';
import './TextDetail.css';

interface TextDetailProps {
  item: TextItem | null;
  isVisible: boolean;
  searchText?: string;
  onClose: () => void;
  onEdit: () => void;
  onAction: (action: ActionType) => void;
}

/**
 * 文本详情浮层组件
 */
export function TextDetail({
  item,
  isVisible,
  searchText = '',
  onClose,
  onEdit,
  onAction
}: TextDetailProps) {
  const [showActionSheet, setShowActionSheet] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleClose = () => {
    // 先触发退出动画
    setIsAnimating(false);
    // 等待动画完成后调用 onClose
    setTimeout(() => {
      onClose();
      setShouldRender(false);
    }, 300); // 与 CSS 动画时间一致
  };

  // 处理显示和隐藏
  React.useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // 延迟添加动画类，确保 DOM 渲染完成
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  const swipeHandlers = useSwipe({
    onSwipeLeft: handleClose,
    preventDefault: false
  });

  const handleAction = (action: ActionType) => {
    onAction(action);
    setShowActionSheet(false);
  };

  const handleMoreClick = () => {
    setShowActionSheet(true);
  };

  // 只有在应该渲染时才渲染
  if (!shouldRender || !item || !item.text) return null;

  const highlightedText = highlightText(item.text, searchText);

  return (
    <>
      <div 
        className={`text-detail ${isAnimating ? 'text-detail--visible' : ''}`}
        {...swipeHandlers}
      >
        <div className="text-detail__header">
          <button 
            className="text-detail__back"
            onClick={handleClose}
            aria-label="返回"
          >
            ←
          </button>
          <h2 className="text-detail__title">文本详情</h2>
          <div className="text-detail__actions">
            <button 
              className="text-detail__edit"
              onClick={onEdit}
              aria-label="编辑"
            >
              ✏️
            </button>
            <button 
              className="text-detail__more"
              onClick={handleMoreClick}
              aria-label="更多操作"
            >
              ⋯
            </button>
          </div>
        </div>

        <div className="text-detail__content">
          <div 
            className="text-detail__text"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
          
          {item.keywords.length > 0 && (
            <div className="text-detail__keywords">
              <h3 className="text-detail__keywords-title">关键字</h3>
              <div className="text-detail__keywords-list">
                {item.keywords.map((keyword, index) => (
                  <KeywordTag
                    key={index}
                    keyword={keyword}
                    size="medium"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-detail__footer">
          <div className="text-detail__meta">
            <div className="text-detail__meta-item">
              <span className="text-detail__meta-label">创建时间</span>
              <span className="text-detail__meta-value">
                {formatDate(item.createTime, 'YYYY-MM-DD HH:mm')}
              </span>
            </div>
            <div className="text-detail__meta-item">
              <span className="text-detail__meta-label">修改时间</span>
              <span className="text-detail__meta-value">
                {formatDate(item.updateTime, 'YYYY-MM-DD HH:mm')}
              </span>
            </div>
            <div className="text-detail__meta-item">
              <span className="text-detail__meta-label">复制次数</span>
              <span className="text-detail__meta-value">
                {item.copyCount} 次
              </span>
            </div>
          </div>
        </div>
      </div>

      <ActionSheet
        isVisible={showActionSheet}
        item={item}
        onClose={() => setShowActionSheet(false)}
        onAction={handleAction}
      />
    </>
  );
}
