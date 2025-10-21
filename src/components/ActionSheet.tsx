import { TextItem, ActionType } from '../types/index.js';
import './ActionSheet.css';

interface ActionSheetProps {
  isVisible: boolean;
  item: TextItem | null;
  onClose: () => void;
  onAction: (action: ActionType) => void;
  currentView?: 'all' | 'pinned' | 'trash';
}

/**
 * 操作菜单组件
 */
export function ActionSheet({ isVisible, item, onClose, onAction, currentView = 'all' }: ActionSheetProps) {
  if (!isVisible || !item) return null;

  // 根据当前视图显示不同的操作选项
  const getActions = () => {
    if (currentView === 'trash') {
      // 回收站视图：显示恢复和永久删除
      return [
        {
          type: 'copy' as ActionType,
          label: '复制内容',
          danger: false
        },
        {
          type: 'multiSelect' as ActionType,
          label: '多选',
          danger: false
        },
        {
          type: 'restore' as ActionType,
          label: '恢复',
          danger: false
        },
        {
          type: 'permanentDelete' as ActionType,
          label: '永久删除',
          danger: true
        }
      ];
    } else {
      // 普通视图：显示置顶和移入回收站
      return [
        {
          type: 'copy' as ActionType,
          label: '复制内容',
          danger: false
        },
        {
          type: 'multiSelect' as ActionType,
          label: '多选',
          danger: false
        },
        {
          type: item.isPinned ? 'unpin' as ActionType : 'pin' as ActionType,
          label: item.isPinned ? '取消置顶' : '置顶',
          danger: false
        },
        {
          type: 'delete' as ActionType,
          label: '移入回收站',
          danger: true
        }
      ];
    }
  };

  const actions = getActions();

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
        <div className="action-sheet__content">
          {actions.map((action) => (
            <button
              key={action.type}
              className={`action-sheet__item ${action.danger ? 'action-sheet__item--danger' : ''}`}
              onClick={() => handleActionClick(action.type)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
