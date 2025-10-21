import React from 'react';
import { createPortal } from 'react-dom';
import { TextItem, ActionType } from '../types/index.js';
import { KeywordTag } from './KeywordTag.js';
import { ActionSheet } from './ActionSheet.js';
import { useSwipe } from '../hooks/useSwipe.js';
import { highlightText } from '../utils/highlight.js';
import { copyToClipboard, showCopySuccess, showCopyError } from '../utils/copy.js';
import { HiArrowLeft, HiPencil, HiDotsVertical, HiClipboard } from 'react-icons/hi';
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

  const handleQuickCopy = async () => {
    if (!item) return;
    
    const success = await copyToClipboard(item.text);
    if (success) {
      showCopySuccess();
    } else {
      showCopyError();
    }
  };

  // 只有在应该渲染时才渲染
  if (!shouldRender || !item || !item.text) return null;

  const highlightedText = highlightText(item.text, searchText);

  return createPortal(
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
            <HiArrowLeft />
          </button>
          <div className="text-detail__actions">
            <button 
              className="text-detail__edit"
              onClick={onEdit}
              aria-label="编辑"
            >
              <HiPencil />
            </button>
            <button 
              className="text-detail__copy"
              onClick={handleQuickCopy}
              aria-label="快速复制"
            >
              <HiClipboard />
            </button>
            <button 
              className="text-detail__more"
              onClick={handleMoreClick}
              aria-label="更多操作"
            >
              <HiDotsVertical />
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
      </div>

      <ActionSheet
        isVisible={showActionSheet}
        item={item}
        onClose={() => setShowActionSheet(false)}
        onAction={handleAction}
      />
    </>,
    document.body
  );
}
