import { TextItem, ActionType } from '../types/index.js';
import './ActionSheet.css';

interface ActionSheetProps {
  isVisible: boolean;
  item: TextItem | null;
  onClose: () => void;
  onAction: (action: ActionType) => void;
}

/**
 * 操作菜单组件
 */
export function ActionSheet({ isVisible, item, onClose, onAction }: ActionSheetProps) {
  if (!isVisible || !item) return null;

  const actions = [
    {
      type: 'copy' as ActionType,
      label: '复制内容',
      icon: '📋',
      danger: false
    },
    {
      type: item.isPinned ? 'unpin' as ActionType : 'pin' as ActionType,
      label: item.isPinned ? '取消置顶' : '置顶',
      icon: '📌',
      danger: false
    },
    {
      type: 'delete' as ActionType,
      label: '移动到回收站',
      icon: '🗑️',
      danger: true
    }
  ];

  const handleActionClick = (action: ActionType) => {
    onAction(action);
    onClose();
  };

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className="action-sheet__overlay"
        onClick={onClose}
      />
      
      {/* 操作菜单 */}
      <div className="action-sheet">
        <div className="action-sheet__header">
          <h3 className="action-sheet__title">选择操作</h3>
          <button 
            className="action-sheet__close"
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>
        
        <div className="action-sheet__content">
          {actions.map((action) => (
            <button
              key={action.type}
              className={`action-sheet__item ${action.danger ? 'action-sheet__item--danger' : ''}`}
              onClick={() => handleActionClick(action.type)}
            >
              <span className="action-sheet__item-icon">{action.icon}</span>
              <span className="action-sheet__item-label">{action.label}</span>
            </button>
          ))}
        </div>
        
        <div className="action-sheet__footer">
          <button 
            className="action-sheet__cancel"
            onClick={onClose}
          >
            取消
          </button>
        </div>
      </div>
    </>
  );
}
